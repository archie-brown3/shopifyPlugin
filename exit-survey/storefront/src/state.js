const STATE_KEY = "shopify_survey_state";

export const state = {
  get() {
    try {
      return JSON.parse(sessionStorage.getItem(STATE_KEY)) || {};
    } catch {
      return {};
    }
  },

  set(newState) {
    const current = state.get();
    sessionStorage.setItem(
      STATE_KEY,
      JSON.stringify({ ...current, ...newState })
    );
  },

  markShown() {
    state.set({ lastShown: Date.now() });
    localStorage.setItem("survey_last_shown", Date.now());
  },

  markResponded() {
    state.set({ responded: true });
    localStorage.setItem("survey_responded", "true");
  },

  hasResponded() {
    return localStorage.getItem("survey_responded") === "true";
  },

  getLastShown() {
    return parseInt(localStorage.getItem("survey_last_shown") || "0", 10);
  },
};
