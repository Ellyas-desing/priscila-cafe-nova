(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Menu móvel ---------- */
  const header = $('[data-header]');
  const btn = $('.menu-button');
  const nav = $('.main-nav');
  const btnLabel = $('.visually-hidden', btn);
  const setMenu = (open) => {
    header.classList.toggle('header--menu-open', open);
    nav.classList.toggle('main-nav--open', open);
    btn.setAttribute('aria-expanded', String(open));
    btnLabel.textContent = open ? 'Fechar menu' : 'Abrir menu';
  };
  btn.addEventListener('click', () => setMenu(btn.getAttribute('aria-expanded') !== 'true'));
  $$('a', nav).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));

  /* ---------- Scroll: um único rAF atualiza tudo ---------- */
  const bar = $('[data-progress]');
  const hero = $('[data-hero]');
  const story = $('[data-story]');
  const liquid = $('[data-liquid]');
  const steps = $$('[data-step]');
  const stepNum = $('[data-step-num]');
  const words = $$('.w');
  const essence = $('#essencia');
  const photo = $('[data-parallax-img]');
  let ticking = false;
  let activeStep = 0;

  const update = () => {
    ticking = false;
    const y = scrollY;
    const vh = innerHeight;

    header.classList.toggle('header--scrolled', y > vh * 0.7);
    bar.style.setProperty('--p', clamp(y / (document.body.scrollHeight - vh)).toFixed(4));

    if (!reduced) {
      hero.style.setProperty('--p', clamp(y / vh).toFixed(4));

      const r = story.getBoundingClientRect();
      const p = clamp(-r.top / (r.height - vh));
      story.style.setProperty('--p', p.toFixed(4));
      liquid.style.setProperty('--fill', clamp(p * 1.15).toFixed(3));
      const i = Math.min(steps.length - 1, Math.floor(p * steps.length));
      if (i !== activeStep) {
        activeStep = i;
        steps.forEach((s, n) => s.classList.toggle('is-active', n === i));
        stepNum.textContent = String(i + 1).padStart(2, '0');
      }

      // Texto da essência acende palavra por palavra
      if (photo) {
        const f = photo.parentElement.getBoundingClientRect();
        photo.style.setProperty('--py', (-9 * clamp((vh - f.top) / (vh + f.height))).toFixed(2));
      }
      const e = essence.getBoundingClientRect();
      const q = clamp((vh * 0.85 - e.top) / (e.height * 0.9));
      const lit = Math.round(q * words.length);
      words.forEach((w, n) => w.classList.toggle('on', n < lit));
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };

  /* ---------- Texto palavra por palavra ---------- */
  const split = $('[data-words]');
  if (split && !reduced) {
    split.setAttribute('aria-label', split.textContent.trim());
    split.innerHTML = split.textContent.trim().split(/\s+/)
      .map((w) => `<span class="w" aria-hidden="true">${w}</span>`).join(' ');
    words.push(...$$('.w'));
  }

  /* ---------- Reveal ao entrar na tela ---------- */
  const items = $$('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach((i) => i.classList.add('reveal--visible'));
  } else {
    $$('.menu-grid .reveal, .quote-grid .reveal').forEach((el, n) => el.style.setProperty('--d', `${(n % 4) * 0.09}s`));
    const io = new IntersectionObserver((list) => list.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('reveal--visible');
      io.unobserve(en.target);
    }), { threshold: 0.15 });
    items.forEach((i) => io.observe(i));
  }

  /* ---------- Cards inclinam com o mouse / botões magnéticos ---------- */
  if (fine && !reduced) {
    $$('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const b = card.getBoundingClientRect();
        card.style.setProperty('--ry', `${((e.clientX - b.left) / b.width - 0.5) * 8}deg`);
        card.style.setProperty('--rx', `${-((e.clientY - b.top) / b.height - 0.5) * 8}deg`);
      });
      card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
    });
    $$('[data-magnetic]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const b = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - b.left - b.width / 2) * 0.25}px, ${(e.clientY - b.top - b.height / 2) * 0.35}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- Vídeo: só toca visível, sem movimento reduzido / economia de dados ---------- */
  const saveData = navigator.connection && navigator.connection.saveData;
  $$('[data-video]').forEach((v) => {
    if (reduced || saveData) { v.removeAttribute('autoplay'); v.querySelectorAll('source').forEach((s) => s.remove()); v.load(); return; }
    new IntersectionObserver(([en]) => { en.isIntersecting ? v.play().catch(() => {}) : v.pause(); }, { threshold: 0.1 }).observe(v);
  });

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  $('[data-year]').textContent = new Date().getFullYear();
  update();
})();
