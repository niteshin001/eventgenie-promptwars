/**
 * EventGenie AI - Personalized Ideas & Creative Inspiration Component
 */

export function renderCreativeIdeas(event) {
  if (!event || !event.ideas) return '';

  const ideas = event.ideas;
  const sections = [
    { title: "Theme & Decor Concepts", icon: "🎨", items: ideas.theme_concepts || [] },
    { title: "Interactive Activities & Games", icon: "🎲", items: ideas.activities || [] },
    { title: "Signature Food & Drink Ideas", icon: "🍸", items: ideas.food_concepts || [] },
    { title: "Photo Ops & Social Media Sets", icon: "📸", items: ideas.photo_opportunities || [] }
  ];

  return `
    <div class="space-y-6" id="ideas-section">
      
      <!-- Section Header -->
      <div class="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-xs text-pink-300 font-semibold mb-2">
          <span>✨</span> Experiential Creativity
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold font-heading text-white">Personalized Celebration Ideas</h2>
        <p class="text-xs sm:text-sm text-slate-400 mt-1">
          Tailored concepts for ${event.occasion} in ${event.city} calibrated for ${event.guests} guests.
        </p>
      </div>

      <!-- 4 Pillars Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${sections.map(sec => `
          <div class="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
            
            <div class="flex items-center gap-3 pb-3 border-b border-white/10">
              <span class="text-2xl">${sec.icon}</span>
              <h3 class="text-lg font-bold font-heading text-white">${sec.title}</h3>
            </div>

            <div class="space-y-3">
              ${sec.items.map((item, idx) => `
                <div class="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-200 leading-relaxed flex items-start gap-3">
                  <span class="w-5 h-5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    ${idx + 1}
                  </span>
                  <span>${item}</span>
                </div>
              `).join('')}
            </div>

          </div>
        `).join('')}
      </div>

    </div>
  `;
}
