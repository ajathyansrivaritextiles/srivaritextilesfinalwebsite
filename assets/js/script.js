/* ═══════════════════════════════════════════════════════════
   AJATHYAN SRI VARI TEXTILES — Main JavaScript
   All interactions: nav, FAQ, gallery lightbox, form, scroll
════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── STICKY NAV SHADOW ─────────────────────────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ── HAMBURGER MOBILE MENU ──────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navDropdowns = document.querySelectorAll('.nav-dropdown > a');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });
  }
  
  navDropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const parent = dropdown.parentElement;
        const isOpen = parent.classList.toggle('open');
        dropdown.setAttribute('aria-expanded', isOpen);
      }
    });
  });

  /* ── ACTIVE NAV LINK ────────────────────────────────────── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || href.endsWith(currentPath))) {
      link.classList.add('active');
    }
  });

  /* ── FAQ ACCORDION ──────────────────────────────────────── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      
      // close all
      document.querySelectorAll('.faq-item').forEach(el => {
        el.classList.remove('open');
        const q = el.querySelector('.faq-q');
        if (q) q.setAttribute('aria-expanded', 'false');
      });
      
      // toggle current
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    // Keyboard accessibility for FAQ
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  /* ── PRODUCT FILTER TABS ────────────────────────────────── */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const productCards = document.querySelectorAll('.product-card[data-category]');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.filter;
      productCards.forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ── GALLERY LIGHTBOX ───────────────────────────────────── */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const galleryItems = document.querySelectorAll('.gallery-item[data-src]');
  let currentIndex = 0;

  function openLightbox(index) {
    if (!lightbox || !lightboxImg || !galleryItems.length) return;
    currentIndex = index;
    lightboxImg.src = galleryItems[currentIndex].dataset.src;
    lightboxImg.alt = galleryItems[currentIndex].dataset.alt || 'Gallery image';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    lightboxImg.src = galleryItems[currentIndex].dataset.src;
    lightboxImg.alt = galleryItems[currentIndex].dataset.alt || '';
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    lightboxImg.src = galleryItems[currentIndex].dataset.src;
    lightboxImg.alt = galleryItems[currentIndex].dataset.alt || '';
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
    item.addEventListener('keydown', e => { if (e.key === 'Enter') openLightbox(i); });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
  });
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev)  lightboxPrev.addEventListener('click', showPrev);
  if (lightboxNext)  lightboxNext.addEventListener('click', showNext);
  if (lightbox) {
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  }
  document.addEventListener('keydown', e => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  /* ── CONTACT FORM ───────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const fields = [
        { id: 'fname', errId: 'fnameErr', msg: 'Please enter your name.' },
        { id: 'fphone', errId: 'fphoneErr', msg: 'Please enter a valid phone number.', pattern: /^[6-9]\d{9}$/ },
        { id: 'fmessage', errId: 'fmessageErr', msg: 'Please enter your message.' },
      ];

      fields.forEach(f => {
        const input = document.getElementById(f.id);
        const err = document.getElementById(f.errId);
        if (!input) return;
        const val = input.value.trim();
        let ok = val.length > 0;
        if (f.pattern) ok = f.pattern.test(val);
        if (err) {
          err.textContent = f.msg;
          err.classList.toggle('show', !ok);
        }
        if (!ok) { valid = false; if (!valid) input.focus(); }
      });

      if (valid) {
        window.location.href = 'thank-you.html';
      }
    });
  }

  /* ── LAZY LOAD IMAGES ───────────────────────────────────── */
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'));
    }
  });

  /* ── SMOOTH BACK-TO-TOP on 404 ──────────────────────────── */
  const backTop = document.getElementById('backToTop');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.style.display = window.scrollY > 300 ? 'inline-block' : 'none';
    }, { passive: true });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── COUNTERS ANIMATION (trust stats) ──────────────────── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target || el.textContent, 10);
    if (isNaN(target)) return;
    let start = 0;
    const duration = 1600;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { start = target; clearInterval(timer); }
      el.textContent = Math.floor(start) + (el.dataset.suffix || '');
    }, step);
  }

  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
  }

  /* ── HERO PARALLAX (subtle) ─────────────────────────────── */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && window.matchMedia('(min-width: 769px)').matches) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroBg.style.transform = `translateY(${y * 0.25}px)`;
    }, { passive: true });
  }

  /* ── HERO IMAGE SLIDER ──────────────────────────────────── */
  const sliderTrack = document.getElementById('sliderTrack');
  if (sliderTrack) {
    const slides    = sliderTrack.querySelectorAll('.slide');
    const dots      = document.querySelectorAll('.slider-dot');
    const prevBtn   = document.getElementById('sliderPrev');
    const nextBtn   = document.getElementById('sliderNext');
    let current     = 0;
    let autoTimer   = null;
    const total     = slides.length;

    function goTo(n) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      dots[current].setAttribute('aria-selected', 'false');
      current = (n + total) % total;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
      dots[current].setAttribute('aria-selected', 'true');
      sliderTrack.style.transform = 'translateX(-' + (current * 100) + '%)';
    }

    function startAuto() {
      autoTimer = setInterval(() => goTo(current + 1), 5000);
    }

    function stopAuto() {
      clearInterval(autoTimer);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
    });

    const sliderEl = document.getElementById('heroSlider');
    // Pause only while hovering the small nav controls, not the whole banner —
    // pausing on the whole hero meant autoplay stopped as soon as the mouse
    // rested anywhere near the top of the page.
    [prevBtn, nextBtn, ...dots].forEach(el => {
      if (!el) return;
      el.addEventListener('mouseenter', stopAuto);
      el.addEventListener('mouseleave', startAuto);
    });

    // Touch swipe support
    let touchStartX = 0;
    if (sliderEl) {
      sliderEl.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
      sliderEl.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { stopAuto(); goTo(diff > 0 ? current + 1 : current - 1); startAuto(); }
      }, { passive: true });
    }

    startAuto();
  }


})();
