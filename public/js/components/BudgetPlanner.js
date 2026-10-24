/**
 * EventGenie AI - Smart Budget Planner Component
 * Fully deterministic calculations with interactive editing, visual progress bars,
 * and over-budget guardrails.
 */

import { formatCurrency, calculateBudgetMetrics } from '../utils/calculations.js';

export function renderBudgetPlanner(event, state) {
  if (!event || !event.budget_breakdown) return '';

  const currency = event.currency || '₹';
  const breakdown = event.budget_breakdown;
  const metrics = calculateBudgetMetrics(breakdown);
  const categories = breakdown.categories || [];

  // Colors for category progress bar segments
  const categoryColors = [
    '#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#06B6D4', '#84CC16', '#6366F1'
  ];

  return `
    <div class="space-y-8" id="budget-planner-section">
      
      <!-- Top Action Bar & Balance Indicator -->
      <div class="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10">
        
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-xs text-violet-300 font-semibold mb-2">
              <span>💰</span> Deterministic Financial Engine
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold font-heading text-white">Smart Budget Planner</h2>
            <p class="text-xs sm:text-sm text-slate-400 mt-1">Itemized cost allocations with instant balance recalculation and contingency buffer.</p>
          </div>

          <!-- Quick Actions -->
          <div class="flex flex-wrap items-center gap-2.5">
            <button id="btn-budget-rebalance" class="px-4 py-2 rounded-xl text-xs font-semibold glass-card text-slate-200 hover:text-white hover:border-violet-500/40 transition flex items-center gap-1.5" title="Normalize category shares to 100%">
              <span>⚖</span> Rebalance to 100%
            </button>
            <button id="btn-budget-reduce-15" class="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition flex items-center gap-1.5" title="Trim 15% budget while protecting hospitality">
              <span>✂</span> Smart -15% Trim
            </button>
            <button id="btn-export-budget-csv-direct" class="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition flex items-center gap-1.5">
              <span>📊</span> Export CSV
            </button>
          </div>
        </div>

        <!-- Over-Budget Alert Banner -->
        ${metrics.isOverBudget ? `
          <div class="mt-6 p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-200 flex items-start gap-3.5 animate-pulse">
            <span class="text-xl text-rose-400 font-bold">⚠</span>
            <div>
              <div class="font-bold text-sm text-rose-100">Budget Limit Exceeded by ${formatCurrency(metrics.variance, currency)}!</div>
              <p class="text-xs text-rose-300 mt-0.5">
                Total allocations (${formatCurrency(metrics.totalWithContingency, currency)}) exceed your budget ceiling of ${formatCurrency(metrics.totalBudget, currency)}.
                Click <strong>"Rebalance to 100%"</strong> or manually trim category line items below.
              </p>
            </div>
          </div>
        ` : ''}

        <!-- 4 Metric Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          
          <!-- Total Budget -->
          <div class="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
            <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Planned Budget</div>
            <div class="text-xl sm:text-2xl font-extrabold text-white font-heading">${formatCurrency(metrics.totalBudget, currency)}</div>
            <div class="text-[10px] text-slate-500">100.0% Overall Cap</div>
          </div>

          <!-- Allocated Expenses -->
          <div class="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
            <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Allocated (8 Categories)</div>
            <div class="text-xl sm:text-2xl font-extrabold text-violet-300 font-heading">${formatCurrency(metrics.allocatedSum, currency)}</div>
            <div class="text-[10px] text-violet-400/80">${((metrics.allocatedSum / (metrics.totalBudget || 1)) * 100).toFixed(1)}% of budget</div>
          </div>

          <!-- Emergency Contingency -->
          <div class="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
            <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Emergency Reserve</div>
            <div class="text-xl sm:text-2xl font-extrabold text-emerald-400 font-heading">${formatCurrency(metrics.contingencyAmount, currency)}</div>
            <div class="text-[10px] text-emerald-500/80">${metrics.contingencyPercent}% Reserved for Contingency</div>
          </div>

          <!-- Remaining Balance -->
          <div class="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
            <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Remaining Balance</div>
            <div class="text-xl sm:text-2xl font-extrabold ${metrics.isOverBudget ? 'text-rose-400' : 'text-emerald-400'} font-heading">
              ${formatCurrency(metrics.remainingBalance, currency)}
            </div>
            <div class="text-[10px] ${metrics.isOverBudget ? 'text-rose-400' : 'text-slate-500'}">
              ${metrics.isOverBudget ? 'Over Budget' : 'Balanced & Safe'}
            </div>
          </div>

        </div>

        <!-- Proportional Stacked Bar -->
        <div class="mt-6 pt-4 border-t border-white/5 space-y-2">
          <div class="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Proportional Allocation Breakdown:</span>
            <span>Allocated: ${((metrics.totalWithContingency / (metrics.totalBudget || 1)) * 100).toFixed(1)}%</span>
          </div>

          <div class="h-4 w-full rounded-full bg-slate-900 overflow-hidden flex shadow-inner border border-white/10">
            ${categories.map((cat, idx) => {
              const widthPct = (cat.allocated / (metrics.totalBudget || 1)) * 100;
              const col = categoryColors[idx % categoryColors.length];
              return `
                <div class="h-full transition-all duration-300 group relative" style="width: ${widthPct}%; background-color: ${col};" title="${cat.name}: ${formatCurrency(cat.allocated, currency)} (${cat.percentage}%)"></div>
              `;
            }).join('')}
            <!-- Contingency bar segment -->
            <div class="h-full bg-emerald-500 transition-all duration-300" style="width: ${(metrics.contingencyAmount / (metrics.totalBudget || 1)) * 100}%;" title="Contingency Reserve: ${formatCurrency(metrics.contingencyAmount, currency)}"></div>
          </div>

          <!-- Color Legend -->
          <div class="flex flex-wrap gap-3 pt-2 text-[11px] text-slate-400">
            ${categories.map((cat, idx) => `
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${categoryColors[idx % categoryColors.length]};"></span>
                <span>${cat.name} (${cat.percentage}%)</span>
              </div>
            `).join('')}
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span class="text-emerald-400">Contingency (${metrics.contingencyPercent}%)</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Category Item Cards (Interactive Editor) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        ${categories.map((cat, catIdx) => `
          <div class="glass-card rounded-2xl p-5 border border-white/10 space-y-4" data-cat-id="${cat.id}">
            
            <!-- Category Header -->
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-base font-bold font-heading text-white flex items-center gap-2">
                  <span>${cat.name}</span>
                </h3>
                <p class="text-xs text-slate-400 mt-0.5">${cat.notes || 'Allocated services'}</p>
              </div>

              <div class="text-right">
                <div class="text-lg font-extrabold text-amber-300 font-heading">${formatCurrency(cat.allocated, currency)}</div>
                <div class="text-[11px] text-slate-400 font-semibold">${cat.percentage}% of total</div>
              </div>
            </div>

            <!-- Line Items Table -->
            <div class="space-y-2 pt-2 border-t border-white/5">
              ${(cat.items || []).map((item, itemIdx) => `
                <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-200">
                  <div class="flex-1 mr-3">
                    <span class="font-medium text-white">${item.name}</span>
                    <span class="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">${item.status || 'Estimate'}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <input type="number" step="100" min="0" value="${item.amount}" class="budget-item-input w-24 px-2 py-1 rounded-lg bg-slate-800 border border-white/10 text-right text-xs font-semibold text-white focus:border-violet-500 focus:outline-none" data-cat-idx="${catIdx}" data-item-idx="${itemIdx}" />
                    <span class="text-slate-400 text-[11px]">${currency}</span>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Category Footer Action -->
            <div class="pt-2 flex justify-between items-center text-[11px]">
              <button class="btn-add-budget-item text-violet-400 hover:text-violet-300 font-semibold transition" data-cat-idx="${catIdx}">
                + Add Custom Expense
              </button>
              <span class="text-slate-500">Auto-saved to plan</span>
            </div>

          </div>
        `).join('')}
      </div>

    </div>
  `;
}
