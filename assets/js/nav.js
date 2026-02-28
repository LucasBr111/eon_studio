/* ============================================================
   NAV.JS — EÓN Solves
   Lógica compartida de navegación y scroll reveal
   ============================================================ */

(function () {
  'use strict';

  /* ── Nav scroll → solid ── */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('solid', window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Burger / modal ── */
  const burger = document.getElementById('burger');
  const modal  = document.getElementById('nav-modal');

  if (burger && modal) {
    let open = false;

    const toggle = () => {
      open = !open;
      burger.classList.toggle('open', open);
      modal.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      modal.setAttribute('aria-hidden',    String(!open));
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    };

    burger.addEventListener('click', e => { e.stopPropagation(); toggle(); });

    document.addEventListener('click', e => {
      if (open && !modal.contains(e.target) && !burger.contains(e.target)) toggle();
    });

    modal.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => { if (open) toggle(); })
    );

    /* Cerrar con Escape */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && open) toggle();
    });
  }

  /* ── Active nav link por URL ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .nav__modal-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Scroll reveal ── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => io.observe(el));
  }

  /* ── Smooth anchor scroll (para links internos #) ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 60;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
