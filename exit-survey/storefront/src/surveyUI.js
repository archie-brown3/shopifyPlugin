// Creates DOM elements and handles survey UI

const SURVEY_OPTIONS = [
  { id: "price", label: "Price is too high" },
  { id: "shipping", label: "Shipping is too expensive" },
  { id: "browsing", label: "Just browsing" },
  { id: "other", label: "Other" },
];

export function renderSurvey(shadowRoot, { onSelect, onClose }) {
  // Prevent duplicate renders
  if (shadowRoot.querySelector(".widget-overlay")) return;

  const overlay = document.createElement("div");
  overlay.className = "widget-overlay";

  const container = document.createElement("div");
  container.className = "widget-container";

  container.innerHTML = `
    <button class="widget-close" aria-label="Close survey">&times;</button>
    <div class="widget-header">
      <h3 class="widget-title">Quick question before you go...</h3>
      <p style="margin: 8px 0 0; color: #666;">What stopped you from buying today?</p>
    </div>
    <div class="widget-options">
      ${SURVEY_OPTIONS.map(
        (opt) => `
        <button class="widget-option" data-reason="${opt.id}">
          ${opt.label}
        </button>
      `
      ).join("")}
    </div>
  `;

  overlay.appendChild(container);
  shadowRoot.appendChild(overlay);

  // Trigger animation next frame
  requestAnimationFrame(() => {
    overlay.classList.add("visible");
  });

  // Event Delegation
  const handleInteraction = (e) => {
    // Close button
    if (e.target.closest(".widget-close")) {
      close();
      return;
    }

    // Overlay click (background)
    if (e.target === overlay) {
      close();
      return;
    }

    // Option click
    const optionBtn = e.target.closest(".widget-option");
    if (optionBtn) {
      const reason = optionBtn.dataset.reason;
      close(() => onSelect(reason));
    }
  };

  overlay.addEventListener("click", handleInteraction);

  function close(callback) {
    overlay.classList.remove("visible");

    // Wait for transition to finish before removing
    overlay.addEventListener(
      "transitionend",
      () => {
        overlay.remove();
        if (callback) callback();
        else onClose();
      },
      { once: true }
    );
  }
}
