/**
 * EventGenie AI - Hero Section Component
 */

export function renderHero() {
  return `
    <section class="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      
      <!-- Background Ambient Glows -->
      <div class="ambient-glow-violet -top-20 -left-20"></div>
      <div class="ambient-glow-coral top-40 -right-20"></div>

      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <!-- Left Hero Content -->
        <div class="lg:col-span-7 space-y-8 text-center lg:text-left">
          
          <!-- Category Badge -->
          <div class="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel border border-violet-500/30 text-xs sm:text-sm font-semibold text-violet-300">
            <span class="text-coral-400">✦</span>
            <span>Celebration & Event Planner PromptWars Edition</span>
          </div>

          <!-- Main Headline -->
          <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-heading leading-tight">
            Your Dream Event.<br/>
            <span class="bg-gradient-to-r from-violet-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
              Planned by AI.
            </span>
          </h1>

          <!-- Supporting Text -->
          <p class="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
            From your first idea to the final celebration, turn any occasion into a beautifully organized event with deterministic budgets, automated run of show, and actionable vendor intelligence.
          </p>

          <!-- CTAs -->
          <div class="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <button id="hero-btn-plan" class="px-8 py-4 rounded-2xl text-base font-bold gradient-accent-button text-white shadow-xl shadow-violet-600/25 flex items-center gap-3 transform hover:scale-[1.02] transition">
              <span>✨</span>
              <span>Plan My Event</span>
            </button>

            <button id="hero-btn-demo" class="px-7 py-4 rounded-2xl text-base font-semibold glass-card text-white hover:border-violet-400/50 flex items-center gap-3 transition">
              <span class="text-amber-400">⚡</span>
              <span>Explore Demo (Campus Carnival 2026)</span>
            </button>
          </div>

          <!-- Trust & Value Bullets -->
          <div class="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 max-w-lg mx-auto lg:mx-0 text-left">
            <div>
              <div class="text-xl sm:text-2xl font-bold font-heading text-white">100%</div>
              <div class="text-xs text-slate-400 font-medium">Deterministic Math (No LLM Hallucinations)</div>
            </div>
            <div>
              <div class="text-xl sm:text-2xl font-bold font-heading text-white">9 Categories</div>
              <div class="text-xs text-slate-400 font-medium">Smart Balanced Budget Planner</div>
            </div>
            <div>
              <div class="text-xl sm:text-2xl font-bold font-heading text-white">Instant</div>
              <div class="text-xs text-slate-400 font-medium">Local & SQLite Persistence</div>
            </div>
          </div>

        </div>

        <!-- Right Hero Preview Card (Campus Carnival 2026 Sneak Peek) -->
        <div class="lg:col-span-5 relative">
          
          <div class="relative glass-panel rounded-3xl p-6 sm:p-7 shadow-2xl border border-violet-500/20 backdrop-blur-2xl">
            
            <!-- Live Preview Header -->
            <div class="flex items-center justify-between pb-4 border-b border-white/10">
              <div class="flex items-center gap-3">
                <span class="w-3 h-3 rounded-full bg-rose-500"></span>
                <span class="w-3 h-3 rounded-full bg-amber-500"></span>
                <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Live Blueprint Preview</span>
              </div>
              <span class="text-xs px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 font-semibold border border-violet-500/30">
                College Fest
              </span>
            </div>

            <!-- Event Card Body -->
            <div class="pt-5 space-y-4">
              <div>
                <div class="text-xs text-violet-400 font-bold uppercase tracking-wider">Featured Demo Showcase</div>
                <h3 class="text-xl sm:text-2xl font-bold font-heading text-white mt-1">Campus Carnival 2026: Neon Nights</h3>
                <p class="text-xs text-slate-300 mt-1 line-clamp-2">
                  An all-day youth celebration fusing retro-wave synth aesthetics with high-energy university festivities.
                </p>
              </div>

              <!-- Key Metrics Strip -->
              <div class="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-900/80 border border-white/5 text-center">
                <div>
                  <div class="text-[10px] text-slate-400 font-semibold">GUESTS</div>
                  <div class="text-sm font-bold text-white">250 Students</div>
                </div>
                <div>
                  <div class="text-[10px] text-slate-400 font-semibold">BUDGET</div>
                  <div class="text-sm font-bold text-amber-400">₹1,50,000</div>
                </div>
                <div>
                  <div class="text-[10px] text-slate-400 font-semibold">CONTINGENCY</div>
                  <div class="text-sm font-bold text-emerald-400">10% Safe</div>
                </div>
              </div>

              <!-- Color Palette Swatches -->
              <div class="space-y-1.5">
                <div class="text-[11px] text-slate-400 font-medium">Curated Neon Color Palette:</div>
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-lg shadow" style="background-color: #8B5CF6;" title="Electric Violet"></div>
                  <div class="w-7 h-7 rounded-lg shadow" style="background-color: #06B6D4;" title="Neon Cyan"></div>
                  <div class="w-7 h-7 rounded-lg shadow" style="background-color: #F43F5E;" title="Hot Coral"></div>
                  <div class="w-7 h-7 rounded-lg shadow" style="background-color: #FACC15;" title="Cyber Yellow"></div>
                  <div class="w-7 h-7 rounded-lg shadow border border-white/20" style="background-color: #0F172A;" title="Midnight Void"></div>
                  <span class="text-xs text-slate-400 ml-2">UV Glow Optimized</span>
                </div>
              </div>

              <!-- Quick Timeline Peek -->
              <div class="space-y-2 pt-2">
                <div class="text-[11px] text-slate-400 font-medium">Schedule Run of Show (9 Milestones):</div>
                <div class="space-y-1.5 text-xs text-slate-300">
                  <div class="flex items-center justify-between p-2 rounded-lg bg-white/5">
                    <span class="font-medium text-violet-300">10:00 AM</span>
                    <span class="truncate ml-2">Gates Open & Glow Wristband Check-in</span>
                    <span class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Ready</span>
                  </div>
                  <div class="flex items-center justify-between p-2 rounded-lg bg-white/5">
                    <span class="font-medium text-violet-300">06:30 PM</span>
                    <span class="truncate ml-2">Battle of the Bands Finale & EDM Set</span>
                    <span class="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300">Highlight</span>
                  </div>
                </div>
              </div>

              <!-- CTA Inside Preview -->
              <button id="preview-explore-btn" class="w-full py-3 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white transition flex items-center justify-center gap-2 shadow-lg">
                <span>⚡ Open Campus Carnival Blueprint</span>
                <span>→</span>
              </button>

            </div>

          </div>

        </div>

      </div>

      <!-- How It Works Section -->
      <div class="mt-24 pt-16 border-t border-white/10 text-center">
        <h2 class="text-2xl sm:text-3xl font-extrabold font-heading text-white">How EventGenie Works</h2>
        <p class="text-sm sm:text-base text-slate-400 mt-2 max-w-xl mx-auto">
          Turn scattered ideas into a professional, production-ready event execution blueprint in three simple steps.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left">
          
          <!-- Step 1 -->
          <div class="glass-card p-6 rounded-2xl relative">
            <div class="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30 font-bold font-heading flex items-center justify-center text-lg mb-4">
              01
            </div>
            <h3 class="text-lg font-bold font-heading text-white">Input Vision & Constraints</h3>
            <p class="text-xs text-slate-300 mt-2 leading-relaxed">
              Define your event type, guest count, city, venue, and total budget. Choose your theme, vibe, dietary preferences, and special requirements.
            </p>
          </div>

          <!-- Step 2 -->
          <div class="glass-card p-6 rounded-2xl relative">
            <div class="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/30 font-bold font-heading flex items-center justify-center text-lg mb-4">
              02
            </div>
            <h3 class="text-lg font-bold font-heading text-white">AI Synthesizes Blueprint</h3>
            <p class="text-xs text-slate-300 mt-2 leading-relaxed">
              EventGenie generates an itemized 9-category budget, run-of-show timeline, milestone checklist, vendor interview guides, and contingency backups.
            </p>
          </div>

          <!-- Step 3 -->
          <div class="glass-card p-6 rounded-2xl relative">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold font-heading flex items-center justify-center text-lg mb-4">
              03
            </div>
            <h3 class="text-lg font-bold font-heading text-white">Refine, Copilot & Export</h3>
            <p class="text-xs text-slate-300 mt-2 leading-relaxed">
              Collaborate with the Contextual AI Copilot to optimize costs or adapt to rain. Persist your changes and export printable plans or CSV budget sheets.
            </p>
          </div>

        </div>
      </div>

      <!-- Presets Quick Exploration Shelf -->
      <div class="mt-20">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-xl font-bold font-heading text-white">Explore Celebration Categories</h3>
            <p class="text-xs text-slate-400">Pre-configured blueprints tailored to specific celebration traditions</p>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          ${[
            { title: "Weddings", icon: "💍", occasion: "Wedding", desc: "Opulent & Romantic" },
            { title: "Birthdays", icon: "🎂", occasion: "Birthday", desc: "Intimate & Festive" },
            { title: "College Fests", icon: "🎪", occasion: "College fest", desc: "High-Energy & Youthful" },
            { title: "Anniversaries", icon: "🥂", occasion: "Anniversary", desc: "Silver & Golden Galas" },
            { title: "Corporate", icon: "💼", occasion: "Corporate event", desc: "Professional & Sleek" },
            { title: "Community", icon: "🏮", occasion: "Community gathering", desc: "Inclusive & Cultural" }
          ].map(cat => `
            <div class="preset-card glass-card p-4 rounded-2xl cursor-pointer hover:border-violet-500/40 transition group" data-occasion="${cat.occasion}">
              <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">${cat.icon}</div>
              <h4 class="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">${cat.title}</h4>
              <p class="text-[11px] text-slate-400 mt-1">${cat.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>

    </section>
  `;
}
