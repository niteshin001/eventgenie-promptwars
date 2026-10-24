/**
 * EventGenie AI - API Client
 * Interfaces with backend endpoints with resilient error handling
 */

const API_BASE = '/api';

export async function getHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  } catch (e) {
    console.error("Health check failed:", e);
    return { status: "offline", ai_configured: false };
  }
}

export async function getDemoEvent() {
  const res = await fetch(`${API_BASE}/demo`);
  if (!res.ok) throw new Error("Failed to load demo event");
  return await res.json();
}

export async function getPresets() {
  const res = await fetch(`${API_BASE}/presets`);
  if (!res.ok) throw new Error("Failed to load presets");
  return await res.json();
}

export async function generatePlan(setupData) {
  const res = await fetch(`${API_BASE}/generate-plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(setupData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to generate event blueprint");
  }
  return await res.json();
}

export async function replanBudget(plan, reductionPercent = 15, protectedCategories = ["Food & Catering", "Venue & Facilities"]) {
  const res = await fetch(`${API_BASE}/replan-budget`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plan,
      reduction_percent: reductionPercent,
      protected_categories: protectedCategories
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to replan budget");
  }
  return await res.json();
}

export async function sendCopilotMessage(plan, message) {
  const res = await fetch(`${API_BASE}/copilot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan, message })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Copilot communication failed");
  }
  return await res.json();
}

export async function savePlan(plan) {
  const res = await fetch(`${API_BASE}/plans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(plan)
  });
  if (!res.ok) throw new Error("Failed to save plan to database");
  return await res.json();
}

export async function listSavedPlans() {
  const res = await fetch(`${API_BASE}/plans`);
  if (!res.ok) throw new Error("Failed to list plans");
  const data = await res.json();
  return data.plans || [];
}

export async function loadPlan(planId) {
  const res = await fetch(`${API_BASE}/plans/${encodeURIComponent(planId)}`);
  if (!res.ok) throw new Error("Failed to load plan");
  return await res.json();
}

export async function deletePlan(planId) {
  const res = await fetch(`${API_BASE}/plans/${encodeURIComponent(planId)}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error("Failed to delete plan");
  return await res.json();
}

export async function configureApiKey(apiKey) {
  const res = await fetch(`${API_BASE}/config/gemini-key`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: apiKey })
  });
  if (!res.ok) throw new Error("Failed to configure API key");
  return await res.json();
}
