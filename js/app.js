/* ============================================================
   EDUNEXUS — MASTER APPLICATION ENTRYPOINT & INITIALIZER
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  console.log('EduNexus Platform Initializing...');

  // 1. Splash Screen Transition
  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      splash.classList.add('fade-out');
      setTimeout(() => {
        splash.style.display = 'none';
      }, 500);
    }
  }, 1200);

  // 2. Initialize Routing
  Router.handleRouting();

  // 3. Sidebar Toggle Listener
  const toggleBtn = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('app-sidebar');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      if (window.innerWidth < 768) {
        sidebar.classList.toggle('mobile-open');
      } else {
        sidebar.classList.toggle('collapsed');
      }
    });
  }
});
