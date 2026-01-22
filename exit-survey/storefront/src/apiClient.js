const API_BASE = "https://your-app-url.com/api"; // To be configured

export const apiClient = {
  async getConfig() {
    // In a real app, this would fetch from the backend.
    // For MVP/Dev, we'll return a mock config or fetch from a local endpoint if running locally.
    // For now, return a default config.
    return {
      enabled: true,
      throttleDays: 7,
      reasons: [
        { key: "price", label: "Price too high" },
        { key: "shipping", label: "Shipping cost" },
        { key: "browsing", label: "Just browsing" },
        { key: "other", label: "Other" },
      ],
    };
  },

  sendFeedback(data) {
    const payload = JSON.stringify(data);
    const url = `${API_BASE}/feedback`;

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon(url, blob);
    } else {
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch((err) => console.error("Feedback send failed:", err));
    }
  },
};
