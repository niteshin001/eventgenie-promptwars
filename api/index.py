import sys
import os

# Add project root and backend directory to sys.path
API_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(API_DIR)
BACKEND_DIR = os.path.join(PROJECT_ROOT, "backend")

for path in [PROJECT_ROOT, BACKEND_DIR]:
    if path not in sys.path:
        sys.path.insert(0, path)

from server import EventGenieHandler

# Vercel Serverless Function entrypoints
handler = EventGenieHandler
app = EventGenieHandler
