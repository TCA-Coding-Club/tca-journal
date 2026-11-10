// Motion helpers for the TCA Journal (ported from the design handoff).
// Every function touches window/document: call them only inside useEffect.
// Rule: content is never hidden by default — animations only play from a visible state.

const EASE = 'cubic-bezier(.2,.7,.2,1)';
const reduced = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

// True when animations may run (respects prefers-reduced-motion).
export const motionOK = () => typeof window !== "undefined" && !reduced();

const VARIANTS = {
  up: [{ opacity: 0, transform: 'translateY(26px)' }, { opacity: 1, transform: 'translateY(0)' }],
  clip: [{ opacity: 0, transform: 'translateY(30px)', clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, transform: 'translateY(0)', clipPath: 'inset(0 0 0% 0)' }],
  scale: [{ opacity: 0, transform: 'scale(1.06)' }, { opacity: 1, transform: 'scale(1)' }],
  rise: [{ opacity: 0, transform: 'translateY(60px) scale(.96)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }],
  assemble: [{ opacity: 0, transform: 'translate3d(0,120px,-260px) rotateX(28deg)', offset: 0 }],
};

export function createReveal() {
  if (typeof IntersectionObserver === 'undefined') return { scan() {}, destroy() {} };
  const play = el => {
    const kind = el.getAttribute('data-reveal') || 'up';
    const v = VARIANTS[kind] || VARIANTS.up;
    const delay = Number(el.getAttribute('data-reveal-delay') || 0);
    const duration = kind === 'clip' ? 1100 : kind === 'assemble' ? 1400 : kind === 'rise' ? 1200 : 900;
    try { el.animate(v, { duration, delay, easing: EASE, fill: 'backwards' }); } catch (e) {}
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { io.unobserve(e.target); play(e.target); }
  }), { threshold: 0.08, rootMargin: '0px 0px 60px 0px' });
  return {
    scan() {
      const vh = window.innerHeight || 800;
      document.querySelectorAll('[data-reveal]:not([data-revealed])').forEach(el => {
        el.setAttribute('data-revealed', '');
        const r = el.getBoundingClientRect();
        if (r.top < vh && r.bottom > 0) play(el); else io.observe(el);
      });
    },
    destroy() { io.disconnect(); },
  };
}

// 3D hover tilt with glare for any [data-tilt] element (value = max degrees).
export function createTilt() {
  if (!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches)) return () => {};
  let cur = null;
  const glare = el => el.querySelector(':scope > [data-glare]');
  const reset = el => {
    el.style.transition = 'transform .7s ' + EASE;
    el.style.transform = '';
    const g = glare(el); if (g) g.style.opacity = '0';
  };
  const move = e => {
    const el = e.target && e.target.closest ? e.target.closest('[data-tilt]') : null;
    if (cur && cur !== el) { reset(cur); cur = null; }
    if (!el) return;
    cur = el;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    const m = Number(el.getAttribute('data-tilt')) || 6;
    el.style.transition = 'transform .15s ease-out';
    el.style.transform = 'perspective(1000px) rotateX(' + (-py * m).toFixed(2) + 'deg) rotateY(' + (px * m).toFixed(2) + 'deg) translate3d(0,-4px,0)';
    const g = glare(el);
    if (g) {
      g.style.opacity = '1';
      g.style.background = 'radial-gradient(circle at ' + ((px + 0.5) * 100).toFixed(0) + '% ' + ((py + 0.5) * 100).toFixed(0) + '%, rgba(255,255,255,.30), rgba(255,255,255,0) 58%)';
    }
  };
  const leave = () => { if (cur) { reset(cur); cur = null; } };
  document.addEventListener('pointermove', move, { passive: true });
  document.documentElement.addEventListener('pointerleave', leave);
  return () => {
    document.removeEventListener('pointermove', move);
    document.documentElement.removeEventListener('pointerleave', leave);
  };
}

// Pointer-follow 3D stage with idle sway. base = [rotX, rotY], range = [x, y] degrees.
export function createStage(container, stage, opts = {}) {
  if (!container || !stage) return () => {};
  const base = opts.base || [6, -14];
  const range = opts.range || [8, 14];
  const still = opts.still || reduced();
  const set = (x, y) => { stage.style.transform = 'rotateX(' + (base[0] - y * range[0]).toFixed(2) + 'deg) rotateY(' + (base[1] + x * range[1]).toFixed(2) + 'deg)'; };
  if (still) { set(0, 0); return () => {}; }
  let tx = 0, ty = 0, cx = 0, cy = 0, hover = false, raf = 0;
  const t0 = performance.now();
  const onMove = e => {
    const r = container.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    hover = true;
  };
  const onLeave = () => { hover = false; };
  const loop = now => {
    const t = (now - t0) / 1000;
    const ix = hover ? tx : Math.sin(t * 0.45) * 0.4;
    const iy = hover ? ty : Math.cos(t * 0.35) * 0.3;
    cx += (ix - cx) * 0.055; cy += (iy - cy) * 0.055;
    set(cx, cy);
    raf = requestAnimationFrame(loop);
  };
  set(0, 0);
  container.addEventListener('pointermove', onMove);
  container.addEventListener('pointerleave', onLeave);
  raf = requestAnimationFrame(loop);
  return () => {
    cancelAnimationFrame(raf);
    container.removeEventListener('pointermove', onMove);
    container.removeEventListener('pointerleave', onLeave);
  };
}

// Gentle infinite float for [data-float] (value = amplitude px).
export function createFloat() {
  const anims = [];
  document.querySelectorAll('[data-float]:not([data-floating])').forEach((el, i) => {
    el.setAttribute('data-floating', '');
    const amp = Number(el.getAttribute('data-float')) || 10;
    try {
      anims.push(el.animate(
        [{ transform: 'translateY(0)' }, { transform: 'translateY(' + (-amp) + 'px)' }],
        { duration: 4200 + i * 900, direction: 'alternate', iterations: Infinity, easing: 'ease-in-out', delay: -i * 1300 }
      ));
    } catch (e) {}
  });
  return () => {
    anims.forEach(a => a.cancel());
    document.querySelectorAll("[data-floating]").forEach(el => el.removeAttribute("data-floating"));
  };
}

// Scroll parallax for [data-parallax] (value = factor). Element should be oversized inside an overflow:hidden parent.
export function createParallax() {
  let raf = 0;
  const update = () => {
    raf = 0;
    const vh = window.innerHeight;
    document.querySelectorAll('[data-parallax]').forEach(el => {
      const p = el.parentElement; if (!p) return;
      const r = p.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const k = Number(el.getAttribute('data-parallax')) || 0.08;
      const off = -(r.top + r.height / 2 - vh / 2) * k;
      el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
    });
  };
  const on = () => { if (!raf) raf = requestAnimationFrame(update); };
  window.addEventListener('scroll', on, { passive: true });
  window.addEventListener('resize', on);
  update();
  return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
}

export function createHeaderShadow(header) {
  if (!header) return () => {};
  const on = () => { header.style.boxShadow = window.scrollY > 8 ? '0 6px 24px rgba(22,27,25,.07)' : 'none'; };
  window.addEventListener('scroll', on, { passive: true });
  on();
  return () => window.removeEventListener('scroll', on);
}

export function createProgress(bar, target) {
  if (!bar || !target) return () => {};
  const on = () => {
    const r = target.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = Math.max(1, r.height - vh * 0.5);
    const p = Math.min(1, Math.max(0, (vh * 0.25 - r.top) / total));
    bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
  };
  window.addEventListener('scroll', on, { passive: true });
  window.addEventListener('resize', on);
  on();
  return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
}

// 3D orbit system: [data-planet data-ring data-phase data-slug] elements circle a [data-sun]
// on tilted rings ([data-orbit-ring data-ring], inside a container with perspective:1400px).
// Positions are projected manually (same maths as CSS perspective) so depth order is exact.
export function createOrbit(stage, opts = {}) {
  if (!stage) return { refresh() {}, destroy() {} };
  const P = 1400, R = [150, 255, 360], W = [0.22, 0.15, 0.10], SIZE = [0.82, 0.96, 1.1];
  const still = opts.still || reduced();
  const ang = [0, 0, 0];
  let planets = [], rings = [], sun = null, cap = null, s = 1, raf = 0, last = 0, hover = null, mul = 1, tx = 0, ty = 0, cx = 0, cy = 0;
  const pulses = [];
  const measure = () => {
    s = Math.max(0.36, Math.min(1, stage.clientWidth / 900));
    stage.style.height = Math.round(Math.max(250, 500 * s)) + 'px';
  };
  const draw = () => {
    const tilt = (24 - cy * 5) * Math.PI / 180, roll = (-8 + cx * 5) * Math.PI / 180;
    const st = Math.sin(tilt), ct = Math.cos(tilt), sr = Math.sin(roll), cr = Math.cos(roll);
    rings.forEach(el => {
      const r = R[+el.getAttribute('data-ring') || 0] * s;
      el.style.width = el.style.height = (2 * r).toFixed(1) + 'px';
      el.style.margin = (-r).toFixed(1) + 'px 0 0 ' + (-r).toFixed(1) + 'px';
      el.style.transform = 'rotateZ(' + (roll * 180 / Math.PI).toFixed(2) + 'deg) rotateX(' + (90 - tilt * 180 / Math.PI).toFixed(2) + 'deg)';
    });
    let hx = null, hy = 0, hr = 0;
    planets.forEach(p => {
      const a = ang[p.ring] + p.phase, r = R[p.ring] * s;
      const X = r * Math.cos(a), Zp = r * Math.sin(a);
      const y = Zp * st, z = Zp * ct;
      const x2 = X * cr - y * sr, y2 = X * sr + y * cr;
      const f = P / (P - z);
      const isH = p.el === hover;
      const match = isH || (opts.isMatch ? opts.isMatch(p.slug) : true);
      const k = f * SIZE[p.ring] * Math.max(0.5, s) * (match ? 1 : 0.7);
      p.el.style.transform = 'translate(-50%,-50%) translate(' + (x2 * f).toFixed(1) + 'px,' + (y2 * f).toFixed(1) + 'px) scale(' + k.toFixed(3) + ')';
      p.el.style.zIndex = isH ? 3000 : 1000 + Math.round(z);
      p.el.style.opacity = match ? '1' : '0.22';
      if (isH) { hx = x2 * f; hy = y2 * f; hr = 44 * k; }
    });
    // One unscaled caption, placed above planets in the lower half and below those in the upper half.
    if (cap) {
      if (hx === null) cap.style.opacity = '0';
      else {
        const lim = Math.max(0, stage.clientWidth / 2 - 112);
        const x = Math.max(-lim, Math.min(lim, hx));
        cap.style.transform = hy > 0
          ? 'translate(-50%,-100%) translate(' + x.toFixed(1) + 'px,' + (hy - hr - 12).toFixed(1) + 'px)'
          : 'translate(-50%,0) translate(' + x.toFixed(1) + 'px,' + (hy + hr + 12).toFixed(1) + 'px)';
        cap.style.opacity = '1';
      }
    }
    if (sun) sun.style.transform = 'translate(-50%,-50%) scale(' + Math.max(0.55, s).toFixed(3) + ')';
  };
  const loop = now => {
    const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
    mul += ((hover ? 0 : 1) - mul) * 0.08;
    for (let i = 0; i < 3; i++) ang[i] += W[i] * dt * mul;
    cx += (tx - cx) * 0.05; cy += (ty - cy) * 0.05;
    draw();
    raf = requestAnimationFrame(loop);
  };
  const refresh = () => {
    planets = Array.from(stage.querySelectorAll('[data-planet]')).map(el => ({
      el, ring: Math.min(2, +el.getAttribute('data-ring') || 0),
      phase: (+el.getAttribute('data-phase') || 0) * Math.PI * 2,
      slug: el.getAttribute('data-slug'),
    }));
    rings = Array.from(stage.querySelectorAll('[data-orbit-ring]'));
    sun = stage.querySelector('[data-sun]');
    cap = stage.querySelector('[data-orbit-caption]');
    measure();
    if (still) draw();
  };
  const setHover = el => {
    if (el === hover) return;
    hover = el;
    if (opts.onHover) opts.onHover(el ? el.getAttribute('data-slug') : null);
    if (still) draw();
  };
  const onOver = e => setHover(e.target && e.target.closest ? e.target.closest('[data-planet]') : null);
  const onLeave = () => { setHover(null); tx = 0; ty = 0; };
  const onMove = e => {
    const r = stage.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
  };
  const onResize = () => { measure(); if (still) draw(); };
  stage.addEventListener('pointerover', onOver);
  stage.addEventListener('pointerleave', onLeave);
  stage.addEventListener('pointermove', onMove);
  window.addEventListener('resize', onResize);
  refresh();
  if (!still) {
    stage.querySelectorAll('[data-pulse]').forEach((el, i) => {
      try {
        pulses.push(el.animate(
          [{ transform: 'translate(-50%,-50%) scale(1)', opacity: 0.5 }, { transform: 'translate(-50%,-50%) scale(2.8)', opacity: 0 }],
          { duration: 3900, iterations: Infinity, delay: i * 1300, easing: 'ease-out' }
        ));
      } catch (e) {}
    });
    raf = requestAnimationFrame(loop);
  }
  return {
    refresh,
    destroy() {
      cancelAnimationFrame(raf);
      pulses.forEach(a => a.cancel());
      stage.removeEventListener('pointerover', onOver);
      stage.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
    },
  };
}

// Eased 0→1 progress callback; always lands on 1 even if rAF is throttled.
export function countUp(ms, cb, animate = true) {
  if (!animate || reduced()) { cb(1); return () => {}; }
  let raf = 0, done = false;
  const t0 = performance.now();
  const f = now => {
    const p = Math.min(1, (now - t0) / ms);
    cb(1 - Math.pow(1 - p, 3));
    if (p < 1) raf = requestAnimationFrame(f); else done = true;
  };
  raf = requestAnimationFrame(f);
  const safety = setTimeout(() => { if (!done) { cancelAnimationFrame(raf); cb(1); } }, ms + 400);
  return () => { cancelAnimationFrame(raf); clearTimeout(safety); };
}
