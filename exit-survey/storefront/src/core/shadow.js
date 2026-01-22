/**
 * Creates a Shadow DOM root attached to the body, ensuring isolation.
 * @param {string} id - Unique ID for the host element
 * @param {string} styles - CSS string to inject
 * @returns {ShadowRoot} The created shadow root
 */
export function createShadowRoot(id, styles) {
  let host = document.getElementById(id);

  if (!host) {
    host = document.createElement("div");
    host.id = id;
    document.body.appendChild(host);
  }

  // If shadow root exists, return it (idempotent)
  if (host.shadowRoot) {
    return host.shadowRoot;
  }

  const shadow = host.attachShadow({ mode: "open" });

  if (styles) {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    shadow.appendChild(styleSheet);
  }

  return shadow;
}

export function removeShadowRoot(id) {
  const host = document.getElementById(id);
  if (host) {
    host.remove();
  }
}
