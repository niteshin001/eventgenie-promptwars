/**
 * EventGenie AI - Preparation Checklist Component
 * Actionable tasks across deadlines, category filters, and live completion tracking.
 */

export function renderChecklist(event, state) {
  if (!event) return '';

  const checklist = event.checklist || [];
  const filter = state.checklistFilter || 'All';
  const categoryFilter = state.checklistCategoryFilter || 'All';

  // Completion calculation
  const totalTasks = checklist.length;
  const completedTasks = checklist.filter(t => t.completed).length;
  const percentComplete = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter items
  const filtered = checklist.filter(task => {
    if (filter === 'Pending' && task.completed) return false;
    if (filter === 'Completed' && !task.completed) return false;
    if (categoryFilter !== 'All' && task.category !== categoryFilter) return false;
    return true;
  });

  const categories = ['All', ...new Set(checklist.map(t => t.category).filter(Boolean))];

  return `
    <div class="space-y-6" id="checklist-section">
      
      <!-- Progress Bar Card -->
      <div class="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10 space-y-6">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-xs text-violet-300 font-semibold mb-2">
              <span>📋</span> Milestone Preparation Tracker
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold font-heading text-white">Event Checklist</h2>
            <p class="text-xs sm:text-sm text-slate-400 mt-1">Essential deadlines, legal clearances, and vendor milestones.</p>
          </div>

          <button id="btn-add-task" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold gradient-accent-button text-white shadow-md flex items-center gap-2 transition">
            <span>+</span>
            <span>Add Custom Task</span>
          </button>
        </div>

        <!-- Completion Progress Gauge -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs font-semibold">
            <span class="text-slate-300">Overall Readiness Progress</span>
            <span class="text-violet-300 font-bold">${completedTasks} of ${totalTasks} Completed (${percentComplete}%)</span>
          </div>
          <div class="h-3 w-full rounded-full bg-slate-900 overflow-hidden border border-white/5">
            <div class="h-full bg-gradient-to-r from-violet-500 via-pink-500 to-emerald-400 transition-all duration-500 rounded-full" style="width: ${percentComplete}%"></div>
          </div>
        </div>

        <!-- Filter Controls -->
        <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
          <!-- Status Tabs -->
          <div class="flex items-center gap-2">
            ${['All', 'Pending', 'Completed'].map(tab => `
              <button class="checklist-tab-btn px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filter === tab ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30' : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
              }" data-filter="${tab}">
                ${tab}
              </button>
            `).join('')}
          </div>

          <!-- Category Filter -->
          <div class="flex items-center gap-2 text-xs text-slate-400">
            <span class="hidden sm:inline">Category:</span>
            <select id="checklist-cat-select" class="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs focus:border-violet-500 focus:outline-none">
              ${categories.map(c => `<option value="${c}" ${categoryFilter === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
        </div>

      </div>

      <!-- Checklist Task Rows -->
      <div class="space-y-3">
        ${filtered.length === 0 ? `
          <div class="glass-card rounded-2xl p-12 text-center text-slate-400 text-sm">
            No tasks found matching your filter selection.
          </div>
        ` : filtered.map(item => {
          const isDone = item.completed;
          const priorityColor = item.priority === 'Urgent' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                                item.priority === 'High' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                                item.priority === 'Medium' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                                'bg-slate-700/40 text-slate-300 border-slate-600';

          return `
            <div class="checklist-row glass-card rounded-2xl p-4 sm:p-5 border border-white/10 flex items-center justify-between gap-4 transition hover:border-violet-500/30 ${
              isDone ? 'opacity-65 bg-slate-950/40' : ''
            }" data-id="${item.id}">
              
              <div class="flex items-center gap-4">
                <input type="checkbox" class="task-checkbox custom-checkbox w-5 h-5 rounded-lg border border-white/20 bg-slate-900 cursor-pointer accent-violet-600 transition" ${isDone ? 'checked' : ''} data-id="${item.id}" />
                
                <div>
                  <div class="flex flex-wrap items-center gap-2 mb-1">
                    <span class="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${priorityColor}">
                      ${item.priority || 'Medium'}
                    </span>
                    <span class="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      ${item.category || 'General'}
                    </span>
                    <span class="text-xs text-slate-400">
                      📅 ${item.deadline || 'Suggested Deadline'}
                    </span>
                  </div>
                  
                  <div class="text-sm font-bold text-white ${isDone ? 'line-through text-slate-400' : ''}">
                    ${item.task}
                  </div>
                </div>
              </div>

              <!-- Delete Button -->
              <button class="btn-delete-task p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 text-xs transition" data-id="${item.id}" title="Delete Task">
                🗑
              </button>

            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
}
