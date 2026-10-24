/**
 * EventGenie AI - AI Planning Copilot Drawer
 * Real-time event context, prompt chips, change proposal diff previews with accept/reject,
 * and conversational interface.
 */

export function renderCopilotDrawer(state) {
  const isOpen = state.isCopilotOpen || false;
  const messages = state.copilotMessages || [];
  const isLoading = state.copilotLoading || false;
  const pendingProposal = state.copilotProposal;

  const quickChips = [
    "Reduce my budget by 15% without losing the main experience.",
    "Make this event more elegant.",
    "Create a rainy-day backup plan.",
    "Add activities for college students.",
    "What should I complete this week?"
  ];

  if (!isOpen) {
    return `
      <!-- Floating Copilot Launcher Pill -->
      <button id="btn-open-copilot" class="floating-cta fixed bottom-6 right-6 z-40 px-5 py-3.5 rounded-full gradient-accent-button text-white font-bold text-sm shadow-2xl shadow-violet-600/40 hover:scale-105 transition flex items-center gap-2.5">
        <span class="text-lg">✨</span>
        <span>AI Planning Copilot</span>
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      </button>
    `;
  }

  return `
    <div id="copilot-drawer-backdrop" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end transition-opacity">
      <div id="copilot-panel" class="w-full max-w-lg h-full glass-panel border-l border-white/10 flex flex-col justify-between shadow-2xl relative animate-slide-left">
        
        <!-- Header -->
        <div class="p-5 border-b border-white/10 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl gradient-accent-button flex items-center justify-center text-white font-bold text-base shadow-md">
              ✨
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-bold font-heading text-white">EventGenie Copilot</h3>
                <span class="text-[10px] px-2 py-0.5 rounded-full font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">Contextual</span>
              </div>
              <p class="text-[11px] text-slate-400">Aware of your active celebration plan</p>
            </div>
          </div>

          <button id="btn-close-copilot" class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition" title="Close Copilot">
            ✕
          </button>
        </div>

        <!-- Chat History -->
        <div id="copilot-messages-container" class="flex-1 overflow-y-auto p-5 space-y-4">
          
          <!-- System Welcome Message -->
          <div class="p-4 rounded-2xl bg-violet-950/30 border border-violet-500/20 text-xs text-slate-300 space-y-2">
            <div class="font-bold text-violet-300 flex items-center gap-1.5">
              <span>✦</span>
              <span>Contextual Event Co-Planner</span>
            </div>
            <p>
              I am analyzing your event plan. Ask me to recalculate budgets, craft bad-weather contingency protocols, or suggest entertainment ideas!
            </p>
          </div>

          <!-- Message History -->
          ${messages.map((m, idx) => `
            <div class="flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} space-y-1">
              <div class="text-[10px] text-slate-500 px-1 font-semibold">${m.role === 'user' ? 'You' : (m.source || 'EventGenie AI')}</div>
              <div class="max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                m.role === 'user' ? 'bg-violet-600 text-white rounded-tr-none' : 'glass-card border border-white/10 text-slate-200 rounded-tl-none space-y-2'
              }">
                <div class="whitespace-pre-line">${m.text}</div>
              </div>
            </div>
          `).join('')}

          <!-- Proposal Preview Card (If Pending) -->
          ${pendingProposal ? `
            <div class="p-4 rounded-2xl bg-violet-900/40 border border-violet-500/40 space-y-3 animate-pulse-subtle">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-violet-200 flex items-center gap-1.5">
                  <span>⚖</span> Actionable Change Proposal
                </span>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/30 text-white font-bold">Review Required</span>
              </div>
              
              <div class="text-xs text-white font-semibold">
                ${pendingProposal.summary}
              </div>

              <div class="flex items-center gap-2 pt-1">
                <button id="btn-apply-proposal" class="flex-1 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition flex items-center justify-center gap-1.5">
                  <span>✓</span> Apply Changes to Plan
                </button>
                <button id="btn-reject-proposal" class="px-3 py-2 rounded-xl text-xs font-semibold glass-card text-slate-300 hover:text-white transition">
                  Dismiss
                </button>
              </div>
            </div>
          ` : ''}

          <!-- Loading Indicator -->
          ${isLoading ? `
            <div class="flex items-center gap-2.5 p-3 rounded-2xl glass-card border border-white/10 max-w-[70%]">
              <span class="w-2 h-2 rounded-full bg-violet-400 animate-ping"></span>
              <span class="text-xs text-slate-300 font-medium">Copilot is thinking...</span>
            </div>
          ` : ''}

        </div>

        <!-- Prompt Suggestions Strip -->
        <div class="px-5 py-2.5 border-t border-white/5 overflow-x-auto flex gap-2">
          ${quickChips.map(chip => `
            <button class="copilot-chip-btn px-3 py-1.5 rounded-full text-[11px] font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white whitespace-nowrap border border-white/5 transition" data-prompt="${chip}">
              ${chip}
            </button>
          `).join('')}
        </div>

        <!-- Chat Input Form -->
        <form id="copilot-chat-form" class="p-4 border-t border-white/10 flex items-center gap-2.5 bg-slate-950/60">
          <input type="text" id="copilot-input" placeholder="Ask Copilot e.g. Reduce budget by 15%..." class="flex-1 px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs focus:border-violet-500 focus:outline-none transition" autocomplete="off" />
          <button type="submit" class="p-3 rounded-xl gradient-accent-button text-white text-xs font-bold shadow-md hover:scale-105 transition" title="Send Question">
            ➤
          </button>
        </form>

      </div>
    </div>
  `;
}
