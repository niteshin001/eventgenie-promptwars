/**
 * EventGenie AI - Navigation Bar Component
 */

export function renderNavbar(state, handlers) {
  const isAiConfigured = state.aiConfigured;
  const activePlan = state.activePlan;
  const savedCount = state.savedPlans?.length || 0;

  return `
    <nav class="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 lg:px-8 py-3.5 transition-all">
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        <!-- Brand Logo -->
        <div class="flex items-center gap-3 cursor-pointer select-none" id="nav-brand">
          <div class="w-10 h-10 rounded-xl gradient-accent-button flex items-center justify-center shadow-lg shadow-violet-500/20 text-white font-bold text-xl">
            ✨
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xl font-extrabold tracking-tight font-heading text-white">EventGenie</span>
              <span class="text-xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30">AI</span>
            </div>
            <p class="text-[11px] text-slate-400 font-medium hidden sm:block">Your Celebration, Perfectly Planned</p>
          </div>
        </div>

        <!-- Center Actions / Current Event Pill -->
        <div class="hidden md:flex items-center gap-2">
          ${activePlan ? `
            <div class="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-violet-500/30 text-xs font-medium text-slate-200">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="font-semibold text-white max-w-[200px] truncate">${activePlan.title}</span>
              <span class="text-slate-400">(${activePlan.occasion})</span>
            </div>
          ` : `
            <div class="text-xs text-slate-400 px-3 py-1 rounded-full bg-slate-900/40 border border-white/5">
              Ready to plan your next milestone celebration
            </div>
          `}
        </div>

        <!-- Right Controls -->
        <div class="flex items-center gap-2 sm:gap-3">
          
          <!-- Try Demo Quick Button -->
          <button id="btn-try-demo" class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-violet-500/15 hover:bg-violet-500/25 text-violet-200 border border-violet-500/30 transition flex items-center gap-1.5">
            <span class="text-amber-400">⚡</span>
            <span>Campus Carnival 2026</span>
          </button>

          <!-- Plan New Event -->
          <button id="btn-new-event" class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold gradient-accent-button text-white shadow-md flex items-center gap-1.5">
            <span>+</span>
            <span class="hidden sm:inline">Plan Event</span>
          </button>

          <!-- Saved Plans Drawer -->
          <button id="btn-saved-plans" class="px-3 py-2 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-750 text-slate-200 border border-white/10 transition flex items-center gap-1.5" title="Saved Celebrations">
            <span>📁</span>
            <span class="hidden lg:inline">Saved</span>
            <span class="px-1.5 py-0.2 rounded-full bg-slate-700 text-[10px] text-slate-300 font-bold">${savedCount}</span>
          </button>

          <!-- Export Dropdown -->
          ${activePlan ? `
            <div class="relative group">
              <button id="btn-export-toggle" class="px-3 py-2 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-750 text-slate-200 border border-white/10 transition flex items-center gap-1.5">
                <span>⬇</span>
                <span class="hidden sm:inline">Export</span>
              </button>
              <div class="absolute right-0 mt-2 w-48 rounded-xl glass-panel shadow-2xl border border-white/10 py-1.5 hidden group-hover:block z-50">
                <button id="btn-export-csv" class="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-violet-500/20 flex items-center gap-2.5">
                  <span>📊</span> Download Budget CSV
                </button>
                <button id="btn-export-print" class="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-violet-500/20 flex items-center gap-2.5">
                  <span>🖨</span> Print / PDF Export
                </button>
                <button id="btn-export-copy" class="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-violet-500/20 flex items-center gap-2.5">
                  <span>📋</span> Copy Shareable Summary
                </button>
              </div>
            </div>
          ` : ''}

          <!-- AI Status / API Key Modal -->
          <button id="btn-ai-settings" class="p-2 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-750 border border-white/10 transition flex items-center gap-1.5" title="AI Configuration & Settings">
            <span class="w-2 h-2 rounded-full ${isAiConfigured ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-amber-400'}"></span>
            <span class="hidden xl:inline text-[11px] ${isAiConfigured ? 'text-emerald-300' : 'text-amber-300'} font-semibold">
              ${isAiConfigured ? 'Gemini AI Active' : 'Demo Mode'}
            </span>
          </button>

        </div>
      </div>
    </nav>
  `;
}
