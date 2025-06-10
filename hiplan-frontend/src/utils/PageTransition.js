export class PageTransition {
  constructor() {
    this.app = document.getElementById("app");
    this.isTransitioning = false;
  }

  async transition(renderCallback, duration = 300) {
    // Prevent multiple simultaneous transitions
    if (this.isTransitioning) {
      renderCallback();
      return;
    }

    this.isTransitioning = true;

    try {
      // Step 1: Fade out current content
      this.app.style.opacity = "0";
      this.app.style.transition = `opacity ${duration}ms ease-in-out`;

      // Step 2: Wait for fade out to complete
      await new Promise((resolve) => setTimeout(resolve, duration));

      // Step 3: Render new content
      renderCallback();

      // Step 4: Fade in new content
      await new Promise((resolve) => setTimeout(resolve, 50)); // Small delay
      this.app.style.opacity = "1";

      // Step 5: Wait for fade in to complete
      await new Promise((resolve) => setTimeout(resolve, duration));
    } catch (error) {
      console.error("Page transition error:", error);
      renderCallback(); // Fallback to immediate render
    } finally {
      // Clean up
      this.app.style.transition = "";
      this.isTransitioning = false;
    }
  }

  // Immediate render without transition (for fallback)
  immediate(renderCallback) {
    renderCallback();
  }
}

// Export single instance
export default new PageTransition();
