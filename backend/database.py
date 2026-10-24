import sqlite3
import json
import os
import datetime
from typing import List, Dict, Any, Optional

# Check if running in Vercel or cloud serverless environment (where root filesystem is read-only)
if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
    DB_FILE = os.path.join("/tmp", "eventgenie.db")
else:
    DB_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "eventgenie.db")

def get_connection():
    try:
        os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)
    except Exception:
        pass
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    try:
        conn = get_connection()
        with conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS events (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    occasion TEXT NOT NULL,
                    city TEXT,
                    event_date TEXT,
                    guests INTEGER,
                    budget REAL,
                    currency TEXT,
                    data_json TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
            """)
        conn.close()
    except Exception as e:
        print(f"Warning: init_db fallback: {e}")

def save_event(event_data: Dict[str, Any]) -> str:
    event_id = event_data.get("id") or f"evt_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
    event_data["id"] = event_id
    now = datetime.datetime.now().isoformat()
    
    title = event_data.get("title", "Untitled Celebration")
    occasion = event_data.get("occasion", "Custom Event")
    city = event_data.get("city", "")
    event_date = event_data.get("date", "")
    guests = int(event_data.get("guests", 100))
    budget = float(event_data.get("budget", 0))
    currency = event_data.get("currency", "₹")
    data_json = json.dumps(event_data, ensure_ascii=False)

    try:
        conn = get_connection()
        with conn:
            conn.execute("""
                INSERT INTO events (id, title, occasion, city, event_date, guests, budget, currency, data_json, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    title = excluded.title,
                    occasion = excluded.occasion,
                    city = excluded.city,
                    event_date = excluded.event_date,
                    guests = excluded.guests,
                    budget = excluded.budget,
                    currency = excluded.currency,
                    data_json = excluded.data_json,
                    updated_at = excluded.updated_at
            """, (event_id, title, occasion, city, event_date, guests, budget, currency, data_json, now, now))
        conn.close()
    except Exception as e:
        print(f"Warning: save_event fallback: {e}")
    return event_id

def get_event(event_id: str) -> Optional[Dict[str, Any]]:
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT data_json FROM events WHERE id = ?", (event_id,))
        row = cursor.fetchone()
        conn.close()
        if row:
            return json.loads(row["data_json"])
    except Exception as e:
        print(f"Warning: get_event fallback: {e}")
    return None

def list_events() -> List[Dict[str, Any]]:
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, title, occasion, city, event_date, guests, budget, currency, updated_at FROM events ORDER BY updated_at DESC")
        rows = cursor.fetchall()
        conn.close()
        return [dict(row) for row in rows]
    except Exception as e:
        print(f"Warning: list_events fallback: {e}")
        return []

def delete_event(event_id: str) -> bool:
    try:
        conn = get_connection()
        with conn:
            cursor = conn.execute("DELETE FROM events WHERE id = ?", (event_id,))
            deleted = cursor.rowcount > 0
        conn.close()
        return deleted
    except Exception as e:
        print(f"Warning: delete_event fallback: {e}")
        return False

# Initialize database on module import
init_db()
