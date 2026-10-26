/* DignaStudio static site — interactions */

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Header: white background after scrolling ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }


  /* ---------- Fullscreen menu ---------- */
  const burger = document.querySelector('.hamburger');
  const menu = document.querySelector('.site-menu');
  let menuTimer = null;
  const setMenu = open => {
    if (menu) menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) {
      clearTimeout(menuTimer);
      menu && menu.classList.remove('closing');
      document.body.classList.add('menu-open');
    } else if (document.body.classList.contains('menu-open')) {
      // close like the original: dark panel wipes up, revealing the page behind
      menu && menu.classList.add('closing');
      menuTimer = setTimeout(() => {
        document.body.classList.remove('menu-open');
        menu && menu.classList.remove('closing');
      }, 450);
    }
  };
  const closeMenu = () => setMenu(false);
  if (burger) {
    burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- Anchor links: jump within the page, close the menu ---------- */
  const jumpTo = hash => {
    const target = document.getElementById(hash.slice(1));
    if (!target) return false;
    const y = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top: y, behavior: 'smooth' });
    setTimeout(() => window.dispatchEvent(new Event('scroll')), 400);
    return true;
  };
  document.querySelectorAll('a[href*="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const url = new URL(a.getAttribute('href'), location.href);
      const samePage = url.pathname === location.pathname;
      const hash = url.hash;
      closeMenu();
      if (samePage && hash) {
        if (jumpTo(hash)) e.preventDefault();
      }
    });
  });
  if (location.hash) setTimeout(() => jumpTo(location.hash), 80);

  /* ---------- Reveal on scroll ---------- */
  let countSweep = () => {};
  /* IntersectionObserver for the smooth case, plus a sweep fallback that catches
     elements skipped by instant jumps (anchor links, keyboard End, fast scrolling). */
  const reveals = document.querySelectorAll('.reveal');
  const sweep = () => {
    const line = window.scrollY + window.innerHeight + 80;
    reveals.forEach(el => {
      if (!el.classList.contains('in') && el.getBoundingClientRect().top + window.scrollY < line) {
        el.classList.add('in');
      }
    });
    countSweep();
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); sweep(); }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 40px 0px' });
  reveals.forEach(el => io.observe(el));
  window.addEventListener('scroll', sweep, { passive: true });
  window.addEventListener('resize', sweep);
  window.addEventListener('hashchange', () => setTimeout(sweep, 60));
  sweep();
  setInterval(sweep, 900); // safety net: stops once everything is revealed (cheap check)

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  countSweep = () => counters.forEach(el => {
    if (el.dataset.done) return;
    if (el.getBoundingClientRect().top < window.innerHeight + 80) startCount(el);
  });
  function startCount(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const target = parseInt(el.dataset.count, 10);
    const prefix = el.dataset.prefix || '';
    const dur = 1400;
    const t0 = performance.now();
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  const cio = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) countSweep(); }, { threshold: .3 });
  counters.forEach(el => cio.observe(el));
  window.addEventListener('scroll', countSweep, { passive: true });

  /* ---------- YouTube cover cards: load player on click ---------- */
  document.querySelectorAll('.yt-card').forEach(card => {
    const load = () => {
      const id = card.dataset.yt;
      card.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1" title="Video player" style="position:absolute;inset:0;width:100%;height:100%;border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    };
    card.addEventListener('click', load);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); load(); } });
  });

  /* ---------- UGC carousel: drag to scroll ---------- */
  const carousel = document.querySelector('.ugc-carousel');
  if (carousel) {
    let down = false, startX = 0, startScroll = 0;
    carousel.addEventListener('pointerdown', e => {
      down = true; startX = e.clientX; startScroll = carousel.scrollLeft;
      carousel.setPointerCapture(e.pointerId);
    });
    carousel.addEventListener('pointermove', e => {
      if (down) carousel.scrollLeft = startScroll - (e.clientX - startX);
    });
    ['pointerup', 'pointercancel'].forEach(ev =>
      carousel.addEventListener(ev, () => { down = false; }));
  }

  /* ---------- Contact form ---------- */
  const form = document.querySelector('.contact-form form');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const status = form.querySelector('.form-status');
      const btn = form.querySelector('button[type="submit"]') || form.querySelector('button');
      const data = new FormData(form);
      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = 'Sending…'; }
      try {
        const res = await fetch('https://formsubmit.co/ajax/digna.lambrichtsx@gmail.com', {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' }
        });
        const out = await res.json().catch(() => ({}));
        if (res.ok) {
          form.reset();
          status.style.display = 'block';
          status.style.color = '#9fe0a8';
          status.textContent = 'Thanks — your message is on its way. I\u2019ll get back to you soon!';
        } else {
          throw new Error(out.message || 'send failed');
        }
      } catch (err) {
        status.style.display = 'block';
        status.style.color = '#e8a09a';
        status.textContent = 'Something went wrong — please email me directly at digna.lambrichtsx@gmail.com.';
      }
      if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || 'Submit'; }
    });
  }
});
