/**
 * EventGenie AI - Vendor Planning & Negotiation Guide Component
 * Clear disclaimers, negotiation questions, criteria matrix, and booking status toggles.
 */

import { formatCurrency } from '../utils/calculations.js';

export function renderVendorGuide(event, state) {
  if (!event) return '';

  const vendors = event.vendors || [];
  const currency = event.currency || '₹';

  return `
    <div class="space-y-6" id="vendors-section">
      
      <!-- Vendor Header -->
      <div class="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-xs text-violet-300 font-semibold mb-2">
              <span>🤝</span> Vendor Procurement & Negotiation
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold font-heading text-white">Vendor Planning Guide</h2>
            <p class="text-xs sm:text-sm text-slate-400 mt-1">Suggested vendor roles, mandatory interview questions, and evaluation criteria.</p>
          </div>
        </div>

        <!-- Mandatory Disclaimer Notice -->
        <div class="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
          <span class="text-base text-amber-400">ℹ</span>
          <div>
            <strong class="font-bold text-amber-100">Algorithmic Suggestion Notice:</strong>
            <p class="text-slate-300 mt-0.5">
              All vendor titles, role descriptions, and price allowances are algorithmic estimates for planning purposes.
              EventGenie AI does not verify third-party real-time availability, nor claim any vendor has been contracted or booked.
            </p>
          </div>
        </div>
      </div>

      <!-- Vendor Cards Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        ${vendors.map((v, idx) => {
          const statusColors = {
            'Researching': 'bg-slate-700/50 text-slate-300 border-slate-600',
            'Shortlisted': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
            'Negotiating': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
            'Contacted': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
            'Booked': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
          };
          const badgeClass = statusColors[v.status] || statusColors['Researching'];

          return `
            <div class="glass-card rounded-2xl p-6 border border-white/10 space-y-5" data-idx="${idx}">
              
              <!-- Card Top -->
              <div class="flex items-start justify-between">
                <div>
                  <div class="text-[11px] font-bold text-violet-400 uppercase tracking-wider">${v.category}</div>
                  <h3 class="text-lg font-bold font-heading text-white mt-0.5">${v.sample_name || v.category}</h3>
                  <p class="text-xs text-slate-300 mt-1">${v.suggested_role || 'Primary service provider'}</p>
                </div>

                <!-- Status Selector -->
                <div class="text-right">
                  <select class="vendor-status-select px-3 py-1.5 rounded-xl text-xs font-semibold border ${badgeClass} bg-slate-900 focus:outline-none cursor-pointer" data-idx="${idx}">
                    ${['Researching', 'Shortlisted', 'Negotiating', 'Contacted', 'Booked'].map(st => `
                      <option value="${st}" ${v.status === st ? 'selected' : ''}>${st}</option>
                    `).join('')}
                  </select>
                  <div class="text-[11px] text-amber-400 font-bold mt-2 font-heading">
                    Budget Est: ${formatCurrency(v.estimated_budget, currency)}
                  </div>
                </div>
              </div>

              <!-- Mandatory Questions to Ask -->
              <div class="space-y-2 pt-2 border-t border-white/5">
                <div class="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <span>❓</span>
                  <span>Key Questions to Ask Before Signing:</span>
                </div>
                <ul class="space-y-1.5 text-xs text-slate-300">
                  ${(v.questions_to_ask || []).map(q => `
                    <li class="flex items-start gap-2 bg-slate-900/50 p-2 rounded-lg">
                      <span class="text-violet-400 font-bold">•</span>
                      <span>${q}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>

              <!-- Comparison Criteria -->
              <div class="space-y-2 pt-2 border-t border-white/5">
                <div class="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <span>⚖</span>
                  <span>Comparison Matrix:</span>
                </div>
                <div class="flex flex-wrap gap-1.5">
                  ${(v.comparison_criteria || []).map(c => `
                    <span class="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] text-slate-300 border border-white/5">
                      ✓ ${c}
                    </span>
                  `).join('')}
                </div>
              </div>

            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
}
