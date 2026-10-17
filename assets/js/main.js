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
  if (burger) {
    burger.addEventListener('click', () => {
      document.body.classList.toggle('menu-open');
      // stagger menu links
      document.querySelectorAll('.site-menu .menu-link').forEach((a, i) => {
        a.style.transitionDelay = document.body.classList.contains('menu-open')
          ? (80 + i * 60) + 'ms' : '0ms';
      });
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') document.body.classList.remove('menu-open');
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const cio = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
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
      cio.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => cio.observe(el));

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
