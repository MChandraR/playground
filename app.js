/**
 * Playground - Interactive Web Experience Logic
 * Author: Muhammad Chandra Ramadhan (@MChandraR)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Toast Notification Manager
  // -------------------------------------------------------------------------
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, icon = '✦') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }

  // -------------------------------------------------------------------------
  // 2. Dark / Light Theme Toggle
  // -------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const htmlRoot = document.documentElement;

  // Restore saved theme or default to dark
  const savedTheme = localStorage.getItem('playground-theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('playground-theme', newTheme);
      showToast(`Tema diubah ke ${newTheme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}`);
    });
  }

  // -------------------------------------------------------------------------
  // 3. Mobile Navigation Menu Toggle
  // -------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const primaryNav = document.getElementById('primary-nav');

  if (mobileMenuBtn && primaryNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      primaryNav.classList.toggle('open');
    });

    // Close menu when a link is clicked
    primaryNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // -------------------------------------------------------------------------
  // 4. Hero Card Telemetry Pulse Simulation
  // -------------------------------------------------------------------------
  const pulseTriggerBtn = document.getElementById('btn-pulse-telemetry');
  const latencyChip = document.getElementById('latency-chip');
  const metricEfficiency = document.getElementById('metric-efficiency');
  const heroWidgetCard = document.getElementById('hero-widget-card');

  if (pulseTriggerBtn) {
    pulseTriggerBtn.addEventListener('click', () => {
      // Add subtle ripple / bounce effect
      heroWidgetCard?.classList.add('pulsing');
      
      // Generate realistic jitter
      const randomLatency = Math.floor(Math.random() * 8) + 8; // 8ms - 16ms
      const randomEff = (99.7 + Math.random() * 0.29).toFixed(1);

      if (latencyChip) {
        latencyChip.textContent = `${randomLatency}ms response`;
      }
      if (metricEfficiency) {
        metricEfficiency.textContent = `${randomEff}%`;
      }

      showToast(`Telemetry pulse disinkronkan (${randomLatency}ms latency)`, '⚡');

      setTimeout(() => {
        heroWidgetCard?.classList.remove('pulsing');
      }, 400);
    });
  }

  // -------------------------------------------------------------------------
  // 5. Interactive Sandbox: Accent Color Swatches
  // -------------------------------------------------------------------------
  const colorButtons = document.querySelectorAll('.color-btn');
  const colorMap = {
    indigo:  { h: 239, s: '84%', l: '67%' },
    emerald: { h: 160, s: '84%', l: '39%' },
    violet:  { h: 258, s: '90%', l: '66%' },
    rose:    { h: 350, s: '89%', l: '60%' },
    amber:   { h: 38,  s: '92%', l: '50%' }
  };

  colorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      colorButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const colorName = btn.getAttribute('data-color');
      const palette = colorMap[colorName];

      if (palette) {
        htmlRoot.style.setProperty('--primary-h', palette.h);
        htmlRoot.style.setProperty('--primary-s', palette.s);
        htmlRoot.style.setProperty('--primary-l', palette.l);
        showToast(`Aksen warna diubah ke ${colorName.toUpperCase()}`, '🎨');
      }
    });
  });

  // -------------------------------------------------------------------------
  // 6. Interactive Sandbox: Sliders (Radius & Blur)
  // -------------------------------------------------------------------------
  const radiusSlider = document.getElementById('radius-slider');
  const radiusVal = document.getElementById('radius-val');
  const blurSlider = document.getElementById('blur-slider');
  const blurVal = document.getElementById('blur-val');
  const previewCard = document.getElementById('sandbox-preview-card');

  if (radiusSlider && previewCard && radiusVal) {
    radiusSlider.addEventListener('input', (e) => {
      const val = `${e.target.value}px`;
      previewCard.style.borderRadius = val;
      radiusVal.textContent = val;
    });
  }

  if (blurSlider && previewCard && blurVal) {
    blurSlider.addEventListener('input', (e) => {
      const val = `${e.target.value}px`;
      previewCard.style.backdropFilter = `blur(${val})`;
      previewCard.style.webkitBackdropFilter = `blur(${val})`;
      blurVal.textContent = val;
    });
  }

  // -------------------------------------------------------------------------
  // 7. Interactive Sandbox: Counter
  // -------------------------------------------------------------------------
  const counterVal = document.getElementById('counter-value');
  const btnInc = document.getElementById('counter-increment');
  const btnDec = document.getElementById('counter-decrement');
  const btnReset = document.getElementById('counter-reset');

  let currentCount = 0;

  function updateCounter(val) {
    currentCount = val;
    if (counterVal) {
      counterVal.textContent = currentCount;
      // Micro-animation
      counterVal.style.transform = 'scale(1.25)';
      setTimeout(() => {
        counterVal.style.transform = 'scale(1)';
      }, 150);
    }
  }

  if (btnInc) btnInc.addEventListener('click', () => updateCounter(currentCount + 1));
  if (btnDec) btnDec.addEventListener('click', () => updateCounter(Math.max(0, currentCount - 1)));
  if (btnReset) btnReset.addEventListener('click', () => {
    updateCounter(0);
    showToast('Counter berhasil direset ke 0', '↺');
  });

  // -------------------------------------------------------------------------
  // 8. Sandbox Trigger Action Button
  // -------------------------------------------------------------------------
  const btnPreviewAction = document.getElementById('btn-preview-action');
  const previewEventStatus = document.getElementById('preview-event-status');

  if (btnPreviewAction && previewEventStatus) {
    btnPreviewAction.addEventListener('click', () => {
      previewEventStatus.textContent = 'Triggered! 🚀';
      previewEventStatus.style.color = 'var(--primary)';
      showToast('Live Component Event Berhasil Dipicu!', '✨');

      setTimeout(() => {
        previewEventStatus.textContent = 'Ready';
        previewEventStatus.style.color = 'var(--text-dim)';
      }, 2000);
    });
  }

  // -------------------------------------------------------------------------
  // 9. Interactive Card 3D Tilt Effect on Desktop
  // -------------------------------------------------------------------------
  const tiltCards = document.querySelectorAll('.feature-card, .hero-widget-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 992) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // Welcome Toast
  setTimeout(() => {
    showToast('Selamat datang di Playground Interactive Studio!', '👋');
  }, 600);
});
