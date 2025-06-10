export class NotificationUtils {
  static show(message, type = "info", duration = 4000) {
    // Remove existing notifications
    this.removeExisting();

    // Create notification container
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;

    // Set notification content based on type
    let iconHTML = "";
    switch (type) {
      case "success":
        iconHTML = `
          <svg class="notification-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
        break;
      case "error":
        iconHTML = `
          <svg class="notification-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
        break;
      case "warning":
        iconHTML = `
          <svg class="notification-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18A2 2 0 0 0 3.64 21H20.36A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
        break;
      default:
        iconHTML = `
          <svg class="notification-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
    }

    notification.innerHTML = `
      <div class="notification-content">
        ${iconHTML}
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="notification-progress"></div>
    `;

    // Add to body
    document.body.appendChild(notification);

    // Add CSS if not exists
    this.addStyles();

    // Trigger entrance animation
    setTimeout(() => {
      notification.classList.add("notification-show");
    }, 100);

    // Start progress bar animation
    const progressBar = notification.querySelector(".notification-progress");
    setTimeout(() => {
      progressBar.style.width = "0%";
    }, 200);

    // Auto remove after duration
    setTimeout(() => {
      this.remove(notification);
    }, duration);

    return notification;
  }

  static remove(notification) {
    if (notification && notification.parentElement) {
      notification.classList.add("notification-hide");
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }
  }

  static removeExisting() {
    const existing = document.querySelectorAll(".notification");
    existing.forEach((notification) => {
      this.remove(notification);
    });
  }

  static addStyles() {
    if (document.querySelector("#notification-styles")) return;

    const styles = document.createElement("style");
    styles.id = "notification-styles";
    styles.textContent = `
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        min-width: 320px;
        max-width: 400px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.05);
        transform: translateX(100%);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 10000;
        overflow: hidden;
        border-left: 4px solid;
      }

      .notification-show {
        transform: translateX(0);
      }

      .notification-hide {
        transform: translateX(100%);
        opacity: 0;
      }

      .notification-success {
        border-left-color: #10b981;
      }

      .notification-error {
        border-left-color: #ef4444;
      }

      .notification-warning {
        border-left-color: #f59e0b;
      }

      .notification-info {
        border-left-color: #3b82f6;
      }

      .notification-content {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 16px 20px;
      }

      .notification-icon {
        width: 24px;
        height: 24px;
        flex-shrink: 0;
        margin-top: 2px;
      }

      .notification-success .notification-icon {
        color: #10b981;
      }

      .notification-error .notification-icon {
        color: #ef4444;
      }

      .notification-warning .notification-icon {
        color: #f59e0b;
      }

      .notification-info .notification-icon {
        color: #3b82f6;
      }

      .notification-message {
        flex: 1;
        font-size: 14px;
        line-height: 1.5;
        color: #374151;
        font-weight: 500;
      }

      .notification-close {
        background: none;
        border: none;
        padding: 4px;
        cursor: pointer;
        border-radius: 6px;
        transition: background-color 0.2s;
        flex-shrink: 0;
      }

      .notification-close:hover {
        background-color: #f3f4f6;
      }

      .notification-close svg {
        width: 16px;
        height: 16px;
        color: #6b7280;
      }

      .notification-progress {
        height: 3px;
        background: linear-gradient(90deg, transparent, currentColor);
        width: 100%;
        transition: width linear;
        margin-top: -3px;
      }

      .notification-success .notification-progress {
        color: #10b981;
        transition-duration: 4s;
      }

      .notification-error .notification-progress {
        color: #ef4444;
        transition-duration: 4s;
      }

      .notification-warning .notification-progress {
        color: #f59e0b;
        transition-duration: 4s;
      }

      .notification-info .notification-progress {
        color: #3b82f6;
        transition-duration: 4s;
      }

      /* Mobile responsive */
      @media (max-width: 480px) {
        .notification {
          right: 10px;
          left: 10px;
          min-width: auto;
          max-width: none;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  // Convenience methods
  static success(message, duration = 4000) {
    return this.show(message, "success", duration);
  }

  static error(message, duration = 4000) {
    return this.show(message, "error", duration);
  }

  static warning(message, duration = 4000) {
    return this.show(message, "warning", duration);
  }

  static info(message, duration = 4000) {
    return this.show(message, "info", duration);
  }

  // Demo method for testing notifications
  static demo() {
    console.log("🎯 Testing Notification System...");

    setTimeout(() => {
      this.success("Login berhasil! Selamat datang kembali, Ahmad Rifki.");
    }, 500);

    setTimeout(() => {
      this.error("Email atau password salah. Silakan coba lagi.");
    }, 2500);

    setTimeout(() => {
      this.warning("Akun Anda akan segera kedaluwarsa. Silakan perbarui.");
    }, 4500);

    setTimeout(() => {
      this.info("Sistem notifikasi berfungsi dengan baik!");
    }, 6500);
  }

  // Test login success with full_name from database
  static testLoginSuccess(userData = null) {
    const user = userData || {
      full_name: "Ahmad Rifki Susanto",
      email: "ahmad.rifki@example.com",
    };
    const userName =
      user?.fullName ||
      user?.full_name ||
      user?.nama ||
      user?.name ||
      user?.email ||
      "User";

    this.success(`Selamat datang kembali, ${userName}! Login berhasil.`, 3000);
  }

  // Test register success with full_name from database
  static testRegisterSuccess(userData = null) {
    const user = userData || {
      full_name: "Sari Dewi Lestari",
      email: "sari.dewi@example.com",
    };
    const userName =
      user?.fullName || user?.full_name || user?.nama || user?.name || "User";

    this.success(
      `Selamat ${userName}! Akun Anda berhasil dibuat. Silakan masuk dengan akun baru Anda.`,
      4000
    );
  }

  // Test with various name field formats from database
  static testDatabaseNameFormats() {
    console.log("🧪 Testing various database name formats...");

    setTimeout(() => {
      this.testLoginSuccess({ full_name: "John Doe" });
    }, 500);

    setTimeout(() => {
      this.testLoginSuccess({ fullName: "Jane Smith" });
    }, 2000);

    setTimeout(() => {
      this.testLoginSuccess({ nama: "Budi Santoso" });
    }, 3500);

    setTimeout(() => {
      this.testLoginSuccess({ name: "Sarah Wilson" });
    }, 5000);

    setTimeout(() => {
      this.testLoginSuccess({ email: "user@example.com" }); // fallback
    }, 6500);
  }
}
