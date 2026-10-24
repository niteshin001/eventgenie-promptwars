/**
 * EventGenie AI - Main Application Controller
 * Handles global reactive state, dynamic component rendering, and user interactions.
 */

import * as api from './api.js';
import * as storage from './utils/storage.js';
import * as calc from './utils/calculations.js';
import * as exporter from './utils/export.js';

import { renderNavbar } from './components/Navbar.js';
import { renderHero } from './components/Hero.js';
import { renderSetupWizard } from './components/SetupWizard.js';
import { renderBlueprint } from './components/Blueprint.js';
import { renderCopilotDrawer } from './components/CopilotDrawer.js';
import { renderSavedPlansModal } from './components/SavedPlansModal.js';
import { renderSettingsModal } from './components/SettingsModal.js';

// Global Reactive State
const state = {
  view: 'landing', // 'landing' | 'blueprint'
  isWizardOpen: false,
  wizardStep: 1,
  wizardForm: {
    occasion: 'College fest',
    title: 'Campus Carnival 2026',
    vibe: 'Energetic, Youthful & Immersive',
    indoor_outdoor: 'Outdoor with covered pavilions',
    city: 'Bengaluru',
    venue: 'Campus Amphitheatre & Central Lawns',
    date: '2026-11-14',
    start_time: '10:00',
    duration: 12,
    guests: 250,
    budget: 150000,
    currency: '₹',
    contingency_percent: 10,
    theme: 'Neon Nights: Retro-Futuristic Glow',
    dietary: 'Standard & Vegetarian, Vegan options',
    special_requests: 'Require stage line-array audio, glow-in-the-dark photo booth, student band competition'
  },
  activePlan: null,
  blueprintTab: 'overview',
  timelineFilter: 'All',
  checklistFilter: 'All',
  checklistCategoryFilter: 'All',
  isCopilotOpen: false,
  copilotMessages: [],
  copilotLoading: false,
  copilotProposal: null,
  isSavedPlansOpen: false,
  savedPlans: [],
  isSettingsOpen: false,
  aiConfigured: false
};

// Initialize Application
async function init() {
  // 1. Check Backend Health & GenAI Status
  try {
    const health = await api.getHealth();
    state.aiConfigured = Boolean(health.ai_configured);
  } catch (e) {
    console.warn("Backend health check failed, continuing in demo mode:", e);
  }

  // 2. Load Saved Plans List
  try {
    const serverPlans = await api.listSavedPlans();
    state.savedPlans = serverPlans && serverPlans.length > 0 ? serverPlans : storage.getSavedEventsList();
  } catch (e) {
    state.savedPlans = storage.getSavedEventsList();
  }

  // 3. Check for cached active event or start fresh
  const cached = storage.getActiveEvent();
  if (cached) {
    state.activePlan = cached;
    state.view = 'blueprint';
  }

  render();
}

// Master Render Function
function render() {
  const root = document.getElementById('app-root');
  if (!root) return;

  root.innerHTML = `
    <!-- Top Navigation Bar -->
    ${renderNavbar(state)}

    <!-- Main View Switcher -->
    <main id="main-content" class="min-h-[85vh]">
      ${state.isWizardOpen ? renderSetupWizard(state) : (
        state.view === 'blueprint' && state.activePlan ? renderBlueprint(state.activePlan, state) : renderHero()
      )}
    </main>

    <!-- Contextual Copilot Drawer -->
    ${renderCopilotDrawer(state)}

    <!-- Modals -->
    ${renderSavedPlansModal(state)}
    ${renderSettingsModal(state)}

    <!-- Toast Notification Container -->
    <div id="toast-container" class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none"></div>

    <!-- Print Only Master Container (populated during export) -->
    <div id="print-container" class="hidden"></div>
  `;

  attachEventListeners();
}

// Attach Event Listeners
function attachEventListeners() {
  // Brand Click -> Return to Landing
  const brand = document.getElementById('nav-brand');
  if (brand) {
    brand.onclick = () => {
      state.isWizardOpen = false;
      state.view = 'landing';
      render();
    };
  }

  // "Try Demo" Buttons (Campus Carnival 2026)
  const btnTryDemo = document.getElementById('btn-try-demo');
  const heroBtnDemo = document.getElementById('hero-btn-demo');
  const previewExploreBtn = document.getElementById('preview-explore-btn');

  const loadDemoHandler = async () => {
    try {
      exporter.showToast("Loading Campus Carnival 2026 demo...", "info");
      const demoData = await api.getDemoEvent();
      state.activePlan = demoData;
      state.view = 'blueprint';
      state.isWizardOpen = false;
      state.blueprintTab = 'overview';
      storage.saveActiveEvent(demoData);
      render();
      exporter.showToast("Campus Carnival 2026 demo loaded successfully!", "success");
    } catch (e) {
      exporter.showToast("Failed to load demo event: " + e.message, "error");
    }
  };

  if (btnTryDemo) btnTryDemo.onclick = loadDemoHandler;
  if (heroBtnDemo) heroBtnDemo.onclick = loadDemoHandler;
  if (previewExploreBtn) previewExploreBtn.onclick = loadDemoHandler;

  // "Plan Event" Buttons
  const btnNewEvent = document.getElementById('btn-new-event');
  const heroBtnPlan = document.getElementById('hero-btn-plan');

  const openPlanWizardHandler = () => {
    state.isWizardOpen = true;
    state.wizardStep = 1;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (btnNewEvent) btnNewEvent.onclick = openPlanWizardHandler;
  if (heroBtnPlan) heroBtnPlan.onclick = openPlanWizardHandler;

  // Preset Cards on Landing Page
  document.querySelectorAll('.preset-card').forEach(card => {
    card.onclick = () => {
      const occ = card.getAttribute('data-occasion');
      state.wizardForm.occasion = occ;
      state.wizardForm.title = `${occ} Celebration`;
      state.isWizardOpen = true;
      state.wizardStep = 1;
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  });

  // Saved Plans Drawer
  const btnSavedPlans = document.getElementById('btn-saved-plans');
  if (btnSavedPlans) {
    btnSavedPlans.onclick = () => {
      state.isSavedPlansOpen = true;
      render();
    };
  }

  const btnCloseSavedModal = document.getElementById('btn-close-saved-modal');
  if (btnCloseSavedModal) {
    btnCloseSavedModal.onclick = () => {
      state.isSavedPlansOpen = false;
      render();
    };
  }

  // Load Saved Plan
  document.querySelectorAll('.btn-load-saved-plan').forEach(btn => {
    btn.onclick = async () => {
      const id = btn.getAttribute('data-id');
      try {
        const plan = await api.loadPlan(id);
        state.activePlan = plan;
        state.view = 'blueprint';
        state.isSavedPlansOpen = false;
        state.isWizardOpen = false;
        storage.saveActiveEvent(plan);
        render();
        exporter.showToast(`Opened "${plan.title}"`, "success");
      } catch (e) {
        exporter.showToast("Failed to load plan: " + e.message, "error");
      }
    };
  });

  // Delete Saved Plan
  document.querySelectorAll('.btn-delete-saved-plan').forEach(btn => {
    btn.onclick = async () => {
      const id = btn.getAttribute('data-id');
      if (confirm("Are you sure you want to delete this saved celebration?")) {
        try {
          await api.deletePlan(id);
          storage.removeSavedEvent(id);
          state.savedPlans = state.savedPlans.filter(p => p.id !== id);
          if (state.activePlan?.id === id) {
            state.activePlan = null;
            state.view = 'landing';
          }
          render();
          exporter.showToast("Plan deleted successfully", "info");
        } catch (e) {
          exporter.showToast("Failed to delete plan: " + e.message, "error");
        }
      }
    };
  });

  // Settings / AI Config Modal
  const btnAiSettings = document.getElementById('btn-ai-settings');
  if (btnAiSettings) {
    btnAiSettings.onclick = () => {
      state.isSettingsOpen = true;
      render();
    };
  }

  const btnCloseSettings = document.getElementById('btn-close-settings');
  if (btnCloseSettings) {
    btnCloseSettings.onclick = () => {
      state.isSettingsOpen = false;
      render();
    };
  }

  const apiKeyForm = document.getElementById('api-key-form');
  if (apiKeyForm) {
    apiKeyForm.onsubmit = async (e) => {
      e.preventDefault();
      const keyInp = document.getElementById('inp-gemini-key');
      const val = keyInp?.value.trim();
      try {
        const res = await api.configureApiKey(val);
        state.aiConfigured = res.ai_configured;
        state.isSettingsOpen = false;
        render();
        exporter.showToast(res.message, res.ai_configured ? "success" : "info");
      } catch (err) {
        exporter.showToast("Error updating API key: " + err.message, "error");
      }
    };
  }

  const btnClearApiKey = document.getElementById('btn-clear-api-key');
  if (btnClearApiKey) {
    btnClearApiKey.onclick = async () => {
      try {
        await api.configureApiKey("");
        state.aiConfigured = false;
        state.isSettingsOpen = false;
        render();
        exporter.showToast("Gemini key cleared. Reverted to Smart Demo Engine.", "info");
      } catch (err) {
        exporter.showToast("Error clearing key", "error");
      }
    };
  }

  // Export Actions
  const btnExportCsv = document.getElementById('btn-export-csv');
  const btnExportPrint = document.getElementById('btn-export-print');
  const btnExportCopy = document.getElementById('btn-export-copy');
  const btnDirectCsv = document.getElementById('btn-export-budget-csv-direct');
  const blueprintBtnPrint = document.getElementById('blueprint-btn-print');
  const blueprintBtnShare = document.getElementById('blueprint-btn-share');

  if (btnExportCsv) btnExportCsv.onclick = () => exporter.exportBudgetCSV(state.activePlan);
  if (btnDirectCsv) btnDirectCsv.onclick = () => exporter.exportBudgetCSV(state.activePlan);
  if (btnExportPrint) btnExportPrint.onclick = () => exporter.exportPrintablePlan();
  if (blueprintBtnPrint) blueprintBtnPrint.onclick = () => exporter.exportPrintablePlan();
  if (btnExportCopy) btnExportCopy.onclick = () => exporter.copyShareableSummary(state.activePlan);
  if (blueprintBtnShare) blueprintBtnShare.onclick = () => exporter.copyShareableSummary(state.activePlan);

  // Setup Wizard Handlers
  attachWizardHandlers();

  // Blueprint Tabs & Interactivity Handlers
  attachBlueprintHandlers();

  // Copilot Drawer Handlers
  attachCopilotHandlers();
}

// Wizard Event Handlers
function attachWizardHandlers() {
  const btnCancel = document.getElementById('btn-cancel-wizard');
  if (btnCancel) {
    btnCancel.onclick = () => {
      state.isWizardOpen = false;
      render();
    };
  }

  // Wizard Step Pills
  document.querySelectorAll('.wizard-step-node').forEach(node => {
    node.onclick = () => {
      syncWizardInputs();
      state.wizardStep = parseInt(node.getAttribute('data-step'), 10);
      render();
    };
  });

  // Preset Buttons in Step 1
  document.querySelectorAll('.preset-choice-btn').forEach(btn => {
    btn.onclick = () => {
      state.wizardForm.occasion = btn.getAttribute('data-val');
      render();
    };
  });

  // City Chips in Step 2
  document.querySelectorAll('.city-chip-btn').forEach(btn => {
    btn.onclick = () => {
      state.wizardForm.city = btn.getAttribute('data-city');
      const inp = document.getElementById('inp-wizard-city');
      if (inp) inp.value = state.wizardForm.city;
    };
  });

  // Guest Chips in Step 2
  document.querySelectorAll('.guests-chip-btn').forEach(btn => {
    btn.onclick = () => {
      state.wizardForm.guests = parseInt(btn.getAttribute('data-guests'), 10);
      const inp = document.getElementById('inp-wizard-guests');
      if (inp) inp.value = state.wizardForm.guests;
    };
  });

  // Contingency Slider in Step 3
  const contingencySlider = document.getElementById('inp-wizard-contingency');
  const contingencyVal = document.getElementById('wizard-contingency-val');
  if (contingencySlider && contingencyVal) {
    contingencySlider.oninput = (e) => {
      contingencyVal.innerText = e.target.value;
      state.wizardForm.contingency_percent = parseInt(e.target.value, 10);
    };
  }

  // Next / Previous
  const btnPrev = document.getElementById('btn-wizard-prev');
  const btnNext = document.getElementById('btn-wizard-next');
  const btnGenerate = document.getElementById('btn-wizard-generate');

  if (btnPrev) {
    btnPrev.onclick = () => {
      if (state.wizardStep > 1) {
        syncWizardInputs();
        state.wizardStep--;
        render();
      }
    };
  }

  if (btnNext) {
    btnNext.onclick = () => {
      syncWizardInputs();
      // Simple validation
      if (state.wizardStep === 1 && !state.wizardForm.title.trim()) {
        exporter.showToast("Please enter an event title", "error");
        return;
      }
      if (state.wizardStep === 2 && !state.wizardForm.city.trim()) {
        exporter.showToast("Please specify a city or location", "error");
        return;
      }
      state.wizardStep++;
      render();
    };
  }

  if (btnGenerate) {
    btnGenerate.onclick = async () => {
      syncWizardInputs();
      const loadingState = document.getElementById('wizard-loading-state');
      const ticker = document.getElementById('loading-ticker-text');
      if (loadingState) loadingState.classList.remove('hidden');

      const steps = [
        "Analyzing celebration constraints...",
        "Structuring 9 itemized budget categories...",
        "Sequencing chronological run of show...",
        "Synthesizing vendor criteria & contingency protocols..."
      ];

      let sIdx = 0;
      const interval = setInterval(() => {
        if (ticker && steps[sIdx]) {
          ticker.innerText = steps[sIdx];
          sIdx = (sIdx + 1) % steps.length;
        }
      }, 700);

      try {
        const blueprint = await api.generatePlan(state.wizardForm);
        clearInterval(interval);
        state.activePlan = blueprint;
        state.isWizardOpen = false;
        state.view = 'blueprint';
        state.blueprintTab = 'overview';
        storage.saveActiveEvent(blueprint);
        state.savedPlans = await api.listSavedPlans();
        render();
        exporter.showToast("Event Blueprint created successfully!", "success");
      } catch (e) {
        clearInterval(interval);
        exporter.showToast("Generation error: " + e.message, "error");
        if (loadingState) loadingState.classList.add('hidden');
      }
    };
  }
}

function syncWizardInputs() {
  const title = document.getElementById('inp-wizard-title');
  const vibe = document.getElementById('inp-wizard-vibe');
  const city = document.getElementById('inp-wizard-city');
  const venue = document.getElementById('inp-wizard-venue');
  const date = document.getElementById('inp-wizard-date');
  const time = document.getElementById('inp-wizard-time');
  const duration = document.getElementById('inp-wizard-duration');
  const guests = document.getElementById('inp-wizard-guests');
  const budget = document.getElementById('inp-wizard-budget');
  const currency = document.getElementById('inp-wizard-currency');
  const theme = document.getElementById('inp-wizard-theme');
  const dietary = document.getElementById('inp-wizard-dietary');
  const special = document.getElementById('inp-wizard-special');

  const settingRadio = document.querySelector('input[name="inp-wizard-setting"]:checked');
  if (settingRadio) state.wizardForm.indoor_outdoor = settingRadio.value;

  if (title) state.wizardForm.title = title.value;
  if (vibe) state.wizardForm.vibe = vibe.value;
  if (city) state.wizardForm.city = city.value;
  if (venue) state.wizardForm.venue = venue.value;
  if (date) state.wizardForm.date = date.value;
  if (time) state.wizardForm.start_time = time.value;
  if (duration) state.wizardForm.duration = parseInt(duration.value, 10);
  if (guests) state.wizardForm.guests = parseInt(guests.value, 10);
  if (budget) state.wizardForm.budget = parseFloat(budget.value);
  if (currency) state.wizardForm.currency = currency.value;
  if (theme) state.wizardForm.theme = theme.value;
  if (dietary) state.wizardForm.dietary = dietary.value;
  if (special) state.wizardForm.special_requests = special.value;
}

// Blueprint Tab & Interactive Handlers
function attachBlueprintHandlers() {
  // Tabs
  document.querySelectorAll('.blueprint-tab-btn').forEach(btn => {
    btn.onclick = () => {
      state.blueprintTab = btn.getAttribute('data-tab');
      render();
    };
  });

  // Copilot trigger inside Blueprint
  const blueprintBtnCopilot = document.getElementById('blueprint-btn-copilot');
  if (blueprintBtnCopilot) {
    blueprintBtnCopilot.onclick = () => {
      state.isCopilotOpen = true;
      render();
    };
  }

  // --- Budget Planner Handlers ---
  // Budget Rebalance to 100%
  const btnBudgetRebalance = document.getElementById('btn-budget-rebalance');
  if (btnBudgetRebalance && state.activePlan) {
    btnBudgetRebalance.onclick = () => {
      const b = state.activePlan.budget_breakdown;
      const total = b.total_budget;
      const contPct = b.contingency_percent || 10;
      const contAmount = Math.round(total * (contPct / 100));
      const allocable = total - contAmount;
      
      const cats = b.categories || [];
      const currentSum = cats.reduce((s, c) => s + (c.allocated || 0), 0) || 1;
      
      let running = 0;
      cats.forEach((c, i) => {
        if (i === cats.length - 1) {
          c.allocated = Math.round((allocable - running) * 100) / 100;
        } else {
          c.allocated = Math.round((c.allocated / currentSum) * allocable * 100) / 100;
          running += c.allocated;
        }
        c.percentage = Math.round((c.allocated / total) * 1000) / 10;
      });

      storage.saveActiveEvent(state.activePlan);
      render();
      exporter.showToast("Budget rebalanced deterministically to 100%", "success");
    };
  }

  // Smart -15% Trim Button
  const btnBudgetReduce15 = document.getElementById('btn-budget-reduce-15');
  if (btnBudgetReduce15 && state.activePlan) {
    btnBudgetReduce15.onclick = async () => {
      try {
        const result = await api.replanBudget(state.activePlan, 15);
        state.copilotProposal = {
          type: 'budget_reduction',
          summary: `Reduce Budget by 15% (Save ${state.activePlan.currency}${result.savings_amount.toLocaleString()})`,
          data: result.revised_budget
        };
        state.isCopilotOpen = true;
        state.copilotMessages.push({
          role: 'assistant',
          text: result.explanation,
          source: 'EventGenie Budget Engine'
        });
        render();
      } catch (e) {
        exporter.showToast("Error recalculating budget: " + e.message, "error");
      }
    };
  }

  // Budget Item Input Change
  document.querySelectorAll('.budget-item-input').forEach(input => {
    input.onchange = (e) => {
      const catIdx = parseInt(e.target.getAttribute('data-cat-idx'), 10);
      const itemIdx = parseInt(e.target.getAttribute('data-item-idx'), 10);
      const newVal = parseFloat(e.target.value) || 0;
      
      const b = state.activePlan.budget_breakdown;
      if (b && b.categories[catIdx] && b.categories[catIdx].items[itemIdx]) {
        b.categories[catIdx].items[itemIdx].amount = newVal;
        // Recalculate category total
        const newCatSum = b.categories[catIdx].items.reduce((s, it) => s + (it.amount || 0), 0);
        b.categories[catIdx].allocated = newCatSum;
        b.categories[catIdx].percentage = Math.round((newCatSum / (b.total_budget || 1)) * 1000) / 10;
        
        storage.saveActiveEvent(state.activePlan);
        render();
      }
    };
  });

  // Add Custom Budget Item
  document.querySelectorAll('.btn-add-budget-item').forEach(btn => {
    btn.onclick = () => {
      const catIdx = parseInt(btn.getAttribute('data-cat-idx'), 10);
      const itemName = prompt("Enter expense item name:");
      if (!itemName) return;
      const amountStr = prompt("Enter estimated amount:", "1000");
      const amount = parseFloat(amountStr) || 0;

      const b = state.activePlan.budget_breakdown;
      if (b && b.categories[catIdx]) {
        if (!b.categories[catIdx].items) b.categories[catIdx].items = [];
        b.categories[catIdx].items.push({
          name: itemName,
          amount: amount,
          status: 'Custom'
        });
        b.categories[catIdx].allocated += amount;
        b.categories[catIdx].percentage = Math.round((b.categories[catIdx].allocated / (b.total_budget || 1)) * 1000) / 10;

        storage.saveActiveEvent(state.activePlan);
        render();
        exporter.showToast(`Added "${itemName}"`, "success");
      }
    };
  });

  // --- Timeline Handlers ---
  document.querySelectorAll('.timeline-filter-btn').forEach(btn => {
    btn.onclick = () => {
      state.timelineFilter = btn.getAttribute('data-phase');
      render();
    };
  });

  // Toggle Timeline Checkbox
  document.querySelectorAll('.timeline-check').forEach(chk => {
    chk.onchange = (e) => {
      const id = e.target.getAttribute('data-id');
      const item = state.activePlan?.timeline?.find(t => t.id === id);
      if (item) {
        item.completed = e.target.checked;
        storage.saveActiveEvent(state.activePlan);
        render();
      }
    };
  });

  // Add Timeline Item
  const btnAddTimeline = document.getElementById('btn-add-timeline-item');
  if (btnAddTimeline && state.activePlan) {
    btnAddTimeline.onclick = () => {
      const title = prompt("Enter schedule milestone title:");
      if (!title) return;
      const time = prompt("Enter time range (e.g. 03:00 PM - 04:00 PM):", "03:00 PM - 04:00 PM");
      const phase = prompt("Enter phase (e.g. Main Event, Entertainment, Food):", "Main Event");
      const desc = prompt("Enter brief notes or description:", "");

      if (!state.activePlan.timeline) state.activePlan.timeline = [];
      state.activePlan.timeline.push({
        id: `tl_custom_${Date.now()}`,
        time: time || 'TBD',
        phase: phase || 'Schedule',
        title: title,
        category: 'Custom',
        location: 'Venue',
        description: desc || '',
        completed: false
      });

      storage.saveActiveEvent(state.activePlan);
      render();
      exporter.showToast("Schedule item added!", "success");
    };
  }

  // Delete Timeline Item
  document.querySelectorAll('.btn-delete-timeline').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      if (confirm("Remove this schedule milestone?")) {
        state.activePlan.timeline = state.activePlan.timeline.filter(t => t.id !== id);
        storage.saveActiveEvent(state.activePlan);
        render();
      }
    };
  });

  // Edit Timeline Item
  document.querySelectorAll('.btn-edit-timeline').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      const item = state.activePlan.timeline.find(t => t.id === id);
      if (item) {
        const newTitle = prompt("Edit milestone title:", item.title);
        if (newTitle !== null) {
          item.title = newTitle;
          const newTime = prompt("Edit time range:", item.time);
          if (newTime !== null) item.time = newTime;
          storage.saveActiveEvent(state.activePlan);
          render();
        }
      }
    };
  });

  // --- Checklist Handlers ---
  document.querySelectorAll('.checklist-tab-btn').forEach(btn => {
    btn.onclick = () => {
      state.checklistFilter = btn.getAttribute('data-filter');
      render();
    };
  });

  const catSelect = document.getElementById('checklist-cat-select');
  if (catSelect) {
    catSelect.onchange = (e) => {
      state.checklistCategoryFilter = e.target.value;
      render();
    };
  }

  // Toggle Task Checkbox
  document.querySelectorAll('.task-checkbox').forEach(chk => {
    chk.onchange = (e) => {
      const id = e.target.getAttribute('data-id');
      const task = state.activePlan?.checklist?.find(t => t.id === id);
      if (task) {
        task.completed = e.target.checked;
        storage.saveActiveEvent(state.activePlan);
        render();
      }
    };
  });

  // Add Custom Task
  const btnAddTask = document.getElementById('btn-add-task');
  if (btnAddTask && state.activePlan) {
    btnAddTask.onclick = () => {
      const taskName = prompt("Enter task name:");
      if (!taskName) return;
      const cat = prompt("Enter category (Venue, Catering, Decor, Marketing, Safety):", "General");
      const priority = prompt("Enter priority (Urgent, High, Medium, Low):", "Medium");
      const deadline = prompt("Enter deadline (e.g. 1 Week Prior):", "1 Week Prior");

      if (!state.activePlan.checklist) state.activePlan.checklist = [];
      state.activePlan.checklist.unshift({
        id: `chk_custom_${Date.now()}`,
        task: taskName,
        category: cat || 'General',
        priority: priority || 'Medium',
        deadline: deadline || 'TBD',
        completed: false
      });

      storage.saveActiveEvent(state.activePlan);
      render();
      exporter.showToast("Task added to checklist!", "success");
    };
  }

  // Delete Task
  document.querySelectorAll('.btn-delete-task').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      state.activePlan.checklist = state.activePlan.checklist.filter(t => t.id !== id);
      storage.saveActiveEvent(state.activePlan);
      render();
    };
  });

  // --- Vendor Status Selector Handlers ---
  document.querySelectorAll('.vendor-status-select').forEach(sel => {
    sel.onchange = (e) => {
      const idx = parseInt(e.target.getAttribute('data-idx'), 10);
      if (state.activePlan?.vendors?.[idx]) {
        state.activePlan.vendors[idx].status = e.target.value;
        storage.saveActiveEvent(state.activePlan);
        render();
        exporter.showToast(`Updated status to "${e.target.value}"`, "info");
      }
    };
  });
}

// Copilot Drawer Handlers
function attachCopilotHandlers() {
  const btnOpen = document.getElementById('btn-open-copilot');
  const btnClose = document.getElementById('btn-close-copilot');

  if (btnOpen) {
    btnOpen.onclick = () => {
      state.isCopilotOpen = true;
      render();
    };
  }

  if (btnClose) {
    btnClose.onclick = () => {
      state.isCopilotOpen = false;
      render();
    };
  }

  // Copilot Chips
  document.querySelectorAll('.copilot-chip-btn').forEach(btn => {
    btn.onclick = () => {
      const promptText = btn.getAttribute('data-prompt');
      submitCopilotQuery(promptText);
    };
  });

  // Copilot Form Submit
  const copilotForm = document.getElementById('copilot-chat-form');
  if (copilotForm) {
    copilotForm.onsubmit = (e) => {
      e.preventDefault();
      const inp = document.getElementById('copilot-input');
      const val = inp?.value.trim();
      if (val) {
        submitCopilotQuery(val);
      }
    };
  }

  // Proposal Accept / Dismiss
  const btnApplyProposal = document.getElementById('btn-apply-proposal');
  const btnRejectProposal = document.getElementById('btn-reject-proposal');

  if (btnApplyProposal && state.copilotProposal) {
    btnApplyProposal.onclick = () => {
      const p = state.copilotProposal;
      if (p.type === 'budget_reduction' && state.activePlan) {
        state.activePlan.budget_breakdown = p.data;
        state.activePlan.budget = p.data.total_budget;
        storage.saveActiveEvent(state.activePlan);
        exporter.showToast("Budget reduction applied to live plan!", "success");
      } else if (p.type === 'add_contingency' && state.activePlan) {
        if (!state.activePlan.contingencies) state.activePlan.contingencies = [];
        state.activePlan.contingencies.unshift(p.data);
        storage.saveActiveEvent(state.activePlan);
        exporter.showToast("Contingency protocol added to plan!", "success");
      }
      state.copilotProposal = null;
      render();
    };
  }

  if (btnRejectProposal) {
    btnRejectProposal.onclick = () => {
      state.copilotProposal = null;
      render();
    };
  }
}

async function submitCopilotQuery(message) {
  if (!state.activePlan) {
    exporter.showToast("Load or create an event before asking Copilot", "info");
    return;
  }

  state.copilotMessages.push({
    role: 'user',
    text: message
  });
  state.copilotLoading = true;
  render();

  try {
    const res = await api.sendCopilotMessage(state.activePlan, message);
    state.copilotLoading = false;
    state.copilotMessages.push({
      role: 'assistant',
      text: res.reply,
      source: res.source || 'EventGenie AI'
    });
    if (res.proposal) {
      state.copilotProposal = res.proposal;
    }
    render();

    // Scroll chat to bottom
    setTimeout(() => {
      const container = document.getElementById('copilot-messages-container');
      if (container) container.scrollTop = container.scrollHeight;
    }, 50);

  } catch (e) {
    state.copilotLoading = false;
    state.copilotMessages.push({
      role: 'assistant',
      text: "Apologies, I encountered an issue: " + e.message,
      source: 'EventGenie Error Handler'
    });
    render();
  }
}

// Kickstart on DOM ready
document.addEventListener('DOMContentLoaded', init);
