(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const prefersReduced = () => reduceMotion.matches;

  /* Header + floating WhatsApp -------------------------------------------- */
  const header = document.getElementById('site-header');
  const waFloat = document.querySelector('.wa-float');
  const suppressedFloats = new Set();
  let scrollTicking = false;

  const updateFloat = () => {
    if (!waFloat) return;
    waFloat.classList.toggle('is-visible', window.scrollY > 620 && suppressedFloats.size === 0);
  };

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 30);
    updateFloat();
    scrollTicking = false;
  };

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  if (waFloat && 'IntersectionObserver' in window) {
    const floatObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) suppressedFloats.add(entry.target);
        else suppressedFloats.delete(entry.target);
      });
      updateFloat();
    }, { threshold: 0.05 });
    [document.getElementById('contacto'), document.querySelector('.footer')]
      .filter(Boolean)
      .forEach((el) => floatObserver.observe(el));
  }

  /* Mobile menu ------------------------------------------------------------ */
  const menu = document.getElementById('mobile-menu');
  const menuToggle = document.querySelector('.menu-toggle');
  const menuLinks = menu ? [...menu.querySelectorAll('a[href^="#"]')] : [];
  let lastFocused = null;

  const setMenu = (open) => {
    if (!menu || !menuToggle) return;
    document.body.classList.toggle('menu-open', open);
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    menu.inert = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');

    if (open) {
      lastFocused = document.activeElement;
      const first = menu.querySelector('.mobile-menu__nav a');
      if (first) setTimeout(() => first.focus(), 120);
    } else if (lastFocused) {
      lastFocused.focus();
      lastFocused = null;
    }
  };

  if (menu) menu.inert = true;

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') !== 'true';
      setMenu(open);
    });
  }

  menuLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      setMenu(false);
      setTimeout(() => {
        target.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' });
      }, 40);
    });
  });

  if (menu) {
    menu.addEventListener('click', (event) => {
      if (event.target === menu) setMenu(false);
    });
    menu.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setMenu(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const focusables = [menuToggle, ...menu.querySelectorAll('a[href], button:not([disabled])')].filter(Boolean);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('menu-open')) setMenu(false);
  });

  /* Reveal on scroll ------------------------------------------------------- */
  const revealEls = [...document.querySelectorAll('.reveal')];
  if (prefersReduced() || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-in'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* Videos ----------------------------------------------------------------- */
  const videos = [...document.querySelectorAll('video')];

  if (prefersReduced()) {
    const hero = document.getElementById('heroVideo');
    if (hero) hero.pause();
  }

  /* Pillars tabs ----------------------------------------------------------- */
  const tabs = [...document.querySelectorAll('[role="tab"][data-pillar]')];
  const panels = [...document.querySelectorAll('.pillar-panel')];
  const stage = document.querySelector('.pillars__stage');
  let stageInView = true;

  if (stage && 'IntersectionObserver' in window) {
    const stageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        stageInView = entry.isIntersecting;
        const activeVideo = panels.find((p) => p.classList.contains('is-active'))?.querySelector('video');
        if (activeVideo) {
          if (entry.isIntersecting && !prefersReduced()) activeVideo.play().catch(() => {});
          else activeVideo.pause();
        }
      });
    }, { threshold: 0.25 });
    stageObserver.observe(stage);
  }

  const activatePillar = (index, focusTab = false) => {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focusTab) tab.focus();
    });

    panels.forEach((panel, i) => {
      const active = i === index;
      panel.classList.toggle('is-active', active);
      panel.setAttribute('aria-hidden', String(!active));
      const video = panel.querySelector('video');
      if (video) {
        if (active && stageInView && !prefersReduced()) video.play().catch(() => {});
        else video.pause();
      }
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activatePillar(index));
    tab.addEventListener('keydown', (event) => {
      const last = tabs.length - 1;
      let next = null;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = index === last ? 0 : index + 1;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = last;
      if (next === null) return;
      event.preventDefault();
      activatePillar(next, true);
    });
  });

  if (tabs.length) activatePillar(0);

  /* Scroll spy ------------------------------------------------------------- */
  const spyLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
  const spySections = spyLinks
    .map((link) => document.getElementById(link.getAttribute('href').slice(1)))
    .filter(Boolean);

  const clearSpy = () => {
    document.querySelectorAll('.nav a.is-active, .mobile-menu__nav a.is-active').forEach((a) => {
      a.classList.remove('is-active');
      a.removeAttribute('aria-current');
    });
  };

  const setSpy = (id) => {
    document.querySelectorAll(`a[href="#${id}"]`).forEach((a) => {
      if (a.closest('.nav') || a.closest('.mobile-menu__nav')) {
        a.classList.add('is-active');
        a.setAttribute('aria-current', 'location');
      }
    });
  };

  if ('IntersectionObserver' in window && spySections.length) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        clearSpy();
        setSpy(entry.target.id);
      });
    }, { rootMargin: '-42% 0px -52% 0px', threshold: 0 });
    spySections.forEach((section) => spyObserver.observe(section));
  }


  /* Visibility: stop background video work when tab is hidden -------------- */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      videos.forEach((v) => v.pause());
      return;
    }
    const hero = document.getElementById('heroVideo');
    if (hero && !prefersReduced()) hero.play().catch(() => {});
    const activePillar = panels.find((p) => p.classList.contains('is-active'))?.querySelector('video');
    if (activePillar && stageInView && !prefersReduced()) activePillar.play().catch(() => {});
  });

  /* Contact form → WhatsApp ------------------------------------------------ */
  const form = document.getElementById('contact-form');
  if (form) {
    const nameInput = form.elements.namedItem('name');
    const note = form.querySelector('.contact-form__note');
    const defaultNote = note ? note.textContent : '';

    nameInput.addEventListener('input', () => {
      nameInput.closest('.field').classList.remove('is-invalid');
      nameInput.removeAttribute('aria-invalid');
      if (note) note.textContent = defaultNote;
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = nameInput.value.trim();

      if (!name) {
        nameInput.closest('.field').classList.add('is-invalid');
        nameInput.setAttribute('aria-invalid', 'true');
        nameInput.focus();
        if (note) note.textContent = 'Necesitamos tu nombre para preparar el mensaje.';
        return;
      }

      const interest = form.elements.namedItem('interest').value;
      const message = form.elements.namedItem('message').value.trim();
      let text = `Hola, soy ${name}. Me interesa ${interest}.`;
      if (message) text += ` ${message}`;

      const url = `https://wa.me/59169535546?text=${encodeURIComponent(text)}`;
      const opened = window.open(url, '_blank', 'noopener');
      if (!opened) window.location.href = url;
      if (note) note.textContent = 'Abrimos WhatsApp con tu mensaje listo. Si no se abrió, escribinos al +591 69535546.';
    });
  }

  /* Footer year ------------------------------------------------------------ */
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

})();
