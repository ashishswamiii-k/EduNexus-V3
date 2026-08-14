/* ============================================================
   EDUNEXUS — MASTER APPLICATION INITIALIZER
   ============================================================ */

class AppController {
  constructor() {
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      // 1. Initialize Local Storage Database
      Storage.init();

      // 2. Initial SPA Route Resolution
      Router.handleRouting();

      // 3. Bind Keyboard Accessibility & Click Outside Listeners
      this.bindEventListeners();

      // 4. Initialize Splash Screen Entrance
      this.initSplashScreen();
    });
  }

  initSplashScreen() {
    setTimeout(() => {
      const splash = document.getElementById('edunexus-splash-screen');
      if (splash) {
        splash.classList.add('fade-out');
        setTimeout(() => splash.remove(), 600);
      }
    }, 750);
  }

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar-container');
    if (sidebar) {
      sidebar.classList.toggle('collapsed');
      sidebar.classList.toggle('mobile-open');
    }
  }

  toggleProfileDropdown() {
    const dropdown = document.getElementById('header-profile-dropdown');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  }

  closeProfileDropdown() {
    const dropdown = document.getElementById('header-profile-dropdown');
    if (dropdown) {
      dropdown.classList.remove('show');
    }
  }

  bindEventListeners() {
    window.addEventListener('keydown', (e) => {
      // ESC key closes active modal & dropdown
      if (e.key === 'Escape') {
        Notifications.closeModal();
        this.closeProfileDropdown();
      }
    });

    // Dismiss dropdown on outside click
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('header-profile-dropdown');
      const profileBtn = e.target.closest('.header-actions');
      if (dropdown && dropdown.classList.contains('show') && !profileBtn) {
        this.closeProfileDropdown();
      }
    });
  }
}

const App = new AppController();
window.App = App;
