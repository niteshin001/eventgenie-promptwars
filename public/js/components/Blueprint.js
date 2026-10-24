/**
 * EventGenie AI - Master Event Blueprint Component
 * Orchestrates Overview, Budget, Timeline, Checklist, Vendors, Ideas, and Contingencies.
 */

import { formatCurrency } from '../utils/calculations.js';
import { renderBudgetPlanner } from './BudgetPlanner.js';
import { renderTimeline } from './Timeline.js';
import { renderChecklist } from './Checklist.js';
import { renderVendorGuide } from './VendorGuide.js';
import { renderCreativeIdeas } from './CreativeIdeas.js';
import { renderContingency } from './Contingency.js';

export function renderBlueprint(event, state) {
  if (!event) return '';

  const activeTab = state.blueprintTab || 'overview';
  const currency = event.currency || '₹';
  const isAi = event.is_ai_generated;
  const modeLabel = event.generator_mode || (isAi ? 'Google Gemini AI' : 'Smart Deterministic Engine');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '✦' },
    { id: 'budget', label: 'Budget Planner', icon: '💰' },
    { id: 'timeline', label: 'Timeline & Schedule', icon: '⏰' },
    { id: 'checklist', label: 'Checklist', icon: '📋' },
    { id: 'vendors', label: 'Vendor Guide', icon: '🤝' },
    { id: 'ideas', label: 'Creative Ideas', icon: '🎨' },
    { id: 'contingency', label: 'Contingency Plan', icon: '🛡' }
  ];

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in" id="blueprint-root">
      
      <!-- Blueprint Banner / Hero Header -->
      <div class="relative glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl border border-violet-500/20 overflow-hidden">
        
        <div class="ambient-glow-violet -top-32 -left-32"></div>

        <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
          
          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-2.5">
              <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30">
                ${event.occasion}
              </span>
              <span class="px-3 py-1 rounded-full text-xs font-semibold ${isAi ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}">
                ${modeLabel}
              </span>
              <span class="text-xs text-slate-400">ID: ${event.id}</span>
            </div>

            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight">
              ${event.title}
            </h1>

            <p class="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              ${event.overview?.concept || 'A complete, balanced celebration blueprint.'}
            </p>
          </div>

          <!-- Top Action Buttons -->
          <div class="flex flex-wrap items-center gap-2.5 self-start lg:self-center shrink-0">
            <button id="blueprint-btn-print" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold glass-card text-white hover:border-violet-400/50 transition flex items-center gap-2">
              <span>🖨</span>
              <span>Print / PDF</span>
            </button>
            <button id="blueprint-btn-share" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold glass-card text-white hover:border-violet-400/50 transition flex items-center gap-2">
              <span>📋</span>
              <span>Share Summary</span>
            </button>
            <button id="blueprint-btn-copilot" class="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold gradient-accent-button text-white shadow-lg shadow-violet-600/30 transition flex items-center gap-2">
              <span>✨</span>
              <span>Ask Copilot</span>
            </button>
          </div>

        </div>

        <!-- Metric Badges Row -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div class="p-4 rounded-2xl bg-slate-900/60 border border-white/5">
            <div class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">City & Venue</div>
            <div class="text-sm font-bold text-white mt-1 truncate">${event.venue}, ${event.city}</div>
            <div class="text-[10px] text-slate-500 mt-0.5">${event.indoor_outdoor || 'Hybrid'}</div>
          </div>

          <div class="p-4 rounded-2xl bg-slate-900/60 border border-white/5">
            <div class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Date & Schedule</div>
            <div class="text-sm font-bold text-white mt-1">${event.date}</div>
            <div class="text-[10px] text-slate-500 mt-0.5">${event.start_time} (${event.duration || 6} Hours)</div>
          </div>

          <div class="p-4 rounded-2xl bg-slate-900/60 border border-white/5">
            <div class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Headcount</div>
            <div class="text-sm font-bold text-white mt-1">${event.guests} Attendees</div>
            <div class="text-[10px] text-slate-500 mt-0.5">${event.vibe || 'Curated Crowd'}</div>
          </div>

          <div class="p-4 rounded-2xl bg-slate-900/60 border border-white/5">
            <div class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Budget Balance</div>
            <div class="text-sm font-bold text-amber-400 mt-1">${formatCurrency(event.budget, currency)}</div>
            <div class="text-[10px] text-emerald-400 mt-0.5">${event.contingency_percent}% Contingency Buffer</div>
          </div>
        </div>

      </div>

      <!-- Tab Navigation Bar -->
      <div class="glass-panel rounded-2xl p-2 border border-white/10 flex items-center gap-1.5 overflow-x-auto shadow-lg">
        ${tabs.map(tab => `
          <button class="blueprint-tab-btn px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === tab.id
              ? 'gradient-accent-button text-white shadow-md shadow-violet-600/30'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }" data-tab="${tab.id}">
            <span>${tab.icon}</span>
            <span>${tab.label}</span>
          </button>
        `).join('')}
      </div>

      <!-- Active Tab Content Area -->
      <div class="mt-6">
        ${activeTab === 'overview' ? renderOverviewTab(event) : ''}
        ${activeTab === 'budget' ? renderBudgetPlanner(event, state) : ''}
        ${activeTab === 'timeline' ? renderTimeline(event, state) : ''}
        ${activeTab === 'checklist' ? renderChecklist(event, state) : ''}
        ${activeTab === 'vendors' ? renderVendorGuide(event, state) : ''}
        ${activeTab === 'ideas' ? renderCreativeIdeas(event) : ''}
        ${activeTab === 'contingency' ? renderContingency(event) : ''}
      </div>

    </div>
  `;
}

function renderOverviewTab(event) {
  const colors = event.color_palette || [];
  const atmosphere = event.overview?.atmosphere || [];
  const assumptions = event.overview?.planning_assumptions || [];

  return `
    <div class="space-y-8">
      
      <!-- Theme & Atmosphere Card -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Left: Styling & Colors -->
        <div class="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div>
            <div class="text-xs font-bold text-violet-400 uppercase tracking-wider">Styling & Aesthetic Direction</div>
            <h3 class="text-xl sm:text-2xl font-bold font-heading text-white mt-1">${event.theme || 'Bespoke Celebration'}</h3>
          </div>

          <!-- Color Palette Swatches -->
          <div class="space-y-2">
            <div class="text-xs font-semibold text-slate-300">Curated Color Harmony:</div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              ${colors.map(c => `
                <div class="p-3 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl shadow-md border border-white/10 shrink-0" style="background-color: ${c.hex};"></div>
                  <div>
                    <div class="text-xs font-bold text-white">${c.name}</div>
                    <div class="text-[10px] text-slate-400 font-mono">${c.hex}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Atmosphere Tags -->
          <div class="space-y-2 pt-2 border-t border-white/5">
            <div class="text-xs font-semibold text-slate-300">Atmosphere & Mood Signals:</div>
            <div class="flex flex-wrap gap-2">
              ${atmosphere.map(tag => `
                <span class="px-3 py-1 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-300">
                  ✦ ${tag}
                </span>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Right: Planning Assumptions & Guardrails -->
        <div class="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5">
          <div>
            <div class="text-xs font-bold text-amber-400 uppercase tracking-wider">Planning Assumptions</div>
            <h3 class="text-xl font-bold font-heading text-white mt-1">Foundational Guardrails</h3>
          </div>

          <div class="space-y-3">
            ${assumptions.map((ass, i) => `
              <div class="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-300 flex items-start gap-3">
                <span class="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  ${i + 1}
                </span>
                <span>${ass}</span>
              </div>
            `).join('')}
          </div>

          ${event.special_requests ? `
            <div class="p-3.5 rounded-xl bg-violet-950/30 border border-violet-500/20 text-xs text-violet-200">
              <strong class="font-bold text-white">Organizer Special Requests:</strong>
              <p class="mt-1 text-slate-300">${event.special_requests}</p>
            </div>
          ` : ''}
        </div>

      </div>

    </div>
  `;
}
