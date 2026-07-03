(() => {
  // Year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const open = mainNav.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });
    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Header shadow on scroll
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');
  // Revelar la barra en el primer scroll (cualquier dirección) y dejarla fija para siempre
  let headerRevealed = false;
  const revealHeader = () => {
    if (headerRevealed || !header) return;
    if (window.scrollY > 0) {
      header.classList.add('header-shown');
      headerRevealed = true;
      window.removeEventListener('scroll', revealHeader);
    }
  };
  window.addEventListener('scroll', revealHeader, { passive: true });
  revealHeader();

  const onScroll = () => {
    const scrolled = window.scrollY > 12;
    if (header) header.style.boxShadow = scrolled ? '0 6px 20px rgba(15,23,42,.06)' : 'none';
    if (backToTop) backToTop.classList.toggle('show', window.scrollY > 600);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
    // Safety net: if an element never intersects (edge cases with resize,
    // bfcache restores, etc.), force it visible so content can't get stuck hidden.
    setTimeout(() => {
      revealEls.forEach((el) => el.classList.add('in-view'));
    }, 2500);
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  // Tabs
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      tabButtons.forEach((b) => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', String(b === btn));
      });
      tabContents.forEach((c) => {
        c.classList.toggle('active', c.getAttribute('data-tab-content') === target);
      });
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach((item) => {
    const q = item.querySelector('.faq-q');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach((openItem) => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Animated stat counters
  const statEls = document.querySelectorAll('.stat-num');
  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window && statEls.length) {
    const statIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statEls.forEach((el) => statIo.observe(el));
  }
})();
