/**
 * EventGenie AI - Contingency Planner Component
 * Protocols for weather, power loss, vendor delays, budget overruns, and attendance surges.
 */

export function renderContingency(event) {
  if (!event || !event.contingencies) return '';

  const contingencies = event.contingencies;

  return `
    <div class="space-y-6" id="contingency-section">
      
      <!-- Section Header -->
      <div class="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 font-semibold mb-2">
          <span>🛡</span> Risk Mitigation & Resilience
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold font-heading text-white">Contingency & Emergency Protocols</h2>
        <p class="text-xs sm:text-sm text-slate-400 mt-1">
          Pre-approved fallback strategies to guarantee uninterrupted event execution under unexpected disruptions.
        </p>
      </div>

      <!-- Contingency Cards List -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${contingencies.map((c, idx) => {
          const isCritical = c.severity === 'Critical' || c.severity === 'High';
          return `
            <div class="glass-card rounded-2xl p-6 border border-white/10 space-y-4 flex flex-col justify-between">
              
              <div class="space-y-3">
                <div class="flex items-start justify-between gap-3">
                  <h3 class="text-base font-bold font-heading text-white">${c.title}</h3>
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
                    isCritical ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }">
                    ${c.severity || 'High Risk'}
                  </span>
                </div>

                <!-- Trigger Condition -->
                <div class="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-300">
                  <span class="text-amber-400 font-bold mr-1.5">⚡ Trigger:</span>
                  <span>${c.trigger}</span>
                </div>

                <!-- Action Plan -->
                <div class="space-y-1">
                  <div class="text-xs font-bold text-slate-200">Mitigation Protocol:</div>
                  <p class="text-xs text-slate-300 leading-relaxed">${c.action_plan}</p>
                </div>
              </div>

              <!-- Buffer Allocated Note -->
              <div class="pt-3 border-t border-white/5 text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
                <span>🛡</span>
                <span>${c.buffer_allocated || 'Covered under emergency contingency fund.'}</span>
              </div>

            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
}
