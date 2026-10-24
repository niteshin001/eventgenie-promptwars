/**
 * EventGenie AI - Interactive Event Timeline (Run of Show)
 * Supports editing, adding new items, marking completed, and phase filtering.
 */

export function renderTimeline(event, state) {
  if (!event) return '';

  const timeline = event.timeline || [];
  const filterPhase = state.timelineFilter || 'All';
  
  const phases = ['All', 'Setup', 'Arrival', 'Activities', 'Main', 'Food', 'Entertainment', 'Closing'];

  const filteredItems = filterPhase === 'All' ? timeline : timeline.filter(item => {
    const p = (item.phase || '').toLowerCase() + (item.category || '').toLowerCase();
    return p.includes(filterPhase.toLowerCase());
  });

  return `
    <div class="space-y-6" id="timeline-section">
      
      <!-- Timeline Header -->
      <div class="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-xs text-violet-300 font-semibold mb-2">
              <span>⏰</span> Run of Show Sequencer
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold font-heading text-white">Event Timeline & Schedule</h2>
            <p class="text-xs sm:text-sm text-slate-400 mt-1">Master schedule from early vendor setup to post-curfew load-out.</p>
          </div>

          <!-- Add Item Button -->
          <button id="btn-add-timeline-item" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold gradient-accent-button text-white shadow-md flex items-center gap-2 transition">
            <span>+</span>
            <span>Add Schedule Item</span>
          </button>
        </div>

        <!-- Phase Filter Tabs -->
        <div class="flex items-center gap-2 pt-4 overflow-x-auto pb-1">
          <span class="text-xs text-slate-500 mr-1 hidden sm:inline">Filter:</span>
          ${phases.map(ph => `
            <button class="timeline-filter-btn px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              filterPhase === ph ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30' : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }" data-phase="${ph}">
              ${ph}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Timeline Items List -->
      <div class="space-y-3.5">
        ${filteredItems.length === 0 ? `
          <div class="glass-card rounded-2xl p-12 text-center text-slate-400 text-sm">
            No schedule milestones matching filter "${filterPhase}".
          </div>
        ` : filteredItems.map((item, idx) => {
          const isDone = item.completed;
          return `
            <div class="timeline-row-card glass-card rounded-2xl p-5 border border-white/10 flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition hover:border-violet-500/30 ${
              isDone ? 'opacity-65 bg-slate-950/40' : ''
            }" data-id="${item.id}">
              
              <!-- Checkbox & Timing -->
              <div class="flex items-start gap-4">
                <input type="checkbox" class="timeline-check custom-checkbox mt-1 w-5 h-5 rounded-lg border border-white/20 bg-slate-900 cursor-pointer accent-violet-600 transition" ${isDone ? 'checked' : ''} data-id="${item.id}" />
                
                <div class="space-y-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="text-xs font-bold text-violet-400 bg-violet-500/10 px-2.5 py-0.5 rounded-md border border-violet-500/20">${item.time}</span>
                    <span class="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">${item.phase || 'Schedule'}</span>
                    ${item.category ? `<span class="text-[11px] text-slate-400 font-semibold">📍 ${item.location || 'Venue'}</span>` : ''}
                  </div>

                  <h4 class="text-base font-bold font-heading text-white ${isDone ? 'line-through text-slate-400' : ''}">${item.title}</h4>
                  <p class="text-xs text-slate-300 leading-relaxed max-w-3xl">${item.description || ''}</p>
                </div>
              </div>

              <!-- Item Actions -->
              <div class="flex items-center gap-2 self-end sm:self-start">
                <button class="btn-edit-timeline p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition" data-id="${item.id}" title="Edit Item">
                  ✏
                </button>
                <button class="btn-delete-timeline p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 text-xs transition" data-id="${item.id}" title="Delete Item">
                  🗑
                </button>
              </div>

            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
}
