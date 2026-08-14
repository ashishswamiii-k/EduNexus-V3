/* ============================================================
   EDUNEXUS — INTERACTIVE ANIMATIONS & CURSOR EFFECTS
   ============================================================ */

class AnimationController {
  constructor() {
    this.spotlightEl = null;
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.initCursorSpotlight();
      this.initMagneticElements();
      this.initLetterEffects();
    });
  }

  initCursorSpotlight() {
    // Check reduced motion or mobile screen
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 768) {
      return;
    }

    if (!document.getElementById('cursor-spotlight')) {
      this.spotlightEl = document.createElement('div');
      this.spotlightEl.id = 'cursor-spotlight';
      this.spotlightEl.className = 'cursor-spotlight';
      document.body.appendChild(this.spotlightEl);
    } else {
      this.spotlightEl = document.getElementById('cursor-spotlight');
    }

    window.addEventListener('mousemove', (e) => {
      if (this.spotlightEl) {
        this.spotlightEl.style.left = `${e.clientX}px`;
        this.spotlightEl.style.top = `${e.clientY}px`;
      }
    });
  }

  initMagneticElements() {
    document.querySelectorAll('.magnetic-target').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.15;
        const deltaY = (e.clientY - centerY) * 0.15;

        // Cap maximum offset to 6px
        const limitedX = Math.max(-6, Math.min(6, deltaX));
        const limitedY = Math.max(-6, Math.min(6, deltaY));

        el.style.transform = `translate(${limitedX}px, ${limitedY}px) scale(1.05)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0px, 0px) scale(1)';
      });
    });
  }

  initLetterEffects() {
    document.querySelectorAll('.letter-split').forEach((container) => {
      const text = container.textContent.trim();
      container.innerHTML = '';
      [...text].forEach((char) => {
        const span = document.createElement('span');
        span.className = 'brand-letter';
        span.textContent = char === ' ' ? '\u00A0' : char;
        
        span.addEventListener('mouseenter', () => {
          span.style.transform = 'scale(1.25) translateY(-3px)';
          span.style.color = 'var(--accent-cyan)';
        });
        span.addEventListener('mouseleave', () => {
          span.style.transform = 'scale(1) translateY(0)';
          span.style.color = '';
        });
        
        container.appendChild(span);
      });
    });
  }
}

const Animations = new AnimationController();
window.Animations = Animations;
