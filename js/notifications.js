/* ============================================================
   EDUNEXUS — TOAST NOTIFICATIONS & MODAL MANAGER
   ============================================================ */

class NotificationManager {
  constructor() {
    this.container = null;
    this.initContainer();
  }

  initContainer() {
    if (!document.getElementById('toast-container')) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    } else {
      this.container = document.getElementById('toast-container');
    }
  }

  toast(message, type = 'success', duration = 3500) {
    this.initContainer();

    const toastEl = document.createElement('div');
    toastEl.className = `toast toast-${type}`;

    let icon = '✓';
    if (type === 'error') icon = '✕';
    if (type === 'warning') icon = '⚠';

    toastEl.innerHTML = `
      <span style="font-weight: 700; font-size: 1.1rem;">${icon}</span>
      <span style="flex: 1;">${message}</span>
    `;

    this.container.appendChild(toastEl);

    // Trigger animation
    requestAnimationFrame(() => {
      toastEl.classList.add('show');
    });

    setTimeout(() => {
      toastEl.classList.remove('show');
      setTimeout(() => {
        if (toastEl.parentNode) {
          toastEl.parentNode.removeChild(toastEl);
        }
      }, 300);
    }, duration);
  }

  openModal(title, bodyHtml, footerButtonsHtml = '') {
    let overlay = document.getElementById('app-modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'app-modal-overlay';
      overlay.className = 'modal-overlay';
      document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
      <div class="modal-container animate-fade-in">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button class="modal-close" onclick="Notifications.closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          ${bodyHtml}
        </div>
        ${footerButtonsHtml ? `<div class="modal-footer">${footerButtonsHtml}</div>` : ''}
      </div>
    `;

    overlay.classList.add('active');
  }

  closeModal() {
    const overlay = document.getElementById('app-modal-overlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
  }
}

const Notifications = new NotificationManager();
window.Notifications = Notifications;
