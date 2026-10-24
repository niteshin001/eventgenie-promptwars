"""
EventGenie AI - Production-Quality HTTP & API Server
Built with Python 3 standard library ThreadingHTTPServer.
Zero third-party package dependencies required to run!
"""

import os
import sys
import json
import urllib.parse
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from typing import Dict, Any, Tuple

# Add backend directory to sys.path
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BACKEND_DIR)
FRONTEND_DIR = os.path.join(PROJECT_ROOT, "frontend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

import database
from demo_data import CAMPUS_CARNIVAL_2026, PRESET_TEMPLATES
import planner_engine
import gemini_client

PORT = int(os.environ.get("PORT", 8000))

class EventGenieHandler(SimpleHTTPRequestHandler):
    """
    Custom HTTP Request Handler serving both REST API endpoints
    and static frontend assets with full CORS and JSON error handling.
    """
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=FRONTEND_DIR, **kwargs)

    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

    def _send_json_response(self, data: Any, status: int = 200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self._send_cors_headers()
        self.end_headers()
        response_bytes = json.dumps(data, ensure_ascii=False, indent=2).encode("utf-8")
        self.wfile.write(response_bytes)

    def _parse_json_body(self) -> Dict[str, Any]:
        content_length = int(self.headers.get("Content-Length", 0))
        if content_length == 0:
            return {}
        body = self.rfile.read(content_length).decode("utf-8")
        try:
            return json.loads(body)
        except json.JSONDecodeError:
            return {}

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        
        # API Routes
        if path == "/api/health":
            self._send_json_response({
                "status": "healthy",
                "app": "EventGenie AI",
                "version": "1.0.0",
                "ai_configured": gemini_client.is_ai_configured(),
                "model": gemini_client.DEFAULT_MODEL if gemini_client.is_ai_configured() else "smart-demo-engine",
                "database": "sqlite3",
                "demo_event_ready": True
            })
            return
            
        if path == "/api/demo":
            self._send_json_response(CAMPUS_CARNIVAL_2026)
            return
            
        if path == "/api/presets":
            self._send_json_response(PRESET_TEMPLATES)
            return

        if path == "/api/plans":
            plans = database.list_events()
            self._send_json_response({"plans": plans})
            return
            
        if path.startswith("/api/plans/"):
            plan_id = path.replace("/api/plans/", "").strip()
            plan = database.get_event(plan_id)
            if plan:
                self._send_json_response(plan)
            else:
                self._send_json_response({"error": f"Plan '{plan_id}' not found."}, status=404)
            return

        # Default static file serving (e.g. index.html, styles.css, app.js)
        if path == "/" or path == "":
            self.path = "/index.html"
            
        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        body = self._parse_json_body()

        try:
            if path == "/api/config/gemini-key":
                api_key = body.get("api_key", "").strip()
                if api_key:
                    gemini_client.set_runtime_api_key(api_key)
                    self._send_json_response({
                        "success": True,
                        "ai_configured": True,
                        "message": "Gemini API Key configured successfully for this session."
                    })
                else:
                    gemini_client.set_runtime_api_key("")
                    self._send_json_response({
                        "success": True,
                        "ai_configured": False,
                        "message": "Gemini API Key cleared. Reverted to Smart Demo Engine."
                    })
                return

            if path == "/api/generate-plan":
                plan = gemini_client.generate_ai_event_blueprint(body)
                # Auto-save to SQLite database
                database.save_event(plan)
                self._send_json_response(plan)
                return

            if path == "/api/replan-budget":
                current_plan = body.get("plan", {})
                reduction_pct = float(body.get("reduction_percent", 15.0))
                protected = body.get("protected_categories", ["Food & Catering", "Venue & Facilities"])
                
                result = planner_engine.reduce_budget_smartly(
                    current_plan.get("budget_breakdown", {}),
                    reduction_percent=reduction_pct,
                    protected_category_names=protected
                )
                self._send_json_response(result)
                return

            if path == "/api/copilot":
                current_plan = body.get("plan", {})
                message = body.get("message", "")
                result = gemini_client.ai_copilot_assistant(current_plan, message)
                self._send_json_response(result)
                return

            if path == "/api/plans":
                plan_id = database.save_event(body)
                self._send_json_response({"success": True, "id": plan_id})
                return

            # Unknown API route
            self._send_json_response({"error": f"API route not found: {path}"}, status=404)
            
        except Exception as e:
            self._send_json_response({"error": str(e)}, status=500)

    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        
        if path.startswith("/api/plans/"):
            plan_id = path.replace("/api/plans/", "").strip()
            success = database.delete_event(plan_id)
            if success:
                self._send_json_response({"success": True, "deleted_id": plan_id})
            else:
                self._send_json_response({"error": f"Plan '{plan_id}' not found."}, status=404)
            return

        self._send_json_response({"error": "Method not allowed"}, status=405)


def run_server(port: int = PORT):
    # Initialize SQLite database
    database.init_db()
    
    # Pre-populate demo event in SQLite if not present
    if not database.get_event("demo_campus_carnival_2026"):
        database.save_event(CAMPUS_CARNIVAL_2026)

    server_address = ("0.0.0.0", port)
    httpd = ThreadingHTTPServer(server_address, EventGenieHandler)
    print(f"==================================================")
    print(f"EventGenie AI Server running at http://127.0.0.1:{port}")
    print(f"AI Status: {'Live Gemini Configured' if gemini_client.is_ai_configured() else 'Smart Demo Mode (Deterministic Engine)'}")
    print(f"Serving frontend from: {FRONTEND_DIR}")
    print(f"==================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server gracefully...")
        httpd.server_close()

if __name__ == "__main__":
    run_server()
