/* ============================================================
   EDUNEXUS — MASTER APPLICATION INITIALIZER & THEME ENGINE
   PERMANENT FIXED 250PX SIDEBAR • NO COLLAPSE TOGGLES
   ============================================================ */

class AppController {
  constructor() {
    this.sessionThemeKey = 'edunexus_theme_mode';
    this.init();
  }

  init() {
    const run = () => {
      // 1. Initialize Local Storage Database
      if (window.Storage) Storage.init();

      // 2. Restore Persistent Theme Preference
      this.restoreTheme();

      // 3. Initial SPA Route Resolution
      if (window.Router) {
        if (typeof Router.handleRouting === 'function') {
          Router.handleRouting();
        } else if (typeof Router.init === 'function') {
          Router.init();
        }
      }

      // 4. Bind Keyboard Accessibility & Click Outside Listeners
      this.bindEventListeners();

      // 5. Initialize Splash Screen Entrance
      this.initSplashScreen();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run);
    } else {
      run();
    }
  }

  restoreTheme() {
    try {
      const theme = localStorage.getItem(this.sessionThemeKey) || 'dark';
      this.setTheme(theme, false);
    } catch (e) {
      console.error('Error restoring theme preference', e);
      this.setTheme('dark', false);
    }
  }

  setTheme(themeName, showToast = true) {
    const validThemes = ['dark', 'light', 'eyecare'];
    const selected = validThemes.includes(themeName) ? themeName : 'dark';

    document.documentElement.setAttribute('data-theme', selected);

    try {
      localStorage.setItem(this.sessionThemeKey, selected);
    } catch (e) {
      console.error('Error saving theme preference', e);
    }

    if (showToast && window.Notifications) {
      const labels = { dark: 'Dark Mode', light: 'Light Mode', eyecare: 'Eye Protection Warm Mode' };
      Notifications.toast(`Theme set to ${labels[selected]}`, 'success');
    }
  }

  toggleEyeCareTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'eyecare' ? 'dark' : 'eyecare';
    this.setTheme(next, true);
  }

  initSplashScreen() {
    setTimeout(() => {
      const splash = document.getElementById('edunexus-splash-screen');
      if (splash) {
        splash.classList.add('fade-out');
        setTimeout(() => {
          if (splash && splash.parentNode) {
            splash.parentNode.removeChild(splash);
          }
        }, 500);
      }
    }, 750);
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
      if (e.key === 'Escape') {
        if (window.Notifications) Notifications.closeModal();
        this.closeProfileDropdown();
      }
    });

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
