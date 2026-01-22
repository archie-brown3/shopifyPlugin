import { renderSurvey } from "./surveyUI.js";
import { createShadowRoot } from "./core/shadow.js";
import { exitIntent } from "./exitIntent.js";
import css from "./styles/widget.css?inline"; // Vite inline CSS import

const WIDGET_ID = "lost-sale-survey-widget";

class SurveyWidget {
  constructor() {
    if (window.__LOST_SALE_WIDGET_INSTANCE__) {
      return window.__LOST_SALE_WIDGET_INSTANCE__;
    }

    this.init();
    window.__LOST_SALE_WIDGET_INSTANCE__ = this;
  }

  init() {
    console.log("[SurveyWidget] Initializing...");

    // Parse configuration from the script tag if needed (future)
    // const currentScript = document.currentScript;
    // this.config = { ...currentScript?.dataset };

    // Setup the shadow root early
    this.shadowRoot = createShadowRoot(WIDGET_ID, css);

    // Placeholder for trigger logic
    this.setupTriggers();
  }

  setupTriggers() {
    // expose public method for manual testing
    window.LostSale = {
      open: () => this.showSurvey(),
    };

    // Initialize exit intent trigger
    this.cleanupExit = exitIntent.init(() => {
      console.log("[SurveyWidget] Exit intent detected");
      this.showSurvey();
    });

    console.log("[SurveyWidget] Initialized with Exit Intent protection.");
  }

  showSurvey() {
    if (this.isOpen) return;
    this.isOpen = true;

    renderSurvey(this.shadowRoot, {
      onSelect: (reason) => {
        console.log("[SurveyWidget] Reason selected:", reason);
        // TODO: Send to backend
        this.closeSurvey();
      },
      onClose: () => {
        // Only run close logic if it's currently open
        this.closeSurvey();
      },
    });
  }

  closeSurvey() {
    if (!this.isOpen) return;
    this.isOpen = false;
    // surveyUI handleClose should effectively remove/hide the UI
    const overlay = this.shadowRoot.querySelector(".widget-overlay");
    if (overlay) {
      overlay.dataset.visible = "false"; // Signal UI to animate out
      // Actual DOM removal could be handled by UI layer or here
    }
  }
}

// Auto-initialize
new SurveyWidget();
