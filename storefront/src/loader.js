import { apiClient } from "./apiClient.js";
import { throttle } from "./throttle.js";
import { renderSurvey } from "./surveyUI.js";
import { exitIntent } from "./exitIntent.js";
import { state } from "./state.js";

console.log("[LostSale] Loader initializing...");

async function init() {
  const config = await apiClient.getConfig();
  console.log("[LostSale] Config loaded:", config);

  if (!throttle.shouldShow(config)) {
    console.log("[LostSale] Throttled or disabled.");
    return;
  }

  exitIntent.init(() => {
    console.log("[LostSale] Exit intent detected!");

    // Check again just in case state changed in this session
    if (!throttle.shouldShow(config)) return;

    renderSurvey({
      onSelect: (reasonKey) => {
        console.log("[LostSale] Reason selected:", reasonKey);
        apiClient.sendFeedback({
          reason: reasonKey,
          url: window.location.href,
          timestamp: Date.now(),
        });
        state.markResponded();
      },
      onClose: () => {
        console.log("[LostSale] Closed.");
        state.markShown(); // Mark as shown even if closed, to trigger cooldown
      },
    });

    // Mark as shown immediately or after render?
    // Usually improved to mark after render to avoid double trigger
    state.markShown();
  });
}

// Auto-init
init();
