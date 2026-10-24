/**
 * EventGenie AI - Client Storage & Sync Utility
 */

const STORAGE_KEY = 'eventgenie_active_plan';
const HISTORY_KEY = 'eventgenie_saved_plans';

export function getActiveEvent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Failed to parse active event from localStorage:', e);
    return null;
  }
}

export function saveActiveEvent(eventData) {
  try {
    if (!eventData) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(eventData));
    
    // Also update history list in localStorage
    const saved = getSavedEventsList();
    const existingIndex = saved.findIndex(item => item.id === eventData.id);
    const summary = {
      id: eventData.id,
      title: eventData.title,
      occasion: eventData.occasion,
      city: eventData.city,
      date: eventData.date,
      guests: eventData.guests,
      budget: eventData.budget,
      currency: eventData.currency,
      updated_at: new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
      saved[existingIndex] = summary;
    } else {
      saved.unshift(summary);
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(saved));
  } catch (e) {
    console.error('Failed to save event to localStorage:', e);
  }
}

export function getSavedEventsList() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function removeSavedEvent(eventId) {
  try {
    let saved = getSavedEventsList();
    saved = saved.filter(e => e.id !== eventId);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(saved));
  } catch (e) {
    console.error('Failed to delete event from localStorage:', e);
  }
}
