"""
EventGenie AI - Google Gemini API Client
Provides secure, server-side GenAI interactions with structured JSON output,
rigorous error handling, schema validation, and graceful demo mode fallbacks.
"""

import os
import json
import urllib.request
import urllib.error
from typing import Dict, Any, Optional
from planner_engine import calculate_budget, synthesize_complete_plan, reduce_budget_smartly

DEFAULT_MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")

# In-memory runtime API key store (set via environment or secure settings endpoint)
_runtime_api_key: Optional[str] = None

def get_api_key() -> Optional[str]:
    global _runtime_api_key
    if _runtime_api_key:
        return _runtime_api_key
    # Check common environment variable names
    return os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")

def set_runtime_api_key(key: str) -> None:
    global _runtime_api_key
    _runtime_api_key = key.strip() if key else None

def is_ai_configured() -> bool:
    key = get_api_key()
    return bool(key and len(key) > 5)

def call_gemini(prompt: str, system_instruction: Optional[str] = None, model: str = DEFAULT_MODEL) -> Dict[str, Any]:
    """
    Calls the Google Gemini REST API v1beta securely using urllib.
    Returns parsed JSON response or raises Exception.
    """
    api_key = get_api_key()
    if not api_key:
        raise ValueError("Google Gemini API key is not configured. Falling back to Smart Demo Engine.")
        
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}]
            }
        ],
        "generationConfig": {
            "temperature": 0.6,
            "responseMimeType": "application/json"
        }
    }
    
    if system_instruction:
        payload["systemInstruction"] = {
            "parts": [{"text": system_instruction}]
        }
        
    req_data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=req_data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            res_body = response.read().decode("utf-8")
            res_json = json.loads(res_body)
            
            # Extract content text
            candidates = res_json.get("candidates", [])
            if not candidates:
                raise ValueError("No candidates returned from Gemini API.")
                
            parts = candidates[0].get("content", {}).get("parts", [])
            if not parts:
                raise ValueError("Empty response parts from Gemini API.")
                
            raw_text = parts[0].get("text", "")
            return json.loads(raw_text)
            
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8")
        raise RuntimeError(f"Gemini API HTTP Error {e.code}: {err_msg}")
    except urllib.error.URLError as e:
        raise RuntimeError(f"Network error communicating with Gemini API: {e.reason}")
    except json.JSONDecodeError as e:
        raise RuntimeError(f"Failed to parse structured JSON from Gemini response: {e}")

def generate_ai_event_blueprint(setup_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generates a full event plan. Uses Gemini when available; falls back to deterministic smart engine.
    Arithmetic is ALWAYS validated and calculated programmatically!
    """
    total_budget = float(setup_data.get("budget", 150000.0))
    contingency_pct = float(setup_data.get("contingency_percent", 10.0))
    currency = setup_data.get("currency", "₹")
    occasion = setup_data.get("occasion", "Celebration")
    guests = int(setup_data.get("guests", 100))
    
    # 1. First build the mathematically sound deterministic base
    base_plan = synthesize_complete_plan(setup_data)
    
    # 2. If Gemini is available, enhance qualitative elements (concepts, themes, specific schedule flavor, ideas)
    if is_ai_configured():
        system_prompt = (
            "You are EventGenie AI, an elite event planner and celebration designer. "
            "Generate rich, hyper-personalized, creative event planning details in valid JSON. "
            "Do NOT calculate financial numbers; only recommend creative concepts, timeline details, and contingency tactics."
        )
        user_prompt = f"""
Plan a sensational {occasion} in {setup_data.get('city', 'Metropolitan City')} for {guests} guests with a budget of {currency}{total_budget:,.2f}.
Theme/Vibe Preference: {setup_data.get('theme', 'Festive')} / {setup_data.get('vibe', 'Joyful')}
Special Requests: {setup_data.get('special_requests', 'None')}
Dietary Requirements: {setup_data.get('dietary', 'Standard')}

Return a JSON object with this exact structure:
{{
    "theme_title": "Creative title for the theme",
    "concept_overview": "2-3 sentences capturing the soul and creative essence of the celebration",
    "atmosphere_tags": ["4 distinct vibe adjectives"],
    "color_palette": [
        {{"name": "Color Name", "hex": "#HEX_CODE"}}
    ],
    "creative_ideas": {{
        "theme_concepts": ["3 unique decor and styling concepts"],
        "activities": ["3 engaging interactive activities tailored for this guest group"],
        "food_concepts": ["3 themed menu items or drink ideas"],
        "photo_opportunities": ["3 Instagrammable backdrop / photo lounge ideas"]
    }},
    "contingency_tactics": [
        {{
            "title": "Specific Risk Name",
            "severity": "High or Medium",
            "trigger": "When this scenario happens",
            "action_plan": "Actionable 2-sentence mitigation protocol",
            "buffer_allocated": "Specific contingency allocation advice"
        }}
    ]
}}
"""
        try:
            ai_data = call_gemini(user_prompt, system_instruction=system_prompt)
            
            # Enrich base plan with AI generated creative nuances
            if "theme_title" in ai_data:
                base_plan["theme"] = ai_data["theme_title"]
            if "concept_overview" in ai_data:
                base_plan["overview"]["concept"] = ai_data["concept_overview"]
            if "atmosphere_tags" in ai_data:
                base_plan["overview"]["atmosphere"] = ai_data["atmosphere_tags"]
            if "color_palette" in ai_data and len(ai_data["color_palette"]) >= 3:
                base_plan["color_palette"] = ai_data["color_palette"]
            if "creative_ideas" in ai_data:
                base_plan["ideas"] = ai_data["creative_ideas"]
            if "contingency_tactics" in ai_data and len(ai_data["contingency_tactics"]) >= 3:
                base_plan["contingencies"] = ai_data["contingency_tactics"]
                
            base_plan["is_ai_generated"] = True
            base_plan["generator_mode"] = f"Google Gemini ({DEFAULT_MODEL})"
            base_plan["ai_status_message"] = "Plan crafted with live Gemini AI & verified by EventGenie Math Engine."
            return base_plan
            
        except Exception as e:
            # Transparent fallback to deterministic smart engine
            base_plan["is_ai_generated"] = False
            base_plan["generator_mode"] = "Smart Demo Engine (Offline Fallback)"
            base_plan["ai_status_message"] = f"Generated using deterministic engine (Gemini notice: {str(e)[:80]})."
            return base_plan
            
    else:
        # Transparent smart demo mode
        base_plan["is_ai_generated"] = False
        base_plan["generator_mode"] = "Smart Demo Engine (No API Key Required)"
        base_plan["ai_status_message"] = "Generated via intelligent deterministic planner. Configure GEMINI_API_KEY to activate live AI generation."
        return base_plan

def ai_copilot_assistant(plan_data: Dict[str, Any], user_message: str) -> Dict[str, Any]:
    """
    Contextual AI Copilot that interprets the current plan and user prompt.
    Returns an answer plus an optional structured change proposal that the user can preview and accept.
    """
    message_lower = user_message.lower()
    
    # Check for direct budget reduction request
    if "reduce" in message_lower and "budget" in message_lower:
        reduction_pct = 15.0
        if "10%" in message_lower or "10 percent" in message_lower:
            reduction_pct = 10.0
        elif "20%" in message_lower or "20 percent" in message_lower:
            reduction_pct = 20.0
        elif "25%" in message_lower or "25 percent" in message_lower:
            reduction_pct = 25.0
            
        result = reduce_budget_smartly(
            plan_data.get("budget_breakdown", {}),
            reduction_percent=reduction_pct,
            protected_category_names=["Food & Catering", "Venue & Facilities"]
        )
        
        return {
            "reply": (
                f"I have analyzed your event plan and prepared a strategic {reduction_pct}% budget reduction "
                f"(saving {plan_data.get('currency', '₹')}{result['savings_amount']:,.2f}). "
                f"Your core hospitality (Food & Catering and Venue) is protected, while discretionary decor and auxiliary AV allocations "
                f"have been trimmed. Review the proposed changes below and click 'Apply Changes' to update your live plan."
            ),
            "proposal": {
                "type": "budget_reduction",
                "summary": f"Reduce Total Budget by {reduction_pct}% to {plan_data.get('currency', '₹')}{result['reduced_total']:,.2f}",
                "data": result["revised_budget"]
            },
            "source": "EventGenie Budget Optimizer"
        }
        
    # Check for rainy day / bad weather contingency request
    if "rain" in message_lower or "weather" in message_lower:
        return {
            "reply": (
                "Here is an emergency weather resilience plan for your event:\n\n"
                "1. **Indoor Shift Protocol:** Secure immediate standby booking for a covered pavilion or adjacent indoor banquet hall.\n"
                "2. **Waterproofing AV:** Enforce clear waterproof rain-tarps over power distributors and line-array speakers.\n"
                "3. **Guest Hospitality:** Stage 50 branded golf umbrellas at valet drop-off and install heavy rubber cable ramps over walkways.\n\n"
                "Would you like me to inject this contingency protocol directly into your Contingency Planner?"
            ),
            "proposal": {
                "type": "add_contingency",
                "summary": "Add 'Heavy Rain & Outdoor Storm Resilience Protocol' to Contingency Plan",
                "data": {
                    "title": "Severe Rain & Storm Relocation Protocol",
                    "severity": "Critical",
                    "trigger": "Weather radar indicates rain cell within 15km or humidity > 85%",
                    "action_plan": "Execute 60-minute transition protocol to covered indoor hall. Shift stage sound rigs to secondary covered indoor platform.",
                    "buffer_allocated": "Covered hall hold fee pre-budgeted under Venue & Logistics."
                }
            },
            "source": "EventGenie Contingency Engine"
        }

    # If Gemini is configured, use live LLM for rich contextual planning
    if is_ai_configured():
        system_prompt = (
            "You are EventGenie AI Copilot, an elite event planning advisor. "
            "You are advising an event organizer on their active event plan. "
            "Be concise, actionable, enthusiastic, and provide specific practical suggestions."
        )
        plan_summary = {
            "title": plan_data.get("title"),
            "occasion": plan_data.get("occasion"),
            "city": plan_data.get("city"),
            "guests": plan_data.get("guests"),
            "budget": plan_data.get("budget"),
            "currency": plan_data.get("currency"),
            "theme": plan_data.get("theme")
        }
        prompt = f"""
Current Event Context: {json.dumps(plan_summary)}
User Question: {user_message}

Provide a helpful, structured response answering their question with 3-4 bullet points and actionable tips.
Format your answer in clear markdown.
Return a JSON object with:
{{
    "reply": "Your markdown-formatted advice and rationale",
    "suggested_followup": "A relevant follow-up prompt the user might ask next"
}}
"""
        try:
            ai_res = call_gemini(prompt, system_instruction=system_prompt)
            return {
                "reply": ai_res.get("reply", "Here are recommendations for your event plan."),
                "suggested_followup": ai_res.get("suggested_followup", "What should I complete this week?"),
                "source": f"Live Gemini ({DEFAULT_MODEL})"
            }
        except Exception:
            pass # fall through to rule response

    # Fallback contextual replies for standard queries
    if "elegant" in message_lower or "luxury" in message_lower:
        reply = (
            "To elevate the elegance of this celebration:\n\n"
            "• **Lighting Architecture:** Replace bright flat floods with warm amber pin-spotting (2700K) on guest tables and soft uplighting along perimeter arches.\n"
            "• **Curated Table-Scapes:** Upgrade standard polyester linens to textured ivory damask with gold-rimmed glassware and low floral compotes.\n"
            "• **Acoustic Ambiance:** Feature a live harpist or jazz cello duo during cocktail arrival rather than recorded digital playlists.\n"
            "• **Plated Hospitality:** Serve signature hors d'oeuvres on slate and marble passing trays with edible flower garnishes."
        )
    elif "student" in message_lower or "college" in message_lower or "young" in message_lower:
        reply = (
            "High-engagement ideas for a student-centric crowd:\n\n"
            "• **UV Glow Room & Neon Body Art:** Set up a rapid UV glow-paint tattoo station with 365nm blacklights.\n"
            "• **Silent Disco Battle:** Dual-channel headphone stage where two popular student DJs compete for dancefloor share.\n"
            "• **Crowd Interactive Trivia:** Kahoot or Mentimeter trivia on the main LED wall with campus inside jokes and sponsor vouchers.\n"
            "• **Late-Night Street Bites:** Midnight slider counter or waffle truck load-in right as the concert wraps up."
        )
    elif "week" in message_lower or "urgent" in message_lower or "now" in message_lower:
        reply = (
            "Here is your high-priority action checklist for this week:\n\n"
            "1. **Finalize Venue & Electrical Clearances:** Ensure generator permissions and noise curfew certificates are stamped.\n"
            "2. **Lock Caterer Headcount Guarantee:** Notify your catering lead of the locked guest count minus 5% safety margin.\n"
            "3. **Run Vendor Audio Check:** Confirm arrival time with sound technician (minimum 2 hours prior to guest arrival).\n"
            "4. **Brief Volunteer Leads:** Distribute run-of-show schedules and walkie-talkie channel allocations."
        )
    else:
        reply = (
            f"Regarding your question for **{plan_data.get('title', 'your celebration')}**:\n\n"
            f"• **Scale & Flow:** Designed for {plan_data.get('guests', 100)} guests in {plan_data.get('city', 'your city')}.\n"
            f"• **Budget Efficiency:** Currently optimized at {plan_data.get('currency', '₹')}{plan_data.get('budget', 0):,.2f}.\n"
            f"• **Pro Tip:** Keep 10% reserved in contingency for unexpected last-minute additions.\n\n"
            "You can ask me to reduce budget, add custom timeline items, adjust vendor allocations, or suggest theme concepts!"
        )
        
    return {
        "reply": reply,
        "source": "EventGenie Planning Copilot"
    }
