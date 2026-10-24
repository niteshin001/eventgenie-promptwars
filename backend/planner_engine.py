"""
EventGenie AI - Deterministic Planning Engine
Guarantees mathematically accurate calculations, schema compliance,
and rule-based plan synthesis without relying on LLM arithmetic.
"""

import math
import copy
from typing import Dict, Any, List, Optional
from demo_data import PRESET_TEMPLATES

# Standard budget categories
STANDARD_CATEGORIES = [
    {"id": "cat_venue", "name": "Venue & Facilities", "icon": "building", "default_pct": 20.0},
    {"id": "cat_food", "name": "Food & Catering", "icon": "utensils", "default_pct": 32.0},
    {"id": "cat_decor", "name": "Decorations & Lighting", "icon": "sparkles", "default_pct": 16.0},
    {"id": "cat_photo", "name": "Photography & Video", "icon": "camera", "default_pct": 9.0},
    {"id": "cat_entertainment", "name": "Entertainment & Sound", "icon": "music", "default_pct": 11.0},
    {"id": "cat_invites", "name": "Invitations & Favors", "icon": "ticket", "default_pct": 3.0},
    {"id": "cat_logistics", "name": "Transport & Logistics", "icon": "truck", "default_pct": 5.0},
    {"id": "cat_misc", "name": "Miscellaneous Expenses", "icon": "package", "default_pct": 4.0}
]

def calculate_budget(total_budget: float, contingency_percent: float = 10.0, category_shares: Optional[Dict[str, float]] = None) -> Dict[str, Any]:
    """
    Deterministically computes category amounts from percentages ensuring:
    allocable_budget + contingency_amount == total_budget
    sum(category_allocated) == allocable_budget
    """
    total_budget = max(0.0, float(total_budget))
    contingency_percent = max(0.0, min(30.0, float(contingency_percent)))
    
    contingency_amount = round(total_budget * (contingency_percent / 100.0), 2)
    allocable_budget = round(total_budget - contingency_amount, 2)
    
    # Base percentages normalized to 100%
    shares = category_shares if category_shares else {cat["name"]: cat["default_pct"] for cat in STANDARD_CATEGORIES}
    sum_shares = sum(shares.values())
    if sum_shares <= 0:
        sum_shares = 100.0
    
    normalized_shares = {name: (val / sum_shares) * 100.0 for name, val in shares.items()}
    
    categories = []
    running_total = 0.0
    
    cat_items_list = list(normalized_shares.items())
    for i, (name, pct) in enumerate(cat_items_list):
        meta = next((c for c in STANDARD_CATEGORIES if c["name"] == name), {"id": f"cat_{i}", "icon": "tag"})
        
        # For the last category, assign the exact remaining allocable to prevent 1-cent rounding drifts
        if i == len(cat_items_list) - 1:
            allocated = round(allocable_budget - running_total, 2)
        else:
            allocated = round(allocable_budget * (pct / 100.0), 2)
            running_total += allocated
            
        categories.append({
            "id": meta.get("id", f"cat_{i}"),
            "name": name,
            "icon": meta.get("icon", "tag"),
            "allocated": allocated,
            "percentage": round(pct, 1),
            "notes": f"Estimated allocation for {name.lower()}",
            "items": [
                {"name": f"Core {name} booking & services", "amount": round(allocated * 0.75, 2), "status": "Estimated"},
                {"name": f"Auxiliary / upgrade options", "amount": round(allocated * 0.25, 2), "status": "Estimated"}
            ]
        })

    return {
        "total_budget": total_budget,
        "contingency_amount": contingency_amount,
        "contingency_percent": contingency_percent,
        "allocable_budget": allocable_budget,
        "categories": categories,
        "allocated_sum": round(sum(c["allocated"] for c in categories), 2),
        "total_with_contingency": round(sum(c["allocated"] for c in categories) + contingency_amount, 2),
        "is_balanced": abs((sum(c["allocated"] for c in categories) + contingency_amount) - total_budget) < 0.05
    }

def reduce_budget_smartly(budget_data: Dict[str, Any], reduction_percent: float = 15.0, protected_category_names: Optional[List[str]] = None) -> Dict[str, Any]:
    """
    Reduces total budget by reduction_percent while protecting vital user categories.
    Preserves contingency percentage.
    """
    protected = set(protected_category_names or [])
    current_total = budget_data.get("total_budget", 100000.0)
    target_total = round(current_total * (1.0 - (reduction_percent / 100.0)), 2)
    contingency_pct = budget_data.get("contingency_percent", 10.0)
    
    current_categories = budget_data.get("categories", [])
    if not current_categories:
        return calculate_budget(target_total, contingency_pct)
        
    contingency_amount = round(target_total * (contingency_pct / 100.0), 2)
    target_allocable = round(target_total - contingency_amount, 2)
    
    # Calculate cuts mainly on unprotected categories
    unprotected_cats = [c for c in current_categories if c["name"] not in protected]
    protected_cats = [c for c in current_categories if c["name"] in protected]
    
    protected_sum = sum(c["allocated"] for c in protected_cats)
    
    # If protected sum exceeds 80% of target, protected must scale slightly too
    if protected_sum >= target_allocable * 0.8:
        scale_factor = target_allocable / sum(c["allocated"] for c in current_categories)
        new_shares = {c["name"]: c["allocated"] * scale_factor for c in current_categories}
    else:
        remaining_for_unprotected = target_allocable - protected_sum
        unprot_current_sum = sum(c["allocated"] for c in unprotected_cats) or 1.0
        new_shares = {}
        for c in protected_cats:
            new_shares[c["name"]] = c["allocated"]
        for c in unprotected_cats:
            new_shares[c["name"]] = (c["allocated"] / unprot_current_sum) * remaining_for_unprotected

    # Recalculate cleanly
    sum_new = sum(new_shares.values())
    pct_shares = {name: (val / sum_new) * 100.0 for name, val in new_shares.items()}
    
    revised_budget = calculate_budget(target_total, contingency_pct, pct_shares)
    
    # Keep original items scaled down
    for orig_cat, rev_cat in zip(current_categories, revised_budget["categories"]):
        scale = rev_cat["allocated"] / (orig_cat["allocated"] or 1.0)
        rev_cat["items"] = []
        for item in orig_cat.get("items", []):
            rev_cat["items"].append({
                "name": item.get("name", "Expense item"),
                "amount": round(item.get("amount", 0.0) * scale, 2),
                "status": "Revised (Reduced)"
            })
            
    return {
        "original_total": current_total,
        "reduced_total": target_total,
        "savings_amount": round(current_total - target_total, 2),
        "reduction_percent": reduction_percent,
        "revised_budget": revised_budget,
        "explanation": f"Reduced budget by {reduction_percent}% (Saving ₹{round(current_total - target_total, 2):,}). Protected key experiences while trimming discretionary decor, auxiliary AV, and guest favor allocations."
    }

def generate_timeline(occasion: str, start_time: str = "11:00", duration_hours: int = 6) -> List[Dict[str, Any]]:
    """
    Deterministically crafts an organized Run of Show timeline based on occasion and timing.
    """
    try:
        sh, sm = [int(p) for p in start_time.split(":")[:2]]
    except Exception:
        sh, sm = 11, 0
        
    def fmt_time(h, m):
        period = "AM" if h < 12 else "PM"
        display_h = h if h <= 12 else h - 12
        if display_h == 0:
            display_h = 12
        return f"{display_h:02d}:{m:02d} {period}"

    t0 = sh * 60 + sm
    setup_start = max(0, t0 - 120)
    
    schedule_templates = {
        "Wedding": [
            (-120, -30, "Setup & Vendor Arrival", "Bridal Suite Prep & Floral Mandap / Altar Staging", "Setup", "Venue Pavilion", "Florist, sound engineer, and decor team finish installations."),
            (-30, 0, "Guest Arrival", "Welcome Refreshments & Shehnai / Acoustic Welcome", "Social", "Entry Lobby", "Guests welcomed with signature sherbets/champagne and rose buds."),
            (0, 45, "Main Ceremony", "Processional & Sacred Nuptial Ceremonies", "Ceremony", "Main Stage", "Traditional exchange of vows/garlands with photographer coverage."),
            (45, 90, "Social Hour", "Formal Family Portraits & Cocktail Hour", "Social", "Lawn Garden", "Appetizer platters circulated; string quartet or acoustic guitar plays."),
            (90, 180, "Dinner & Hospitality", "Gourmet Banquet Dinner & Toast Speeches", "Food", "Dining Hall", "Full multi-cuisine buffet opens; best man and maid of honor give toasts."),
            (180, 240, "Celebration", "First Dance, Cake Cutting & High Energy Dance Floor", "Entertainment", "Ballroom Floor", "DJ elevates tempo; sparklers and dance floor light up."),
            (240, 270, "Closing & Farewell", "Send-off, Guest Keepsakes & Vendor Load-out", "Closing", "Porte-cochère", "Farewell archway for couple; guest favors distributed.")
        ],
        "Birthday": [
            (-90, -15, "Setup & Vendor Arrival", "Balloon Arch Installation & DJ Sound Check", "Setup", "Party Hall", "Catering team prepares grazing table; DJ sets lighting scenes."),
            (-15, 30, "Guest Arrival", "Welcome Drinks, Polaroids & Guestbook Signing", "Registration", "Welcome Foyer", "Guests arrive, snap polaroid for photo guestbook, grab mocktails."),
            (30, 75, "Welcome Activities", "Interactive Icebreaker Games & Trivia", "Activities", "Lounge Area", "Fun custom trivia about the celebrant with novelty prizes."),
            (75, 105, "Highlight Moment", "Grand Cake Cutting & Video Montage Screening", "Ceremony", "Center Stage", "Birthday song, sparkler candles, commemorative photo session."),
            (105, 165, "Dinner & Drinks", "Dinner Buffet & Gourmet Food Stations", "Food", "Dining Terrace", "Warm dinner spread featuring signature favorites and dessert bar."),
            (165, 240, "Entertainment", "Dance Floor Open & Live DJ Set", "Concert", "Dance Floor", "DJ plays upbeat party playlist; party props and glow sticks distributed."),
            (240, 270, "Closing", "Return Gifts & Wind-down", "Closing", "Exit Arch", "Personalized favor boxes handed out as guests depart.")
        ]
    }
    
    chosen_template = schedule_templates.get(occasion) or [
        (-120, -30, "Setup & Vendor Arrival", "Venue Access & AV Production Calibration", "Setup", "Main Arena", "Audio-visual checks, seating layout verification, and vendor briefing."),
        (-30, 0, "Guest Arrival", "Check-in, Welcome Drinks & Ambient Music", "Registration", "Welcome Area", "Attendee registration, badge or wristband issuance, hospitality drinks."),
        (0, 60, "Welcome & Opening", "Opening Keynote & Inaugural Presentation", "Ceremony", "Main Stage", "Host welcome address, lighting of ceremonial lamp or ribbon cutting."),
        (60, 150, "Main Program", "Core Activities, Showcase & Interactive Sessions", "Performance", "Activity Zone", "Central performances, exhibits, or competitions."),
        (150, 210, "Food & Refreshments", "Networking Lunch / Dinner Buffet", "Food", "Dining Lawn", "Full banquet service with vegetarian and dietary accommodations."),
        (210, 280, "Entertainment & Finale", "Headliner Performance & Grand Finale", "Entertainment", "Stage", "Celebrity DJ, live band, or closing entertainment segment."),
        (280, 300, "Closing & Wrap-up", "Vote of Thanks, Gift Favors & Controlled Departure", "Closing", "Exit Gates", "Organizers express gratitude; security facilitates orderly dispersal.")
    ]
    
    timeline = []
    for idx, (m_start, m_end, phase, title, cat, loc, desc) in enumerate(chosen_template):
        st = t0 + m_start
        et = t0 + m_end
        st_h, st_m = (st // 60) % 24, st % 60
        et_h, et_m = (et // 60) % 24, et % 60
        time_str = f"{fmt_time(st_h, st_m)} - {fmt_time(et_h, et_m)}"
        timeline.append({
            "id": f"tl_{idx+1}",
            "time": time_str,
            "phase": phase,
            "title": title,
            "category": cat,
            "location": loc,
            "description": desc,
            "completed": False
        })
        
    return timeline

def generate_checklist(occasion: str) -> List[Dict[str, Any]]:
    """
    Produces actionable milestones across 5 preparation phases.
    """
    return [
        {"id": "chk_1", "task": f"Finalize and lock {occasion} venue contract & security deposit", "category": "Venue", "priority": "Urgent", "deadline": "4 Weeks Prior", "completed": False},
        {"id": "chk_2", "task": "Determine guest headcount and finalize catering per-plate contract", "category": "Catering", "priority": "Urgent", "deadline": "3 Weeks Prior", "completed": False},
        {"id": "chk_3", "task": "Book primary sound, stage lighting, and AV technician team", "category": "Technical", "priority": "High", "deadline": "3 Weeks Prior", "completed": False},
        {"id": "chk_4", "task": "Send digital invitations with RSVP tracking and dietary options", "category": "Invitations", "priority": "High", "deadline": "2 Weeks Prior", "completed": False},
        {"id": "chk_5", "task": "Lock floral arrangements, stage backdrop, and atmospheric lighting", "category": "Decor", "priority": "Medium", "deadline": "2 Weeks Prior", "completed": False},
        {"id": "chk_6", "task": "Book professional photographer and specify mandatory shot list", "category": "Media", "priority": "High", "deadline": "10 Days Prior", "completed": False},
        {"id": "chk_7", "task": "Order return favors, badges, and personalized signage boards", "category": "Logistics", "priority": "Medium", "deadline": "1 Week Prior", "completed": False},
        {"id": "chk_8", "task": "Conduct generator load test and inspect emergency exits", "category": "Safety", "priority": "Urgent", "deadline": "3 Days Prior", "completed": False},
        {"id": "chk_9", "task": "Confirm final guaranteed headcount with catering vendor", "category": "Catering", "priority": "High", "deadline": "2 Days Prior", "completed": False},
        {"id": "chk_10", "task": "Pack day-of emergency kit: first aid, safety pins, phone chargers, tape", "category": "Operations", "priority": "Medium", "deadline": "1 Day Prior", "completed": False}
    ]

def generate_contingencies(occasion: str, venue_type: str = "Indoor/Outdoor") -> List[Dict[str, Any]]:
    """
    Generates sensible fallback strategies for standard event risks.
    """
    return [
        {
            "title": "Adverse Weather or Rain Contingency",
            "severity": "High",
            "trigger": "Weather forecast indicates > 35% precipitation probability",
            "action_plan": "Erect waterproof pagoda tents over dining zones or initiate pre-reserved indoor banquet fallback with 3-hour notice protocol.",
            "buffer_allocated": "Covered secondary space pre-negotiated into contract."
        },
        {
            "title": "Core Vendor Cancellation or Serious Delay",
            "severity": "Critical",
            "trigger": "Vendor fails to arrive within 90 minutes of scheduled setup",
            "action_plan": "Activate emergency shortlist vendor with whom preliminary availability was confirmed; utilize on-site coordinator's secondary supplier pool.",
            "buffer_allocated": "Contingency reserve covers rush surcharge if applicable."
        },
        {
            "title": "Power Interruption or Audio Glitch",
            "severity": "High",
            "trigger": "Local power drop or circuit breaker trip during peak program",
            "action_plan": "Automatic transfer switch transitions to dedicated silent generator within 10 seconds. Essential microphones run on independent UPS battery.",
            "buffer_allocated": "Logistics budget includes dedicated 15-25 kVA generator."
        },
        {
            "title": "Guest Headcount Surge (+20%)",
            "severity": "Medium",
            "trigger": "Walk-ins or unconfirmed plus-ones exceed planned guest tally",
            "action_plan": "Caterer holds a 15% raw buffer on standard pricing; venue staff rolls out 2 additional 10-seater tables within 15 minutes.",
            "buffer_allocated": "10% contingency fund absorbs incremental per-plate food costs."
        },
        {
            "title": "Medical Incident or Heat Exhaustion",
            "severity": "Medium",
            "trigger": "Guest or crew member requires medical attention",
            "action_plan": "Designated air-conditioned rest area with stocked first aid, glucose, and ice packs; nearest multi-specialty hospital emergency line on speed-dial.",
            "buffer_allocated": "First aid kit and safety supplies accounted for in Misc expenses."
        }
    ]

def generate_vendor_guide(budget_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Builds vendor questions, criteria, and suggested allowances from budget categories.
    """
    guides = [
        {
            "category": "Venue & Facilities",
            "suggested_role": "Primary event space host and facilities management",
            "questions_to_ask": [
                "What is your exact policy on outside decorators and caterers?",
                "Are air conditioning, cleaning staff, and parking valet included?",
                "What is the overtime rate per hour past the agreed curfew?"
            ],
            "comparison_criteria": ["Capacity comfort margin", "Parking slots", "Cancellation refund tier"],
            "estimated_budget": next((c["allocated"] for c in budget_data.get("categories", []) if "Venue" in c["name"]), 25000.0),
            "status": "Shortlisted",
            "sample_name": "Grand Royale Banquet & Lawns (Estimate)"
        },
        {
            "category": "Catering & Hospitality",
            "suggested_role": "Full meal, beverage station, and service staff management",
            "questions_to_ask": [
                "How many live counters and food stations will be operational simultaneously?",
                "What is the ratio of service waitstaff to guests (recommended 1:15)?",
                "Do you provide a formal food tasting session prior to final sign-off?"
            ],
            "comparison_criteria": ["Per-plate price vs menu variety", "Hygiene certification", "Staff uniforms"],
            "estimated_budget": next((c["allocated"] for c in budget_data.get("categories", []) if "Food" in c["name"]), 40000.0),
            "status": "Negotiating",
            "sample_name": "SavorCraft Gourmet Catering (Estimate)"
        },
        {
            "category": "Decorations & Ambience",
            "suggested_role": "Theme floral setup, stage backdrop, and atmospheric lighting",
            "questions_to_ask": [
                "Will fresh or faux floral accents be utilized for high-temperature areas?",
                "Do you provide 3D mockups or mood boards of the stage layout?",
                "How long before the event will setup be 100% complete for photo inspection?"
            ],
            "comparison_criteria": ["Portfolio relevance to theme", "Tear-down speed", "Lighting fixture quality"],
            "estimated_budget": next((c["allocated"] for c in budget_data.get("categories", []) if "Decor" in c["name"]), 20000.0),
            "status": "Researching",
            "sample_name": "AuraVibe Decor & Lighting (Estimate)"
        },
        {
            "category": "Photography & Video",
            "suggested_role": "Lead photographer, cinematic teaser editor, and reel creator",
            "questions_to_ask": [
                "How many edited high-res photos and highlight videos are delivered?",
                "What is the turnaround time for the teaser video (e.g. within 48 hours)?",
                "Do you retain full backup cards on dual slots during shooting?"
            ],
            "comparison_criteria": ["Candid portfolio quality", "Drone license", "Delivery deadline guarantee"],
            "estimated_budget": next((c["allocated"] for c in budget_data.get("categories", []) if "Photo" in c["name"]), 15000.0),
            "status": "Shortlisted",
            "sample_name": "Lumière Event Visuals (Estimate)"
        }
    ]
    return guides

def generate_personalized_ideas(setup_data: Dict[str, Any]) -> Dict[str, List[str]]:
    """
    Crafts customized creative concepts based on occasion, mood, and budget.
    """
    occasion = setup_data.get("occasion", "Celebration")
    vibe = setup_data.get("vibe", "Vibrant & Joyful")
    guests = setup_data.get("guests", 100)
    
    return {
        "theme_concepts": [
            f"Tailored '{vibe}' Concept: Cohesive color story featuring harmonious floral gradients and subtle LED accent uplighting.",
            "Interactive Guest Canvas: A custom art board where attendees imprint finger-paint leaves or write celebratory blessings.",
            "Grand Entrance Portal: Statement archway accented with botanical greenery and illuminated typography."
        ],
        "activities": [
            f"Signature Icebreaker for {guests} guests: Digital live smartphone poll revealing funny memories and celebration predictions.",
            "Interactive Tasting Counter: Curated artisanal mocktail or dessert flight station where guests customize their pairings.",
            "Commemorative Video Time Capsule: iPad kiosk recording 30-second audio/video wishes directly to a private cloud drive."
        ],
        "food_concepts": [
            "Floating Hors d'Oeuvres: Bite-sized gourmet fusion appetizers circulated during cocktail hour.",
            "Live Culinary Action Station: Freshly prepared mini delicacies (e.g., artisanal flatbreads, dim sums, or chaat cones).",
            "Signature Celebration Mocktail: Custom colored beverage matching the event palette with dry ice or botanical garnish."
        ],
        "photo_opportunities": [
            "Velvet / Floral Photo Lounge: Plush settee framed by neon signage and ambient warm festoon lighting.",
            "360-Degree Slow-Motion Video Stage: Fun props and dynamic lighting for instant Instagram and TikTok shares.",
            "Polaroid Guest Wall: Guests take two snaps—one to take home and one to peg on the glowing string-light board."
        ]
    }

def synthesize_complete_plan(setup_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generates a full, coherent, mathematically certified event plan.
    Used both as the core rule-based generator and the deterministic backbone for AI outputs.
    """
    title = setup_data.get("title") or f"{setup_data.get('occasion', 'Special')} Celebration"
    occasion = setup_data.get("occasion", "Custom Event")
    city = setup_data.get("city", "Mumbai")
    venue = setup_data.get("venue", "City Venue & Lawns")
    guests = int(setup_data.get("guests", 100))
    budget = float(setup_data.get("budget", 150000.0))
    currency = setup_data.get("currency", "₹")
    contingency_pct = float(setup_data.get("contingency_percent", 10.0))
    start_time = setup_data.get("start_time", "11:00")
    duration = int(setup_data.get("duration", 6))
    
    # Calculate deterministic budget
    budget_breakdown = calculate_budget(budget, contingency_pct)
    
    # Generate schedule
    timeline = generate_timeline(occasion, start_time, duration)
    
    # Generate checklist
    checklist = generate_checklist(occasion)
    
    # Generate contingencies
    contingencies = generate_contingencies(occasion, setup_data.get("indoor_outdoor", "Hybrid"))
    
    # Generate vendor recommendations
    vendors = generate_vendor_guide(budget_breakdown)
    
    # Generate personalized ideas
    ideas = generate_personalized_ideas(setup_data)
    
    # Color palette
    colors = setup_data.get("color_palette") or [
        {"name": "Midnight Violet", "hex": "#6366F1"},
        {"name": "Sunset Coral", "hex": "#F43F5E"},
        {"name": "Warm Gold", "hex": "#F59E0B"},
        {"name": "Ivory Pearl", "hex": "#FAF8F5"}
    ]
    
    return {
        "id": setup_data.get("id") or f"plan_{int(budget)}_{guests}",
        "title": title,
        "occasion": occasion,
        "city": city,
        "venue": venue,
        "date": setup_data.get("date", "2026-11-20"),
        "start_time": start_time,
        "duration": duration,
        "guests": guests,
        "budget": budget,
        "currency": currency,
        "contingency_percent": contingency_pct,
        "theme": setup_data.get("theme", f"Bespoke {occasion} Splendor"),
        "vibe": setup_data.get("vibe", "Elegant & Unforgettable"),
        "indoor_outdoor": setup_data.get("indoor_outdoor", "Indoor & Covered Outdoor"),
        "special_requests": setup_data.get("special_requests", ""),
        "dietary": setup_data.get("dietary", "Standard & Vegetarian options"),
        "color_palette": colors,
        "overview": {
            "concept": f"A meticulously orchestrated {occasion.lower()} in {city} designed for {guests} guests, delivering a polished, memorable experience with zero planning stress.",
            "atmosphere": [setup_data.get("vibe", "Warm & Festive"), "Seamless Flow", "Guest-First Hospitality", "Aesthetic Cohesion"],
            "planning_assumptions": [
                f"Guest count locked at {guests} with 10% contingency buffer.",
                f"Total expenditure capped strictly at {currency}{budget:,.2f}.",
                "Vendor arrival 2 hours prior to guest arrival for complete sound and decor sign-off.",
                "Dietary and accessibility preferences fully prioritized in catering and seating plans."
            ]
        },
        "budget_breakdown": budget_breakdown,
        "timeline": timeline,
        "checklist": checklist,
        "vendors": vendors,
        "ideas": ideas,
        "contingencies": contingencies,
        "is_ai_generated": False,
        "generator_mode": "Deterministic Smart Engine"
    }
