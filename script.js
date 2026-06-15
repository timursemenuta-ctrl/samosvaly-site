// ============================================
//   СПЕЦТЕХ — script.js
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // ---- INTRO LOGO ANIMATION ----
  function initIntroAnimation() {
    const storageKey = 'spectehIntroPlayed';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || sessionStorage.getItem(storageKey) === '1') {
      return;
    }

    sessionStorage.setItem(storageKey, '1');

    const intro = document.createElement('div');
    intro.className = 'site-intro';
    intro.setAttribute('aria-hidden', 'true');
    intro.innerHTML = `
      <div class="site-intro__grid"></div>
      <div class="site-intro__sparks">
        <span></span><span></span><span></span><span></span><span></span>
      </div>
      <div class="site-intro__logo-mark">
        <div class="site-intro__gear">
          <span></span><span></span><span></span><span></span>
        </div>
        <div class="site-intro__blade"></div>
      </div>
      <div class="site-intro__brand">&#1057;&#1055;&#1045;&#1062;&#1058;&#1045;&#1061;</div>
      <div class="site-intro__tagline">&#1054;&#1056;&#1045;&#1053;&#1044;&#1040; &#1057;&#1055;&#1045;&#1062;&#1058;&#1045;&#1061;&#1053;&#1030;&#1050;&#1048;</div>
    `;

    document.body.classList.add('intro-lock');
    document.body.prepend(intro);

    const finishIntro = () => {
      intro.classList.add('hide');
      setTimeout(() => {
        document.body.classList.remove('intro-lock');
        intro.remove();
      }, 750);
    };

    setTimeout(finishIntro, 3800);
  }

  initIntroAnimation();

  // ---- HEADER SCROLL ----
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // ---- BURGER MENU ----
  const burger = document.querySelector('.burger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
    // close on link click
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }

  // ---- ACTIVE NAV LINK ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href === currentPage) link.classList.add('active');
    if (currentPage === '' && href === 'index.html') link.classList.add('active');
  });

  // ---- HERO SLIDER ----
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.dot');
  let current = 0, timer;

  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function startAuto() {
    timer = setInterval(() => goTo(current + 1), 4500);
  }

  if (slides.length > 1) {
    startAuto();
    dots.forEach((dot, i) => dot.addEventListener('click', () => { clearInterval(timer); goTo(i); startAuto(); }));
    document.querySelector('.slider-arrow.prev')?.addEventListener('click', () => { clearInterval(timer); goTo(current - 1); startAuto(); });
    document.querySelector('.slider-arrow.next')?.addEventListener('click', () => { clearInterval(timer); goTo(current + 1); startAuto(); });
  }

  // ---- SCROLL REVEAL ----
  const revealEls = document.querySelectorAll('.card, .feature-box, .service-item, .contact-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  // ---- CONTACT FORM ----
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const successEl = document.getElementById('formSuccess');

      const originalText = btn.textContent;
      btn.textContent = 'Надсилання...';
      btn.disabled = true;

      const formData = new FormData(form);
      formData.set('access_key', 'e816ac76-cb30-42af-9adc-ccc94c6c20f9');
      formData.set('subject', 'Заявка з сайту СпецТех');
      formData.set('from_name', 'СпецТех');
      formData.set('page', window.location.href);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });

        const result = await response.json();

        if (result.success) {
          form.style.display = 'none';
          if (successEl) {
            successEl.classList.add('show');
          }
        } else {
          alert(result.message || 'Помилка відправки');
          btn.disabled = false;
          btn.textContent = originalText;
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Помилка відправки. Спробуйте ще раз.');
        btn.disabled = false;
        btn.textContent = originalText;
      }
    });
  }

  // ---- SMOOTH ANCHOR SCROLL ----
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

  // ---- COUNTER ANIMATION ----
  const counters = document.querySelectorAll('.stat-num[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        let start = 0;
        const step = target / 60;
        const interval = setInterval(() => {
          start += step;
          if (start >= target) {
            el.textContent = target + suffix;
            clearInterval(interval);
          } else {
            el.textContent = Math.floor(start) + suffix;
          }
        }, 25);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

});
