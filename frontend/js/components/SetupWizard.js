/**
 * EventGenie AI - Multi-Step AI Event Setup Wizard
 */

export function renderSetupWizard(state) {
  const currentStep = state.wizardStep || 1;
  const form = state.wizardForm || {
    occasion: 'College fest',
    title: 'Campus Carnival 2026',
    vibe: 'Energetic, Youthful & Immersive',
    indoor_outdoor: 'Outdoor with covered pavilions',
    city: 'Bengaluru',
    venue: 'Campus Amphitheatre & Central Lawns',
    date: '2026-11-14',
    start_time: '10:00',
    duration: 12,
    guests: 250,
    budget: 150000,
    currency: '₹',
    contingency_percent: 10,
    theme: 'Neon Nights: Retro-Futuristic Glow',
    dietary: 'Standard & Vegetarian, Vegan options',
    special_requests: 'Require stage line-array audio, glow-in-the-dark photo booth, student band competition'
  };

  const steps = [
    { num: 1, title: "Occasion & Details", desc: "Type & Vibe" },
    { num: 2, title: "Venue & Guests", desc: "Location & Size" },
    { num: 3, title: "Budget & Contingency", desc: "Financial Limits" },
    { num: 4, title: "Theme & Preferences", desc: "Experience Styling" },
    { num: 5, title: "Review & Generate", desc: "Synthesize Plan" }
  ];

  return `
    <div id="setup-modal-container" class="max-w-4xl mx-auto my-8 px-4 sm:px-6">
      <div class="glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl border border-violet-500/20 relative">
        
        <!-- Header -->
        <div class="flex items-center justify-between pb-6 border-b border-white/10">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-xs text-violet-300 font-semibold mb-2">
              <span>✦</span> Step ${currentStep} of 5
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold font-heading text-white">Create Your Event Blueprint</h2>
            <p class="text-xs sm:text-sm text-slate-400 mt-1">Configure your celebration constraints and let EventGenie AI build a full execution plan.</p>
          </div>
          <button id="btn-cancel-wizard" class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition" title="Close Setup">
            ✕
          </button>
        </div>

        <!-- Progress Indicator -->
        <div class="py-6 overflow-x-auto">
          <div class="flex items-center justify-between min-w-[550px] relative">
            <div class="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 w-full z-0"></div>
            <div class="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-300 z-0" style="width: ${((currentStep - 1) / 4) * 100}%"></div>
            
            ${steps.map(s => {
              const isPast = s.num < currentStep;
              const isCurrent = s.num === currentStep;
              return `
                <div class="wizard-step-node relative z-10 flex flex-col items-center cursor-pointer select-none" data-step="${s.num}">
                  <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isPast ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' :
                    isCurrent ? 'gradient-accent-button text-white ring-4 ring-violet-500/25 shadow-lg shadow-violet-500/40' :
                    'bg-slate-800 text-slate-400 border border-white/10'
                  }">
                    ${isPast ? '✓' : s.num}
                  </div>
                  <div class="text-[11px] font-semibold mt-2 ${isCurrent ? 'text-white' : 'text-slate-400'}">${s.title}</div>
                  <div class="text-[9px] text-slate-500 hidden sm:block">${s.desc}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Step Form Body -->
        <div class="mt-4 pt-2">
          ${renderStepContent(currentStep, form, state)}
        </div>

        <!-- Footer Navigation -->
        <div class="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
          <button id="btn-wizard-prev" class="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold glass-card text-slate-300 hover:text-white transition ${currentStep === 1 ? 'opacity-40 cursor-not-allowed' : ''}" ${currentStep === 1 ? 'disabled' : ''}>
            ← Back
          </button>

          <div class="flex items-center gap-3">
            ${currentStep < 5 ? `
              <button id="btn-wizard-next" class="px-7 py-3 rounded-xl text-xs sm:text-sm font-bold gradient-accent-button text-white shadow-lg shadow-violet-600/30 transition">
                Next: ${steps[currentStep]?.title || 'Continue'} →
              </button>
            ` : `
              <button id="btn-wizard-generate" class="px-8 py-3.5 rounded-2xl text-sm font-extrabold gradient-accent-button text-white shadow-xl shadow-violet-600/40 hover:scale-[1.02] transition flex items-center gap-2">
                <span>✨</span>
                <span>Generate Event Blueprint</span>
              </button>
            `}
          </div>
        </div>

      </div>
    </div>
  `;
}

function renderStepContent(step, form, state) {
  if (step === 1) {
    const occasions = [
      { id: "Wedding", label: "Wedding", icon: "💍" },
      { id: "Birthday", label: "Birthday", icon: "🎂" },
      { id: "College fest", label: "College Fest", icon: "🎪" },
      { id: "Anniversary", label: "Anniversary", icon: "🥂" },
      { id: "Cultural festival", label: "Cultural Festival", icon: "🏮" },
      { id: "Corporate event", label: "Corporate Event", icon: "💼" },
      { id: "Community gathering", label: "Community Gathering", icon: "🤝" },
      { id: "Custom event", label: "Custom Event", icon: "✨" }
    ];

    const vibes = [
      "Energetic, Youthful & Immersive",
      "Opulent, Romantic & Timeless",
      "Chic, Intimate & Sophisticated",
      "Festive, Warm & Traditional",
      "Modern, Tech-Forward & Professional",
      "Bohemian, Cozy & Artistic"
    ];

    return `
      <div class="space-y-6">
        <div>
          <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Select Occasion Preset *</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            ${occasions.map(occ => `
              <button type="button" class="preset-choice-btn p-3 rounded-xl text-left border transition flex items-center gap-2.5 ${
                form.occasion === occ.id ? 'bg-violet-600/25 border-violet-500 text-white font-semibold shadow-md shadow-violet-500/20' : 'bg-slate-900/60 border-white/5 text-slate-300 hover:border-white/20'
              }" data-val="${occ.id}">
                <span class="text-lg">${occ.icon}</span>
                <span class="text-xs">${occ.label}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Event Title / Name *</label>
            <input type="text" id="inp-wizard-title" value="${form.title}" placeholder="e.g. Neon Nights Campus Fest" class="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:border-violet-500 focus:outline-none transition" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Atmosphere / Vibe</label>
            <select id="inp-wizard-vibe" class="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:border-violet-500 focus:outline-none transition">
              ${vibes.map(v => `<option value="${v}" ${form.vibe === v ? 'selected' : ''}>${v}</option>`).join('')}
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Venue Setting Preference</label>
          <div class="grid grid-cols-3 gap-3">
            ${['Outdoor with covered pavilions', 'Indoor Air-Conditioned Hall', 'Hybrid Indoor & Outdoor Lawns'].map(setting => `
              <label class="p-3 rounded-xl border cursor-pointer text-xs font-medium flex items-center gap-2 transition ${form.indoor_outdoor === setting ? 'bg-violet-600/20 border-violet-500 text-white' : 'bg-slate-900/60 border-white/5 text-slate-400 hover:border-white/20'}">
                <input type="radio" name="inp-wizard-setting" value="${setting}" ${form.indoor_outdoor === setting ? 'checked' : ''} class="text-violet-500" />
                <span>${setting}</span>
              </label>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  if (step === 2) {
    const popularCities = ["Bengaluru", "Mumbai", "Delhi NCR", "Jaipur", "Goa", "Hyderabad", "Pune", "Kolkata", "Chennai", "New York", "London"];
    const guestPresets = [50, 100, 250, 500, 1000];

    return `
      <div class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">City / Location *</label>
            <input type="text" id="inp-wizard-city" value="${form.city}" placeholder="e.g. Bengaluru" class="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:border-violet-500 focus:outline-none transition" />
            <div class="flex flex-wrap gap-1.5 mt-2">
              ${popularCities.slice(0, 6).map(c => `
                <button type="button" class="city-chip-btn px-2.5 py-1 rounded-lg text-[10px] bg-slate-800 text-slate-300 hover:bg-slate-700 transition" data-city="${c}">${c}</button>
              `).join('')}
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Venue Preference / Name</label>
            <input type="text" id="inp-wizard-venue" value="${form.venue}" placeholder="e.g. Campus Amphitheatre & Central Lawns" class="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:border-violet-500 focus:outline-none transition" />
            <p class="text-[10px] text-slate-500 mt-1.5">Note: EventGenie calculates cost estimates. Live venue booking is managed directly by you.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Event Date *</label>
            <input type="date" id="inp-wizard-date" value="${form.date}" class="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:border-violet-500 focus:outline-none transition" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Start Time *</label>
            <input type="time" id="inp-wizard-time" value="${form.start_time}" class="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:border-violet-500 focus:outline-none transition" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Duration (Hours)</label>
            <input type="number" id="inp-wizard-duration" min="2" max="72" value="${form.duration}" class="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:border-violet-500 focus:outline-none transition" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Expected Number of Guests *</label>
          <div class="flex items-center gap-3">
            <input type="number" id="inp-wizard-guests" min="10" max="10000" value="${form.guests}" class="w-48 px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm font-semibold focus:border-violet-500 focus:outline-none transition" />
            <div class="flex flex-wrap gap-2">
              ${guestPresets.map(g => `
                <button type="button" class="guests-chip-btn px-3 py-1.5 rounded-lg text-xs font-semibold ${form.guests === g ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'} transition" data-guests="${g}">
                  ${g}
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (step === 3) {
    return `
      <div class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div class="sm:col-span-8">
            <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Total Planned Budget *</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">${form.currency}</span>
              <input type="number" id="inp-wizard-budget" min="1000" step="1000" value="${form.budget}" class="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-lg font-bold focus:border-violet-500 focus:outline-none transition" />
            </div>
          </div>

          <div class="sm:col-span-4">
            <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Currency</label>
            <select id="inp-wizard-currency" class="w-full px-4 py-3.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm font-semibold focus:border-violet-500 focus:outline-none transition">
              <option value="₹" ${form.currency === '₹' ? 'selected' : ''}>₹ INR (Indian Rupee)</option>
              <option value="$" ${form.currency === '$' ? 'selected' : ''}>$ USD (US Dollar)</option>
              <option value="€" ${form.currency === '€' ? 'selected' : ''}>€ EUR (Euro)</option>
              <option value="£" ${form.currency === '£' ? 'selected' : ''}>£ GBP (British Pound)</option>
            </select>
          </div>
        </div>

        <!-- Contingency Slider -->
        <div class="p-5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-slate-200">Emergency Contingency Buffer</span>
              <p class="text-[11px] text-slate-400">Guarantees safety reserves for last-minute guest additions or weather pivots</p>
            </div>
            <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
              <span id="wizard-contingency-val">${form.contingency_percent}</span>% Reserved
            </span>
          </div>

          <input type="range" id="inp-wizard-contingency" min="5" max="25" step="1" value="${form.contingency_percent}" class="w-full accent-emerald-500 cursor-pointer" />
          
          <div class="flex justify-between text-[10px] text-slate-500">
            <span>5% (Lean)</span>
            <span>10% (Recommended Standard)</span>
            <span>20% (Conservative / High Weather Risk)</span>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-violet-950/30 border border-violet-500/20 text-xs text-violet-200 flex items-start gap-3">
          <span class="text-base text-amber-400">⚖</span>
          <div>
            <strong class="font-bold text-white">EventGenie Deterministic Guarantee:</strong>
            <p class="mt-0.5 text-slate-300">All financial formulas are executed in programmatic JavaScript & Python code. Sum of categories and contingency will mathematically equal 100% of your total budget.</p>
          </div>
        </div>
      </div>
    `;
  }

  if (step === 4) {
    return `
      <div class="space-y-6">
        <div>
          <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Theme, Mood & Styling Narrative</label>
          <input type="text" id="inp-wizard-theme" value="${form.theme}" placeholder="e.g. Neon Nights: Retro-Futuristic Glow" class="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:border-violet-500 focus:outline-none transition" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Food, Catering & Dietary Requirements</label>
          <input type="text" id="inp-wizard-dietary" value="${form.dietary}" placeholder="e.g. Street food stalls, vegan and gluten-free counters, mocktail bar" class="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:border-violet-500 focus:outline-none transition" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Special Requests & Key Priorities</label>
          <textarea id="inp-wizard-special" rows="3" placeholder="e.g. Battle of the bands competition, 360 photo booth, zero single-use plastics" class="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:border-violet-500 focus:outline-none transition">${form.special_requests}</textarea>
        </div>
      </div>
    `;
  }

  if (step === 5) {
    const isAi = state.aiConfigured;
    return `
      <div class="space-y-6">
        <div class="p-6 rounded-2xl bg-slate-900/80 border border-violet-500/30 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <div class="text-xs text-violet-400 font-bold uppercase tracking-wider">${form.occasion}</div>
              <h3 class="text-xl font-bold font-heading text-white mt-0.5">${form.title}</h3>
            </div>
            <span class="px-3 py-1 rounded-full ${isAi ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'} text-xs font-semibold">
              ${isAi ? 'Live Gemini AI Mode' : 'Smart Demo Mode'}
            </span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <div class="text-slate-400 font-medium">Location:</div>
              <div class="font-semibold text-white mt-0.5">${form.venue}, ${form.city}</div>
            </div>
            <div>
              <div class="text-slate-400 font-medium">Timing:</div>
              <div class="font-semibold text-white mt-0.5">${form.date} (${form.start_time})</div>
            </div>
            <div>
              <div class="text-slate-400 font-medium">Headcount:</div>
              <div class="font-semibold text-white mt-0.5">${form.guests} Guests</div>
            </div>
            <div>
              <div class="text-slate-400 font-medium">Budget:</div>
              <div class="font-bold text-amber-400 mt-0.5">${form.currency}${Number(form.budget).toLocaleString()}</div>
            </div>
          </div>

          <div class="pt-3 border-t border-white/10 text-xs text-slate-300 space-y-1">
            <div><strong class="text-white">Theme:</strong> ${form.theme}</div>
            <div><strong class="text-white">Setting:</strong> ${form.indoor_outdoor}</div>
            <div><strong class="text-white">Contingency:</strong> ${form.contingency_percent}% Emergency Reserve</div>
          </div>
        </div>

        <!-- AI Loading Skeleton Overlay (hidden by default) -->
        <div id="wizard-loading-state" class="hidden p-8 rounded-2xl glass-card border border-violet-500/30 text-center space-y-4">
          <div class="w-12 h-12 rounded-full border-4 border-violet-500/30 border-t-violet-500 animate-spin mx-auto"></div>
          <div>
            <h4 class="text-lg font-bold font-heading text-white" id="loading-ticker-text">Synthesizing personalized event blueprint...</h4>
            <p class="text-xs text-slate-400 mt-1">Balancing 9 budget categories and generating run of show timeline</p>
          </div>
          <div class="w-48 h-1.5 rounded-full bg-slate-800 overflow-hidden mx-auto">
            <div class="h-full bg-gradient-to-r from-violet-500 to-pink-500 animate-pulse w-full"></div>
          </div>
        </div>
      </div>
    `;
  }
}
