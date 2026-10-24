#!/usr/bin/env python3
"""
EventGenie AI - Root Server Entrypoint (Vercel & Local compatible)
"""

import sys
import os

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(PROJECT_ROOT, "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from server import EventGenieHandler, run_server

# Vercel serverless function entrypoints
handler = EventGenieHandler
app = EventGenieHandler

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    run_server(port)
