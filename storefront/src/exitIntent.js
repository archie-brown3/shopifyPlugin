/**
 * Detects exit intent signals appropriately for desktop (mouse) and mobile (scroll/back).
 */
export const exitIntent = {
  /**
   * Initialize exit intent listeners
   * @param {Function} callback - Function to call when exit intent is detected
   * @param {Object} options - Configuration options
   */
  init(callback, options = {}) {
    const {
      threshold = 10, // pixel distance from top
      minTimeOnPage = 2000, // don't trigger immediately
    } = options;

    let armed = false;

    // Arm the trigger after a short delay to prevent false positives on load
    setTimeout(() => {
      armed = true;
    }, minTimeOnPage);

    const checkExit = (e) => {
      if (!armed) return;

      // Desktop: precise mouse tracking
      if (e.clientY <= threshold) {
        callback();
      }
    };

    // Use mouseleave on documentElement for better reliability than mouseout
    document.documentElement.addEventListener("mouseleave", checkExit);

    // Fallback for older browsers
    document.addEventListener("mouseout", (e) => {
      if (!e.toElement && !e.relatedTarget) {
        checkExit(e);
      }
    });

    return () => {
      document.documentElement.removeEventListener("mouseleave", checkExit);
      document.removeEventListener("mouseout", checkExit);
    };
  },
};
