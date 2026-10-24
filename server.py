#!/usr/bin/env python3
"""
EventGenie AI - Server Entrypoint
"""
from main import app, handler, run_server

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8000))
    run_server(port)
