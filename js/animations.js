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
      this.initScrollReveal();
    });
  }

  initCursorSpotlight() {
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
        requestAnimationFrame(() => {
          this.spotlightEl.style.left = `${e.clientX}px`;
          this.spotlightEl.style.top = `${e.clientY}px`;
        });
      }
    });
  }

  /**
   * Scoped Subtle Parallax for Central Hero Graphic (Capped at 2-3px)
   */
  initMagneticElements() {
    if (window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Scope parallax strictly to central hero illustration
    const heroGraphic = document.querySelector('.hero-main-illustration');
    if (heroGraphic) {
      const container = document.querySelector('.hero-visual-container');
      if (container) {
        container.addEventListener('mousemove', (e) => {
          const rect = container.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          // Strictly capped 2px-3px movement
          const deltaX = (e.clientX - centerX) * 0.015;
          const deltaY = (e.clientY - centerY) * 0.015;

          const limitedX = Math.max(-3, Math.min(3, deltaX));
          const limitedY = Math.max(-3, Math.min(3, deltaY));

          heroGraphic.style.transform = `translate(-50%, -50%) translate(${limitedX}px, ${limitedY}px)`;
        });

        container.addEventListener('mouseleave', () => {
          heroGraphic.style.transform = 'translate(-50%, -50%) translateY(0px)';
        });
      }
    }
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

  initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el));
  }

  /**
   * Eased Number Counter (0 -> Target value)
   */
  animateCountUp(element, target, duration = 1000, suffix = '') {
    if (!element) return;
    let startTimestamp = null;
    const startValue = 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easedProgress * (target - startValue) + startValue);

      element.textContent = `${current}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = `${target}${suffix}`;
      }
    };

    requestAnimationFrame(step);
  }
}

const Animations = new AnimationController();
window.Animations = Animations;
