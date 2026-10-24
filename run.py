#!/usr/bin/env python3
"""
EventGenie AI - Application Launcher
Executes the backend server with automatic port detection and environment setup.
"""

import sys
import os

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(PROJECT_ROOT, "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

import server

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting EventGenie AI on http://127.0.0.1:{port} ...")
    server.run_server(port=port)
