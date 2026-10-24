/**
 * EventGenie AI - Settings & API Key Configuration Modal
 */

export function renderSettingsModal(state) {
  if (!state.isSettingsOpen) return '';

  const isConfigured = state.aiConfigured;

  return `
    <div id="settings-modal-backdrop" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 space-y-6">
        
        <div class="flex items-center justify-between pb-4 border-b border-white/10">
          <div class="flex items-center gap-3">
            <span class="text-2xl">⚙</span>
            <div>
              <h3 class="text-xl font-bold font-heading text-white">GenAI Settings</h3>
              <p class="text-xs text-slate-400 mt-0.5">Google Gemini API & Runtime Mode</p>
            </div>
          </div>
          <button id="btn-close-settings" class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition">
            ✕
          </button>
        </div>

        <div class="space-y-4">
          <!-- Status Banner -->
          <div class="p-4 rounded-2xl ${isConfigured ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-200' : 'bg-amber-950/40 border border-amber-500/30 text-amber-200'} text-xs space-y-1">
            <div class="flex items-center gap-2 font-bold">
              <span class="w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-400' : 'bg-amber-400'}"></span>
              <span>${isConfigured ? 'Google Gemini Live AI Connected' : 'Running in Smart Demo Mode'}</span>
            </div>
            <p class="text-slate-300">
              ${isConfigured 
                ? 'Your Gemini API key is securely loaded on the server. Prompts and creative concepts are generated live.'
                : 'No API key needed! The deterministic smart planner engine provides full interactive event blueprints.'}
            </p>
          </div>

          <!-- API Key Form -->
          <form id="api-key-form" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Configure Google Gemini API Key</label>
              <input type="password" id="inp-gemini-key" placeholder="AIzaSy..." class="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs font-mono focus:border-violet-500 focus:outline-none transition" />
              <p class="text-[10px] text-slate-500 mt-1.5">
                Key is sent securely to the local server session only. Never stored in client-side code or committed.
              </p>
            </div>

            <div class="flex items-center gap-3 pt-2">
              <button type="submit" class="flex-1 py-3 rounded-xl text-xs font-bold gradient-accent-button text-white shadow-md transition">
                Save & Activate Gemini
              </button>
              ${isConfigured ? `
                <button type="button" id="btn-clear-api-key" class="px-4 py-3 rounded-xl text-xs font-semibold glass-card text-rose-300 hover:text-white transition">
                  Clear Key
                </button>
              ` : ''}
            </div>
          </form>

        </div>

      </div>
    </div>
  `;
}
