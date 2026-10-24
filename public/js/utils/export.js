/**
 * EventGenie AI - Export Utilities (CSV, Printable PDF, Shareable Text)
 */

import { formatCurrency } from './calculations.js';

export function exportBudgetCSV(event) {
  if (!event || !event.budget_breakdown) {
    alert("No active budget data available to export.");
    return;
  }

  const currency = event.currency || '₹';
  const breakdown = event.budget_breakdown;
  const categories = breakdown.categories || [];

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += `EventGenie AI - Budget Summary for "${event.title || 'Event'}"\n`;
  csvContent += `Occasion,${event.occasion || 'General'}\n`;
  csvContent += `Total Budget,${event.budget || 0} ${currency}\n`;
  csvContent += `Emergency Contingency Reserve (${breakdown.contingency_percent || 10}%),${breakdown.contingency_amount || 0} ${currency}\n\n`;
  
  // Headers
  csvContent += "Category,Line Item,Estimated Amount,Percentage Share,Status\n";

  categories.forEach(cat => {
    if (cat.items && cat.items.length > 0) {
      cat.items.forEach(item => {
        csvContent += `"${cat.name}","${item.name}",${item.amount},${cat.percentage}%,"${item.status || 'Estimated'}"\n`;
      });
    } else {
      csvContent += `"${cat.name}","Total Allocation",${cat.allocated},${cat.percentage}%,"Estimated"\n`;
    }
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  const filename = `${(event.title || 'event').toLowerCase().replace(/[^a-z0-9]/g, '_')}_budget.csv`;
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportPrintablePlan() {
  window.print();
}

export function copyShareableSummary(event) {
  if (!event) return;

  const currency = event.currency || '₹';
  const total = formatCurrency(event.budget, currency);
  const date = event.date || 'TBD';
  const time = event.start_time || '11:00 AM';
  const guests = event.guests || 100;
  const city = event.city || 'TBD';
  const venue = event.venue || 'TBD';

  const text = `🎉 *${event.title}*
📅 Date: ${date} at ${time}
📍 Venue: ${venue}, ${city}
👥 Guests: ${guests} Attendees
💰 Budget: ${total} (${currency})
🎨 Theme: ${event.theme || 'Bespoke Celebration'}

🌟 *Event Concept:*
${event.overview?.concept || 'An expertly coordinated celebration.'}

⏰ *Key Schedule Highlights:*
${(event.timeline || []).slice(0, 5).map(t => `• ${t.time}: ${t.title}`).join('\n')}

✨ Planned with EventGenie AI — Your Celebration, Perfectly Planned.`;

  navigator.clipboard.writeText(text).then(() => {
    showToast("Shareable event summary copied to clipboard!", "success");
  }).catch(() => {
    showToast("Failed to copy summary to clipboard.", "error");
  });
}

export function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bgClass = type === 'success' ? 'bg-emerald-600/95 text-white' : 
                  type === 'error' ? 'bg-rose-600/95 text-white' : 
                  'bg-violet-600/95 text-white';

  toast.className = `${bgClass} backdrop-blur-md px-4 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-3 transition-all duration-300 transform translate-y-3 opacity-0 pointer-events-auto border border-white/10`;
  toast.innerHTML = `
    <span class="text-base">${type === 'success' ? '✓' : type === 'error' ? '⚠' : '✦'}</span>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-y-3', 'opacity-0');
  }, 10);

  // Animate out & remove
  setTimeout(() => {
    toast.classList.add('translate-y-3', 'opacity-0');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}
