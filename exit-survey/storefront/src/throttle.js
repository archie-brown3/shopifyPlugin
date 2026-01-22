import { state } from "./state.js";

export const throttle = {
  shouldShow(config) {
    if (!config.enabled) return false;
    if (state.hasResponded()) return false;

    // Check session limit (once per session)
    const sessionData = state.get();
    if (sessionData.lastShown) return false;

    // Check cooldown (days)
    const lastShownTime = state.getLastShown();
    const daysSince = (Date.now() - lastShownTime) / (1000 * 60 * 60 * 24);

    if (daysSince < config.throttleDays) return false;

    return true;
  },
};
