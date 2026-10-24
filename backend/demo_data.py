"""
EventGenie AI - Demo Data & Event Presets
Pre-configured realistic demo event: Campus Carnival 2026
"""

CAMPUS_CARNIVAL_2026 = {
    "id": "demo_campus_carnival_2026",
    "title": "Campus Carnival 2026: Neon Nights",
    "occasion": "College fest",
    "city": "Bengaluru",
    "venue": "Campus Amphitheatre & Central Lawns",
    "venue_type": "Outdoor Campus Quad",
    "date": "2026-11-14",
    "start_time": "10:00",
    "duration": 12, # hours
    "guests": 250,
    "budget": 150000.0,
    "currency": "₹",
    "contingency_percent": 10.0,
    "theme": "Neon Nights: Retro-Futuristic Glow",
    "vibe": "Energetic, Youthful & Immersive",
    "indoor_outdoor": "Outdoor with covered pavilions",
    "color_palette": [
        {"name": "Electric Violet", "hex": "#8B5CF6"},
        {"name": "Neon Cyan", "hex": "#06B6D4"},
        {"name": "Hot Coral", "hex": "#F43F5E"},
        {"name": "Cyber Yellow", "hex": "#FACC15"},
        {"name": "Midnight Void", "hex": "#0F172A"}
    ],
    "overview": {
        "concept": "An all-day youth celebration fusing retro-wave synth aesthetics with high-energy university festivities. Features interactive glow pavilions, acoustic sunset sessions, collegiate street-food carnival stalls, and a headliner Battle of the Bands finale.",
        "atmosphere": ["Lively & Electric", "UV Glow Accents", "Casual & Collaborative", "Student-Centric Vibe"],
        "planning_assumptions": [
            "Auditorium available as inclement weather backup at zero incremental fee.",
            "Campus security and facilities staff handle perimeter and electrical supply.",
            "Sound permits valid until 10:00 PM per city college regulations.",
            "Student council volunteer corps (30 members) assists with registration and crowd flow."
        ]
    },
    "budget_breakdown": {
        "total_budget": 150000.0,
        "contingency_amount": 15000.0,
        "contingency_percent": 10.0,
        "allocable_budget": 135000.0,
        "categories": [
            {
                "id": "cat_venue",
                "name": "Venue & Facilities",
                "icon": "building",
                "allocated": 12000.0,
                "percentage": 8.0,
                "notes": "Campus facilities sanitation fee, temporary stage platform, extra trash dumpsters",
                "items": [
                    {"name": "Campus Facilities & Cleaning Fee", "amount": 5000.0, "status": "Fixed"},
                    {"name": "Riser Stage Platform & Guardrails", "amount": 7000.0, "status": "Estimated"}
                ]
            },
            {
                "id": "cat_food",
                "name": "Food & Catering",
                "icon": "utensils",
                "allocated": 48000.0,
                "percentage": 32.0,
                "notes": "Food truck vouchers, hydration bars, evening snacks, volunteer meals",
                "items": [
                    {"name": "Street Food Carnival Vouchers (250 x ₹140)", "amount": 35000.0, "status": "Estimated"},
                    {"name": "Mocktail & Glow-drink Pop-up Bar", "amount": 8000.0, "status": "Estimated"},
                    {"name": "Hydration Station & Packaged Mineral Water", "amount": 5000.0, "status": "Estimated"}
                ]
            },
            {
                "id": "cat_decor",
                "name": "Decorations & Lighting",
                "icon": "sparkles",
                "allocated": 24000.0,
                "percentage": 16.0,
                "notes": "UV blacklights, neon yarn art, LED arches, fairy lights on trees",
                "items": [
                    {"name": "UV Blacklight Cannons & Fairy String Grids", "amount": 11000.0, "status": "Estimated"},
                    {"name": "Neon Canopy Tunnels & Photo Archway", "amount": 8500.0, "status": "Estimated"},
                    {"name": "Glow Paint, Neon Signages & Wristbands", "amount": 4500.0, "status": "Estimated"}
                ]
            },
            {
                "id": "cat_entertainment",
                "name": "Entertainment & Sound",
                "icon": "music",
                "allocated": 22500.0,
                "percentage": 15.0,
                "notes": "PA system, dual subwoofer rental, DJ mixer, student band honorariums",
                "items": [
                    {"name": "Pro Audio Line-Array Rental & Sound Engineer", "amount": 14000.0, "status": "Estimated"},
                    {"name": "DJ Rig & Wireless Microphones", "amount": 5500.0, "status": "Estimated"},
                    {"name": "Trophy Prizes for Battle of the Bands", "amount": 3000.0, "status": "Estimated"}
                ]
            },
            {
                "id": "cat_photo",
                "name": "Photography & Video",
                "icon": "camera",
                "allocated": 10500.0,
                "percentage": 7.0,
                "notes": "Student media club team stipend, reel creation, 360 photo booth backdrop",
                "items": [
                    {"name": "Campus Media Guild Stipends (2 Photographers)", "amount": 6500.0, "status": "Estimated"},
                    {"name": "360 Spin-Cam Rig Rental for 4 Hours", "amount": 4000.0, "status": "Estimated"}
                ]
            },
            {
                "id": "cat_invites",
                "name": "Invitations & Badges",
                "icon": "ticket",
                "allocated": 4500.0,
                "percentage": 3.0,
                "notes": "Digital passes with QR codes, NFC wristbands, event posters",
                "items": [
                    {"name": "Custom Glow Wristbands with Barcodes", "amount": 3000.0, "status": "Estimated"},
                    {"name": "Laminated VIP & Volunteer Lanyards", "amount": 1500.0, "status": "Estimated"}
                ]
            },
            {
                "id": "cat_logistics",
                "name": "Transport & Logistics",
                "icon": "truck",
                "allocated": 7500.0,
                "percentage": 5.0,
                "notes": "Equipment transport van, power cables, heavy-duty extension strips",
                "items": [
                    {"name": "Equipment Logistics Van (Rental)", "amount": 4500.0, "status": "Estimated"},
                    {"name": "Heavy-duty Industrial Power Extension Cables", "amount": 3000.0, "status": "Estimated"}
                ]
            },
            {
                "id": "cat_misc",
                "name": "Miscellaneous Expenses",
                "icon": "package",
                "allocated": 6000.0,
                "percentage": 4.0,
                "notes": "First aid tent supplies, volunteer badges, walkie-talkie batteries",
                "items": [
                    {"name": "First Aid Tent & Safety Supplies", "amount": 2500.0, "status": "Estimated"},
                    {"name": "Volunteer Hydration & Walkie Batteries", "amount": 3500.0, "status": "Estimated"}
                ]
            }
        ]
    },
    "timeline": [
        {
            "id": "tl_1",
            "time": "08:00 AM - 09:30 AM",
            "phase": "Setup & Vendor Arrival",
            "title": "Sound Check, Stage Setup & UV Installation",
            "category": "Setup",
            "location": "Central Lawn Amphitheatre",
            "description": "Sound technicians calibrate line arrays; decor team erects neon tunnel and UV cannons.",
            "completed": True
        },
        {
            "id": "tl_2",
            "time": "09:30 AM - 10:00 AM",
            "phase": "Vendor Arrival",
            "title": "Food Truck Load-in & Hydration Prep",
            "category": "Catering",
            "location": "West Pavilion Food Court",
            "description": "Catering vendors set up stalls, stock beverage refrigerators, and receive safety briefing.",
            "completed": True
        },
        {
            "id": "tl_3",
            "time": "10:00 AM - 11:00 AM",
            "phase": "Guest Arrival",
            "title": "Gates Open, Glow Wristband Check-in & DJ Warmup",
            "category": "Registration",
            "location": "Main Campus Archway",
            "description": "Student council scans QR tickets, distributes glow wristbands; ambient lo-fi synth playlist begins.",
            "completed": False
        },
        {
            "id": "tl_4",
            "time": "11:00 AM - 01:00 PM",
            "phase": "Welcome Activities",
            "title": "Interactive Carnivals, Neon Escape Room & Games",
            "category": "Activities",
            "location": "Central Lawns",
            "description": "10 student club game stalls open including Giant Jenga, Glow Laser Tag, and VR gaming challenge.",
            "completed": False
        },
        {
            "id": "tl_5",
            "time": "01:00 PM - 02:30 PM",
            "phase": "Food & Refreshments",
            "title": "Carnival Food Street & Acoustic Lawn Jam",
            "category": "Food",
            "location": "Food Court & Shade Pergola",
            "description": "Lunch rush with street-food counters; unplugged acoustic student duos perform on the lawn stage.",
            "completed": False
        },
        {
            "id": "tl_6",
            "time": "02:30 PM - 05:00 PM",
            "phase": "Main Event",
            "title": "Inter-Collegiate Dance Showcase & Stand-up Comedy",
            "category": "Performance",
            "location": "Amphitheatre Stage",
            "description": "Choreography crew finals followed by 45 minutes of student stand-up comedy.",
            "completed": False
        },
        {
            "id": "tl_7",
            "time": "05:00 PM - 06:30 PM",
            "phase": "Food & Refreshments",
            "title": "Golden Hour Chai, Mocktail Hour & 360 Spin Cam",
            "category": "Social",
            "location": "Sunset Promenade",
            "description": "Evening snacks, neon mocktails, 360 spin photo booth with glow props and campus mascot.",
            "completed": False
        },
        {
            "id": "tl_8",
            "time": "06:30 PM - 09:30 PM",
            "phase": "Entertainment",
            "title": "Battle of the Bands Finale & Headliner EDM Set",
            "category": "Concert",
            "location": "Main Stage Amphitheatre",
            "description": "Top 4 college rock bands compete, followed by the headline student DJ with CO2 cannons and full UV light show.",
            "completed": False
        },
        {
            "id": "tl_9",
            "time": "09:30 PM - 10:00 PM",
            "phase": "Closing & Cleanup",
            "title": "Award Ceremony & Curfew Wrap-up",
            "category": "Closing",
            "location": "Main Stage",
            "description": "Dean presents trophies and certificates; volunteer crew initiates rapid waste audit and sound down.",
            "completed": False
        }
    ],
    "checklist": [
        {
            "id": "chk_1",
            "task": "Secure Campus Dean & Proctor Permissions",
            "category": "Permissions",
            "priority": "Urgent",
            "deadline": "4 Weeks Prior",
            "completed": True
        },
        {
            "id": "chk_2",
            "task": "Procure Noise Pollution & Local Police Intimation",
            "category": "Permissions",
            "priority": "Urgent",
            "deadline": "3 Weeks Prior",
            "completed": True
        },
        {
            "id": "chk_3",
            "task": "Finalize Stage, Audio & Lighting Vendor Quotes",
            "category": "Vendors",
            "priority": "High",
            "deadline": "3 Weeks Prior",
            "completed": True
        },
        {
            "id": "chk_4",
            "task": "Launch Online Student Ticketing & QR Registration",
            "category": "Marketing",
            "priority": "High",
            "deadline": "2 Weeks Prior",
            "completed": True
        },
        {
            "id": "chk_5",
            "task": "Order Neon Glow Wristbands & UV Signage Material",
            "category": "Decor",
            "priority": "Medium",
            "deadline": "2 Weeks Prior",
            "completed": True
        },
        {
            "id": "chk_6",
            "task": "Conduct Electrical Load & Generator Backup Test",
            "category": "Logistics",
            "priority": "Urgent",
            "deadline": "1 Week Prior",
            "completed": False
        },
        {
            "id": "chk_7",
            "task": "Confirm Food Truck Menu & Health Hygiene Inspect",
            "category": "Catering",
            "priority": "High",
            "deadline": "1 Week Prior",
            "completed": False
        },
        {
            "id": "chk_8",
            "task": "Hold Volunteer Briefing & Assign Walkie-Talkies",
            "category": "Operations",
            "priority": "Medium",
            "deadline": "3 Days Prior",
            "completed": False
        },
        {
            "id": "chk_9",
            "task": "Assemble First Aid Kit & Designate Medical Room",
            "category": "Safety",
            "priority": "High",
            "deadline": "2 Days Prior",
            "completed": False
        },
        {
            "id": "chk_10",
            "task": "Execute Sound Check & Frequency Wireless Scan",
            "category": "Technical",
            "priority": "Urgent",
            "deadline": "Day-of 08:00 AM",
            "completed": False
        }
    ],
    "vendors": [
        {
            "category": "Sound & Stage Engineering",
            "suggested_role": "Audio vendor with dual subwoofers and line array for 250+ outdoors",
            "questions_to_ask": [
                "Does your quote include a standby sound technician for the entire 12-hour duration?",
                "Are weather-resistant speaker covers provided in case of sudden drizzle?",
                "Do you bring an automatic voltage regulator (AVR) to guard against voltage spikes?"
            ],
            "comparison_criteria": ["Wattage output (min 5000W RMS)", "Wireless mic count (4 minimum)", "Overtime rate per hour"],
            "estimated_budget": 19500.0,
            "status": "Shortlisted",
            "sample_name": "SonicPulse Audio & Staging (Estimate)"
        },
        {
            "category": "Street Food & Food Truck Collective",
            "suggested_role": "High-volume quick service carnival cuisine catering to 250 students",
            "questions_to_ask": [
                "Can you support 3 simultaneous service counters to avoid student queue bottlenecks?",
                "Are eco-friendly biodegradable plates, cups, and wooden cutlery included?",
                "What is your backup plan if gas cylinder refill is required?"
            ],
            "comparison_criteria": ["Service speed per minute", "Dietary mix (Vegan/Jain options)", "FSSAI hygiene certification"],
            "estimated_budget": 48000.0,
            "status": "Negotiating",
            "sample_name": "Urban Bite Food Trucks (Estimate)"
        },
        {
            "category": "UV & Ambient Lighting Crew",
            "suggested_role": "Blacklight installation, neon laser projection, and tree fairy light wrapping",
            "questions_to_ask": [
                "How many UV flood fixtures are needed to illuminate the 3,000 sq ft amphitheatre?",
                "Do all cables come with rubber cable ramps to prevent tripping hazards?",
                "Are emergency exit path lights battery-backed?"
            ],
            "comparison_criteria": ["UV spectrum safety certificate", "Setup speed", "Cable protection provided"],
            "estimated_budget": 19500.0,
            "status": "Shortlisted",
            "sample_name": "GlowArt Illumination Services (Estimate)"
        },
        {
            "category": "Student Media & 360 Spin Cam",
            "suggested_role": "Event videographer, drone operator (if permitted), and social reel editor",
            "questions_to_ask": [
                "Can you provide a 60-second highlight reel within 24 hours of the event?",
                "Do you have low-light f/1.4 lenses suited for night neon photography?",
                "Is raw footage delivery included via cloud drive?"
            ],
            "comparison_criteria": ["Instagram reel turnaround speed", "Low-light portfolio", "Camera redundancy"],
            "estimated_budget": 10500.0,
            "status": "Contacted",
            "sample_name": "ReelForge Campus Productions (Estimate)"
        }
    ],
    "ideas": {
        "theme_concepts": [
            "Retro-Futuristic Cyber Glow: Neon geometric archways illuminated by 365nm UV lighting",
            "Glowing graffiti wall where attendees write messages using fluorescent paint markers",
            "Interactive LED wristbands that blink in sync during the headliner band climax"
        ],
        "activities": [
            "Campus Battle of the Bands: 4 qualifying student bands with audience decibel-meter voting",
            "Glow-in-the-dark Table Tennis & Giant Foosball tournament in the shaded quad",
            "Silent Disco Zone: Dual-channel wireless headphones with two competing student DJs"
        ],
        "food_concepts": [
            "Glow Mocktails: Tonic water-infused citrus spritzers that naturally fluoresce under UV lights",
            "Carnival Slider Bar: Mini brioche burgers with spicy peri-peri fries and corn dogs",
            "Waffle on a Stick with customizable neon sprinkles, chocolate fudge, and fruit syrups"
        ],
        "photo_opportunities": [
            "Infinity Mirror Booth surrounded by cascading neon LED strips",
            "Neon Angel Wings backdrop painted with high-contrast fluorescent pigment",
            "360-degree rotating video platform with slow-motion confetti and glow bubbles"
        ]
    },
    "contingencies": [
        {
            "title": "Sudden Rain or Unfavorable Weather",
            "severity": "High",
            "trigger": "Rain forecast > 40% or sudden drizzle",
            "action_plan": "Seamlessly pivot the concert to the Indoor College Auditorium (pre-booked on standby). The student council corps relocates sound equipment within 45 minutes using covered walkways.",
            "buffer_allocated": "Covered auditorium is pre-approved with zero rental fee."
        },
        {
            "title": "Campus Power Trip or Voltage Fluctuation",
            "severity": "Critical",
            "trigger": "Substation outage or line drop",
            "action_plan": "A 25kVA silent diesel generator is wired to an automatic changeover switch, powering sound, emergency illumination, and food refrigeration within 8 seconds.",
            "buffer_allocated": "₹4,000 allocated within Logistics budget for generator fuel and standby mechanic."
        },
        {
            "title": "Surge Attendance Exceeding 250 Guests",
            "severity": "Medium",
            "trigger": "Registrations exceed 275 (+10%)",
            "action_plan": "Food trucks maintain a 20% raw ingredient buffer on pay-per-consumption terms; security activates secondary lawn overflow perimeter with auxiliary speakers.",
            "buffer_allocated": "10% contingency reserve (₹15,000) absorbs extra food and credential costs."
        },
        {
            "title": "Headline Band or DJ Delay / No-Show",
            "severity": "Medium",
            "trigger": "Performer delayed more than 30 minutes",
            "action_plan": "Resident campus DJ triggers a high-tempo dance party warmup playlist; MC hosts an impromptu crowd trivia and dance-off contest with sponsor gift hampers.",
            "buffer_allocated": "Pre-screened backup DJ student resident on standby with USB drive."
        },
        {
            "title": "Sound Level Regulation & Campus Curfew",
            "severity": "High",
            "trigger": "Clock approaches 09:45 PM",
            "action_plan": "Decibel levels lowered by 10dB at 09:30 PM. Acoustic set and award ceremony conclude at 09:55 PM sharp, fully adhering to city sound curfew ordinances.",
            "buffer_allocated": "Strict timekeeper student appointed with direct radio link to sound engineer."
        }
    ]
}

PRESET_TEMPLATES = {
    "wedding": {
        "title": "Enchanted Garden Wedding Celebration",
        "occasion": "Wedding",
        "city": "Jaipur",
        "venue": "Heritage Courtyard & Royal Pavilion",
        "guests": 200,
        "budget": 800000.0,
        "currency": "₹",
        "contingency_percent": 12.0,
        "vibe": "Opulent, Romantic & Timeless",
        "color_palette": [
            {"name": "Rose Gold", "hex": "#E0A99A"},
            {"name": "Warm Ivory", "hex": "#FDFBF7"},
            {"name": "Deep Emerald", "hex": "#064E3B"},
            {"name": "Champagne Gold", "hex": "#D4AF37"}
        ],
        "category_percentages": {
            "Venue & Facilities": 22.0,
            "Food & Catering": 30.0,
            "Decorations & Lighting": 16.0,
            "Photography & Video": 10.0,
            "Entertainment & Sound": 8.0,
            "Invitations & Guest Favors": 4.0,
            "Transport & Logistics": 5.0,
            "Miscellaneous Expenses": 5.0
        }
    },
    "birthday": {
        "title": "Golden 30th Rooftop Soirée",
        "occasion": "Birthday",
        "city": "Mumbai",
        "venue": "Boutique Skyline Rooftop Lounge",
        "guests": 60,
        "budget": 95000.0,
        "currency": "₹",
        "contingency_percent": 10.0,
        "vibe": "Chic, Intimate & Sophisticated",
        "color_palette": [
            {"name": "Midnight Blue", "hex": "#1E293B"},
            {"name": "Sunset Coral", "hex": "#F43F5E"},
            {"name": "Gilded Gold", "hex": "#F59E0B"},
            {"name": "Pure Pearl", "hex": "#F8FAFC"}
        ],
        "category_percentages": {
            "Venue & Facilities": 20.0,
            "Food & Catering": 38.0,
            "Decorations & Lighting": 14.0,
            "Photography & Video": 8.0,
            "Entertainment & Sound": 10.0,
            "Invitations & Guest Favors": 3.0,
            "Transport & Logistics": 3.0,
            "Miscellaneous Expenses": 4.0
        }
    },
    "college_fest": {
        "title": "Campus Carnival 2026: Neon Nights",
        "occasion": "College fest",
        "city": "Bengaluru",
        "venue": "Campus Amphitheatre & Central Lawns",
        "guests": 250,
        "budget": 150000.0,
        "currency": "₹",
        "contingency_percent": 10.0,
        "vibe": "Energetic, Youthful & Immersive",
        "color_palette": [
            {"name": "Electric Violet", "hex": "#8B5CF6"},
            {"name": "Neon Cyan", "hex": "#06B6D4"},
            {"name": "Hot Coral", "hex": "#F43F5E"},
            {"name": "Cyber Yellow", "hex": "#FACC15"}
        ],
        "category_percentages": {
            "Venue & Facilities": 8.0,
            "Food & Catering": 32.0,
            "Decorations & Lighting": 16.0,
            "Photography & Video": 7.0,
            "Entertainment & Sound": 15.0,
            "Invitations & Badges": 3.0,
            "Transport & Logistics": 5.0,
            "Miscellaneous Expenses": 4.0
        }
    },
    "anniversary": {
        "title": "Silver Jubilee Vintage Gala",
        "occasion": "Anniversary",
        "city": "Delhi NCR",
        "venue": "Heritage Country Club Lawn",
        "guests": 120,
        "budget": 350000.0,
        "currency": "₹",
        "contingency_percent": 10.0,
        "vibe": "Elegant, Nostalgic & Warm",
        "color_palette": [
            {"name": "Silver Shimmer", "hex": "#94A3B8"},
            {"name": "Royal Navy", "hex": "#0F172A"},
            {"name": "Blush Pink", "hex": "#F472B6"},
            {"name": "Ivory Lace", "hex": "#FDFBF7"}
        ],
        "category_percentages": {
            "Venue & Facilities": 20.0,
            "Food & Catering": 35.0,
            "Decorations & Lighting": 16.0,
            "Photography & Video": 11.0,
            "Entertainment & Sound": 8.0,
            "Invitations & Guest Favors": 4.0,
            "Transport & Logistics": 3.0,
            "Miscellaneous Expenses": 3.0
        }
    },
    "corporate": {
        "title": "Annual Tech Innovation Summit & Gala",
        "occasion": "Corporate event",
        "city": "Hyderabad",
        "venue": "International Convention Center Ballroom",
        "guests": 300,
        "budget": 1200000.0,
        "currency": "₹",
        "contingency_percent": 10.0,
        "vibe": "Professional, Futuristic & Engaging",
        "color_palette": [
            {"name": "Deep Tech Indigo", "hex": "#312E81"},
            {"name": "Cyan Electric", "hex": "#06B6D4"},
            {"name": "Platinum White", "hex": "#F8FAFC"},
            {"name": "Graphite Black", "hex": "#1E293B"}
        ],
        "category_percentages": {
            "Venue & Facilities": 28.0,
            "Food & Catering": 28.0,
            "Decorations & Lighting": 12.0,
            "Photography & Video": 8.0,
            "Entertainment & Sound": 12.0,
            "Invitations & Badges": 3.0,
            "Transport & Logistics": 5.0,
            "Miscellaneous Expenses": 4.0
        }
    },
    "community": {
        "title": "Harvest Community Fair & Cultural Mela",
        "occasion": "Community gathering",
        "city": "Pune",
        "venue": "Community Township Park & Pavilion",
        "guests": 400,
        "budget": 200000.0,
        "currency": "₹",
        "contingency_percent": 8.0,
        "vibe": "Festive, Warm & Inclusive",
        "color_palette": [
            {"name": "Marigold Gold", "hex": "#F59E0B"},
            {"name": "Terracotta Orange", "hex": "#EA580C"},
            {"name": "Peacock Teal", "hex": "#0D9488"},
            {"name": "Festive Cream", "hex": "#FEF3C7"}
        ],
        "category_percentages": {
            "Venue & Facilities": 10.0,
            "Food & Catering": 35.0,
            "Decorations & Lighting": 18.0,
            "Photography & Video": 6.0,
            "Entertainment & Sound": 16.0,
            "Invitations & Badges": 3.0,
            "Transport & Logistics": 7.0,
            "Miscellaneous Expenses": 5.0
        }
    }
}
