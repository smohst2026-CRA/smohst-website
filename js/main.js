/* ====================================================
   main.js - core interactions for SMO HST website
   - Mobile menu toggle
   - Language switcher (TH / EN)
   - News filter
   - Active link highlight
   ==================================================== */

(function () {
  'use strict';

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      nav.classList.toggle('open');
      const icon = menuBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });
    // close on link click (mobile + tablet/iPad — ตรงกับ breakpoint เมนู drawer ≤1024px)
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
          nav.classList.remove('open');
          const icon = menuBtn.querySelector('i');
          if (icon) { icon.classList.add('fa-bars'); icon.classList.remove('fa-xmark'); }
        }
      });
    });
  }

  /* ---------- Language switcher ---------- */
  // Persisted via localStorage; default = th
  const stored = localStorage.getItem('smo_lang');
  const defaultLang = stored === 'en' ? 'en' : 'th';
  setLang(defaultLang);

  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang-btn');
      setLang(lang);
      localStorage.setItem('smo_lang', lang);
    });
  });

  function setLang(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'th');
    document.querySelectorAll('[data-lang-btn]').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-lang-btn') === lang);
    });
  }

  /* ---------- News filter (news.html) ---------- */
  const filterBox = document.getElementById('newsFilter');
  const newsList = document.getElementById('newsList');
  if (filterBox && newsList) {
    filterBox.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-cat]');
      if (!btn) return;
      filterBox.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat');
      newsList.querySelectorAll('.news-card').forEach(card => {
        const c = card.getAttribute('data-cat');
        card.style.display = (cat === 'all' || cat === c) ? '' : 'none';
      });
    });
  }

  /* ---------- Smooth scroll & active highlight on scroll (optional) ---------- */
  // Highlight nav according to current page
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href === path) a.classList.add('active');
  });

  /* ---------- Hero Slideshow — runs at multiple lifecycle hooks for reliability ---------- */
  function initHeroSlider() {
    const slider = document.getElementById('heroSlider');
    if (!slider) return;
    if (slider.dataset.initialized === '1') return; // already running
    slider.dataset.initialized = '1';

    const slides = slider.querySelectorAll('.hero-slide');
    const dots = slider.querySelectorAll('.hero-dot');
    const prev = slider.querySelector('.hero-prev');
    const next = slider.querySelector('.hero-next');
    const bar = slider.querySelector('.hero-progress-bar');
    const INTERVAL = 6000;

    if (slides.length < 2) return;

    let current = 0;
    slides.forEach((s, i) => { if (s.classList.contains('active')) current = i; });

    function show(idx) {
      idx = ((idx % slides.length) + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('active', i === idx));
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      current = idx;
      if (bar) {
        bar.style.transition = 'none';
        bar.style.width = '0%';
        void bar.offsetWidth;
        bar.style.transition = 'width ' + INTERVAL + 'ms linear';
        bar.style.width = '100%';
      }
    }

    // Start progress bar growing right away
    if (bar) {
      bar.style.transition = 'none';
      bar.style.width = '0%';
      setTimeout(() => {
        bar.style.transition = 'width ' + INTERVAL + 'ms linear';
        bar.style.width = '100%';
      }, 50);
    }

    // The actual auto-rotate engine — uses both setInterval AND a watchdog
    let lastTick = Date.now();
    setInterval(() => {
      // advance only if at least INTERVAL has passed AND tab is visible
      if (document.hidden) { lastTick = Date.now(); return; }
      if (Date.now() - lastTick >= INTERVAL) {
        show(current + 1);
        lastTick = Date.now();
      }
    }, 500);

    // Manual nav resets the timer
    function manual(idx) {
      show(idx);
      lastTick = Date.now();
    }
    dots.forEach((d, i) => d.addEventListener('click', (e) => { e.preventDefault(); manual(i); }));
    prev && prev.addEventListener('click', (e) => { e.preventDefault(); manual(current - 1); });
    next && next.addEventListener('click', (e) => { e.preventDefault(); manual(current + 1); });

    // Touch swipe
    let tx = 0;
    slider.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 50) manual(dx < 0 ? current + 1 : current - 1);
    });
  }

  // Run init from multiple entry points so it can't be missed
  initHeroSlider();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroSlider);
  }
  window.addEventListener('load', initHeroSlider);

  /* ---------- Reveal on scroll (basic) ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.style.opacity = 1;
          en.target.style.transform = 'translateY(0)';
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.news-card, .activity-card, .service-card, .channel-card, .team-card, .system-card').forEach(el => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity .55s ease, transform .55s ease';
      io.observe(el);
    });
  }
})();
