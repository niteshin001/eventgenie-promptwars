#!/usr/bin/env python3
"""
EventGenie AI - Production WSGI Application & Server
Fully compatible with Vercel Serverless Python runtime ('main:app')
and local standalone Python development.
"""

import sys
import os
import json
import mimetypes
from urllib.parse import parse_qs

# Path setup
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(PROJECT_ROOT, "backend")
PUBLIC_DIR = os.path.join(PROJECT_ROOT, "public")
FRONTEND_DIR = os.path.join(PROJECT_ROOT, "frontend")

for p in [PROJECT_ROOT, BACKEND_DIR]:
    if p not in sys.path:
        sys.path.insert(0, p)

import database
from demo_data import CAMPUS_CARNIVAL_2026, PRESET_TEMPLATES
import planner_engine
import gemini_client

def app(environ, start_response):
    """
    Standard WSGI callable expected by Vercel Serverless Python runtime.
    Handles REST API routing and static asset delivery.
    """
    path = environ.get('PATH_INFO', '/')
    method = environ.get('REQUEST_METHOD', 'GET').upper()

    # Normalize path if Vercel internally prefixes with /api/index.py or /api/main.py
    if path.startswith('/api/index.py'):
        path = path.replace('/api/index.py', '/api')
    if path.startswith('/api/main.py'):
        path = path.replace('/api/main.py', '/api')
    if path.startswith('/api/server.py'):
        path = path.replace('/api/server.py', '/api')

    # CORS Headers
    cors_headers = [
        ('Access-Control-Allow-Origin', '*'),
        ('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'),
        ('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    ]

    # Handle CORS Preflight
    if method == 'OPTIONS':
        start_response('204 No Content', cors_headers + [('Content-Length', '0')])
        return [b'']

    def json_response(data, status_code=200):
        status_map = {
            200: '200 OK',
            201: '201 Created',
            204: '204 No Content',
            400: '400 Bad Request',
            404: '404 Not Found',
            405: '405 Method Not Allowed',
            500: '500 Internal Server Error'
        }
        status_str = status_map.get(status_code, f"{status_code} OK")
        payload = json.dumps(data, ensure_ascii=False, indent=2).encode('utf-8')
        headers = cors_headers + [
            ('Content-Type', 'application/json; charset=utf-8'),
            ('Content-Length', str(len(payload)))
        ]
        start_response(status_str, headers)
        return [payload]

    def parse_body():
        try:
            content_length = int(environ.get('CONTENT_LENGTH', 0) or 0)
        except (ValueError, TypeError):
            content_length = 0

        if content_length > 0:
            body_bytes = environ['wsgi.input'].read(content_length)
            try:
                return json.loads(body_bytes.decode('utf-8'))
            except Exception:
                return {}
        return {}

    # === API ROUTES ===
    if path in ['/api/health', '/api/health/']:
        return json_response({
            "status": "healthy",
            "app": "EventGenie AI",
            "version": "1.0.0",
            "ai_configured": gemini_client.is_ai_configured(),
            "model": gemini_client.DEFAULT_MODEL if gemini_client.is_ai_configured() else "smart-demo-engine",
            "database": "sqlite3",
            "demo_event_ready": True
        })

    if path in ['/api/demo', '/api/demo/']:
        return json_response(CAMPUS_CARNIVAL_2026)

    if path in ['/api/presets', '/api/presets/']:
        return json_response(PRESET_TEMPLATES)

    if path in ['/api/plans', '/api/plans/']:
        if method == 'GET':
            plans = database.list_events()
            return json_response({"plans": plans})
        elif method == 'POST':
            body = parse_body()
            plan_id = database.save_event(body)
            return json_response({"success": True, "id": plan_id})

    if path.startswith('/api/plans/'):
        plan_id = path.replace('/api/plans/', '').strip()
        if method == 'GET':
            plan = database.get_event(plan_id)
            if plan:
                return json_response(plan)
            return json_response({"error": f"Plan '{plan_id}' not found."}, 404)
        elif method == 'DELETE':
            success = database.delete_event(plan_id)
            if success:
                return json_response({"success": True, "deleted_id": plan_id})
            return json_response({"error": f"Plan '{plan_id}' not found."}, 404)

    if path == '/api/config/gemini-key' and method == 'POST':
        body = parse_body()
        api_key = body.get("api_key", "").strip()
        if api_key:
            gemini_client.set_runtime_api_key(api_key)
            return json_response({
                "success": True,
                "ai_configured": True,
                "message": "Gemini API Key configured successfully for this session."
            })
        else:
            gemini_client.set_runtime_api_key("")
            return json_response({
                "success": True,
                "ai_configured": False,
                "message": "Gemini API Key cleared. Reverted to Smart Demo Engine."
            })

    if path == '/api/generate-plan' and method == 'POST':
        body = parse_body()
        plan = gemini_client.generate_ai_event_blueprint(body)
        database.save_event(plan)
        return json_response(plan)

    if path == '/api/replan-budget' and method == 'POST':
        body = parse_body()
        current_plan = body.get("plan", {})
        reduction_pct = float(body.get("reduction_percent", 15.0))
        protected = body.get("protected_categories", ["Food & Catering", "Venue & Facilities"])
        result = planner_engine.reduce_budget_smartly(
            current_plan.get("budget_breakdown", {}),
            reduction_percent=reduction_pct,
            protected_category_names=protected
        )
        return json_response(result)

    if path == '/api/copilot' and method == 'POST':
        body = parse_body()
        current_plan = body.get("plan", {})
        message = body.get("message", "")
        result = gemini_client.ai_copilot_assistant(current_plan, message)
        return json_response(result)

    # If it is an unhandled /api route, return 404 JSON
    if path.startswith('/api/'):
        return json_response({"error": f"API route not found: {path}"}, 404)

    # === STATIC ASSET SERVING ===
    rel_path = path.lstrip('/')
    if not rel_path:
        rel_path = 'index.html'

    # Check public directory first, then frontend
    for base_dir in [PUBLIC_DIR, FRONTEND_DIR]:
        candidate = os.path.join(base_dir, rel_path)
        if os.path.isfile(candidate):
            mime_type, _ = mimetypes.guess_type(candidate)
            mime_type = mime_type or 'application/octet-stream'
            if candidate.endswith('.js'):
                mime_type = 'application/javascript; charset=utf-8'
            elif candidate.endswith('.css'):
                mime_type = 'text/css; charset=utf-8'
            elif candidate.endswith('.html'):
                mime_type = 'text/html; charset=utf-8'

            with open(candidate, 'rb') as f:
                content = f.read()

            headers = cors_headers + [
                ('Content-Type', mime_type),
                ('Content-Length', str(len(content)))
            ]
            start_response('200 OK', headers)
            return [content]

    # Fallback to index.html for Single Page App client-side routing
    index_candidate = os.path.join(PUBLIC_DIR, 'index.html')
    if not os.path.isfile(index_candidate):
        index_candidate = os.path.join(FRONTEND_DIR, 'index.html')

    if os.path.isfile(index_candidate):
        with open(index_candidate, 'rb') as f:
            content = f.read()
        headers = cors_headers + [
            ('Content-Type', 'text/html; charset=utf-8'),
            ('Content-Length', str(len(content)))
        ]
        start_response('200 OK', headers)
        return [content]

    start_response('404 Not Found', cors_headers + [('Content-Type', 'text/plain')])
    return [b'404 Not Found']


# Alias handler for Vercel
handler = app

def run_server(port: int = 8000):
    from wsgiref.simple_server import make_server
    database.init_db()
    if not database.get_event("demo_campus_carnival_2026"):
        database.save_event(CAMPUS_CARNIVAL_2026)

    print(f"==================================================")
    print(f"EventGenie AI Server running at http://127.0.0.1:{port}")
    print(f"AI Status: {'Live Gemini Configured' if gemini_client.is_ai_configured() else 'Smart Demo Mode (Deterministic Engine)'}")
    print(f"==================================================")

    server = make_server('0.0.0.0', port, app)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer shutting down gracefully...")
        server.server_close()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    run_server(port)
