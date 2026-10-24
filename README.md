# ✨ EventGenie AI — Your Celebration, Perfectly Planned

> **PromptWars Celebration & Event Planner Challenge Submission**  
> *An intelligent, personal AI event manager transforming celebration visions into actionable, mathematically balanced, and resilient execution plans.*

---

## 🌟 Executive Summary

Event planning is plagued by financial miscalculations, scattered spreadsheets, unexpected weather surprises, and vendor negotiation blind spots. 

**EventGenie AI** solves this with a high-end, responsive web application combining:
1. **100% Deterministic Financial Arithmetic:** Zero reliance on LLMs for math. Budget allocations mathematically balance down to the single rupee or dollar.
2. **Contextual AI Planning Copilot:** A proactive planning assistant that analyzes the current event and generates structured change proposals (e.g., smart 15% budget reductions, weather contingencies) with interactive **Accept / Dismiss** previews.
3. **Turnkey Live Demo:** Ready-to-explore **Campus Carnival 2026** loaded with a single click—no API key required to interact with costs, timelines, and checklists.
4. **Google Gemini GenAI Integration:** Native support for `gemini-2.5-flash` / `gemini-2.0-flash` with structured JSON schema enforcement and automated fallback to the deterministic smart engine.
5. **Full Persistence & Export Engine:** Local browser caching + server-side SQLite database, one-click PDF/print view, CSV budget export, and clipboard text summaries.
6. **Zero External Dependencies:** Built with pure Python 3 standard library backend and modular modern frontend components. Runs out-of-the-box on Windows, macOS, or Linux.

---

## 🚀 Quick Start (Under 10 Seconds)

### Option A: Windows 1-Click Launch
Double-click `start.bat` in the project root. It will detect Python, open your browser, and launch the server.

### Option B: Command Line (Any OS)
```bash
python run.py
```
*(Or specify Python path if not linked in PATH):*
```powershell
& "$env:LOCALAPPDATA\Programs\Python\Python311\python.exe" run.py
```

Open your browser to: **`http://127.0.0.1:8000`**

---

## ⚡ The Live Demo: Campus Carnival 2026

Evaluators can immediately experience all features without typing or providing credentials:
1. Click **"Explore Demo"** on the hero section or **"⚡ Campus Carnival 2026"** in the navigation bar.
2. The complete plan for a 250-guest college festival with ₹1,50,000 budget loads instantly.
3. **Interactive Features to Try:**
   - **Budget Planner:** Adjust any line item cost. Notice remaining funds update immediately without page refresh. Click **"Rebalance to 100%"** to auto-balance.
   - **Interactive Timeline:** Check off morning setup milestones, add a custom schedule item, or delete entries.
   - **Preparation Checklist:** Check off tasks to see the live readiness progress bar animate. Filter by "Pending", "Completed", or department categories.
   - **Vendor Guide:** Review sample interview questions, comparison matrices, and update vendor booking statuses.
   - **AI Planning Copilot:** Click the floating **"✨ AI Planning Copilot"** button, select the chip *"Reduce my budget by 15% without losing the main experience"*, and click **"Apply Changes to Plan"** to watch the plan recalculate!
   - **Export:** Click **Export -> Download Budget CSV** or **Print / PDF Export** to generate a clean, printer-friendly execution sheet.

---

## 🧠 Technical Architecture

```
Event Planner/
├── backend/
│   ├── server.py              # High-performance ThreadingHTTPServer & REST routing
│   ├── gemini_client.py       # Google Gemini REST API client & structured JSON engine
│   ├── planner_engine.py      # Deterministic budget balancing, reduction algorithms & timeline generator
│   ├── database.py            # SQLite database schema, CRUD, and plan persistence
│   ├── demo_data.py           # Campus Carnival 2026 dataset & preset templates
│   └── tests/
│       └── test_event_planner.py # 10 comprehensive automated unit tests
├── frontend/
│   ├── index.html             # Single-page application shell
│   ├── css/
│   │   └── styles.css         # Midnight Navy & Ivory design system, glassmorphism, print CSS
│   └── js/
│       ├── app.js             # Global state orchestrator & reactive event dispatcher
│       ├── api.js             # Client API wrapper with resilient error handling
│       ├── components/        # Modular UI components
│       │   ├── Navbar.js
│       │   ├── Hero.js
│       │   ├── SetupWizard.js
│       │   ├── Blueprint.js
│       │   ├── BudgetPlanner.js
│       │   ├── Timeline.js
│       │   ├── Checklist.js
│       │   ├── VendorGuide.js
│       │   ├── CreativeIdeas.js
│       │   ├── Contingency.js
│       │   ├── CopilotDrawer.js
│       │   ├── SavedPlansModal.js
│       │   └── SettingsModal.js
│       └── utils/
│           ├── calculations.js # Deterministic arithmetic & currency formatters
│           ├── storage.js      # LocalStorage & database sync
│           └── export.js       # CSV download, print formatter, share text
├── run.py                     # Root execution script
├── start.bat                  # Windows 1-click startup script
├── Dockerfile                 # Production container for Google Cloud Run
├── .env.example               # Template for configuration
└── README.md                  # Complete documentation
```

---

## 🤖 Google Gemini GenAI Configuration

EventGenie AI is designed with a **security-first GenAI architecture**:
- API keys are **never hardcoded** and **never sent to frontend clients**.
- Keys are read from `GEMINI_API_KEY` or `GOOGLE_API_KEY` on the server.

### Enabling Live Gemini AI:

**Method 1: Environment Variable**
```bash
# Windows PowerShell
$env:GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"
python run.py

# Linux / macOS
export GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"
python run.py
```

**Method 2: UI Settings Modal**
1. Click the **"Demo Mode"** or **"⚙ Settings"** pill in the top right navigation bar.
2. Paste your Google Gemini API Key into the modal.
3. Click **"Save & Activate Gemini"**. The status pill will turn **green ("Gemini AI Active")**.

*If no key is configured, the application runs seamlessly in Smart Demo Mode using the deterministic rule-based generator.*

---

## 🧪 Automated Unit Test Suite

EventGenie AI includes 10 automated unit tests verifying budget arithmetic, contingency formulas, reduction algorithms, chronology ordering, and SQLite operations.

### Run Tests:
```powershell
& "$env:LOCALAPPDATA\Programs\Python\Python311\python.exe" backend\tests\test_event_planner.py
```
*(or simply `python backend/tests/test_event_planner.py`)*

Output:
```
..........
----------------------------------------------------------------------
Ran 10 tests in 0.031s

OK
```

---

## ☁️ Deployment: Google Cloud Run

EventGenie AI is containerized and ready for 1-command deployment to Google Cloud Run:

```bash
# 1. Build and push container to Google Artifact Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/eventgenie-ai

# 2. Deploy to Cloud Run with Secret Manager integration
gcloud run deploy eventgenie-ai \
  --image gcr.io/YOUR_PROJECT_ID/eventgenie-ai \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_MODEL=gemini-2.5-flash \
  --set-secrets GEMINI_API_KEY=gemini-api-key:latest
```

---

## 🏆 Key Prompts & User Flow Highlights

| Challenge Requirement | Implementation in EventGenie AI |
| :--- | :--- |
| **Occasion Presets** | Wedding, Birthday, College Fest, Anniversary, Cultural Festival, Corporate, Community, Custom |
| **Budget Arithmetic** | Deterministic JS/Python formulas; category sums + contingency reserve strictly equal 100% |
| **Over-Budget Guardrail** | Dynamic warning banner with visual variance amount and one-click rebalancer |
| **Interactive Timeline** | 9-phase run of show with completion checks, custom item addition, and phase filtering |
| **Vendor Disclaimers** | Prominently labeled as algorithmic estimates; no false claims of third-party bookings |
| **AI Copilot** | Real-time chat with preview diff cards (Accept / Dismiss) before modifying the live plan |
| **Exporting** | Instant CSV budget download, styled browser printing/PDF, and markdown clipboard copy |

---

*EventGenie AI — Engineered for the Celebration & Event Planner PromptWars Challenge.*
