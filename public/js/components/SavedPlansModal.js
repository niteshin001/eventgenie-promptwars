/**
 * EventGenie AI - Saved Plans Modal Component
 */

import { formatCurrency } from '../utils/calculations.js';

export function renderSavedPlansModal(state) {
  if (!state.isSavedPlansOpen) return '';

  const plans = state.savedPlans || [];

  return `
    <div id="saved-modal-backdrop" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 space-y-6 max-h-[90vh] flex flex-col">
        
        <div class="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 class="text-xl font-bold font-heading text-white">My Saved Celebrations</h3>
            <p class="text-xs text-slate-400 mt-0.5">Persisted in local browser storage & SQLite database</p>
          </div>
          <button id="btn-close-saved-modal" class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition">
            ✕
          </button>
        </div>

        <div class="flex-1 overflow-y-auto space-y-3 pr-1">
          ${plans.length === 0 ? `
            <div class="p-10 text-center text-slate-400 text-xs">
              No saved event plans found. Click <strong>"Plan Event"</strong> or <strong>"Try Demo"</strong> to get started.
            </div>
          ` : plans.map(p => `
            <div class="p-4 rounded-2xl glass-card border border-white/10 flex items-center justify-between gap-4 transition hover:border-violet-500/40" data-id="${p.id}">
              <div>
                <div class="text-[10px] font-bold text-violet-400 uppercase tracking-wider">${p.occasion || 'Event'}</div>
                <h4 class="text-sm font-bold text-white font-heading mt-0.5">${p.title}</h4>
                <div class="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>📍 ${p.city || 'TBD'}</span>
                  <span>👥 ${p.guests || 100} Guests</span>
                  <span class="text-amber-400 font-semibold">${formatCurrency(p.budget, p.currency)}</span>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button class="btn-load-saved-plan px-4 py-2 rounded-xl text-xs font-semibold gradient-accent-button text-white shadow transition" data-id="${p.id}">
                  Open
                </button>
                <button class="btn-delete-saved-plan p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 text-xs transition" data-id="${p.id}" title="Delete">
                  🗑
                </button>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    </div>
  `;
}
