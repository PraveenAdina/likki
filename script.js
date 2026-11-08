/* ════════════════════════════════════════════════
   BIRTHDAY SURPRISE  ·  script.js
   Pure JavaScript · no libraries · GitHub Pages ready
   ════════════════════════════════════════════════ */
(() => {
'use strict';

/* ╔══════════════════════════════════════════╗
   ║   ✏️  EDIT THIS BLOCK TO PERSONALISE     ║
   ╚══════════════════════════════════════════╝ */
const CONFIG = {
  friendName: 'Likhitha',          // shown in the greeting, letter and finale
  fromName:   'Praveen',     // shown in the letter signature & footer
  wishes: [                      // typed out one line at a time
    'Today the world got a little brighter 🌤️',
    'Because someone wonderful was born. 💖',
    'May your cake be huge and your worries tiny 🍰',
    'May every wish you whisper come true ✨',
    'Thank you for being you. I am so lucky to know you 🫶',
    'Happy Birthday! Let’s make this year magical 🎆'
  ],
  catLines: [
    'Mochi mochi! 🍑', 'You are peach-ectly wonderful!', 'Happy Birthday, hooman! 🐾',
    '*squish squish*', 'Nyaa~ cake please? 🍰', 'You deserve all the pets 💗',
    'Soft paws, big love 🐱', 'Make a wish!'
  ]
};

/* ───────────── helpers ───────────── */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rand = (a, b) => Math.random() * (b - a) + a;
const pick = a => a[(Math.random() * a.length) | 0];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;
const lite = () => (innerWidth < 700 ? 0.6 : 1);
const INK = '#3b2a4a';
const LETTER_COL = ['#ff7fb0', '#ffa97a', '#ffd75e', '#7fd9a8', '#78c0f5', '#b394ff'];

/* ───────────── sky (clouds + stars) ───────────── */
function buildSky(el, clouds = 6, stars = 34) {
  let h = '';
  for (let i = 0; i < stars; i++)
    h += `<i class="star" style="left:${rand(0, 100)}%;top:${rand(0, 75)}%;--s:${rand(.5, 1.5).toFixed(2)};--d:${rand(1.6, 4).toFixed(1)}s;animation-delay:-${rand(0, 4).toFixed(1)}s"></i>`;
  for (let i = 0; i < clouds; i++) {
    const w = rand(90, 210);
    h += `<div class="cloud" style="top:${rand(4, 72)}%;width:${w.toFixed(0)}px;height:${(w * .34).toFixed(0)}px;--dur:${rand(45, 95).toFixed(0)}s;animation-delay:-${rand(0, 90).toFixed(0)}s;opacity:${rand(.55, .95).toFixed(2)}"></div>`;
  }
  el.innerHTML = h;
}

/* ───────────── floating emoji layers ───────────── */
function floaters(layer, items, every, opt = {}) {
  const size = opt.size || [16, 34], dur = opt.dur || [6, 10];
  let id = 0;
  const spawn = () => {
    if (document.hidden || !layer.clientHeight || layer.childElementCount > 24) return;
    const s = document.createElement('span');
    s.className = 'floater';
    const it = typeof items === 'function' ? items() : pick(items);
    if (it.charAt(0) === '<') s.innerHTML = it; else s.textContent = it;
    const d = rand(dur[0], dur[1]);
    s.style.left = rand(2, 96) + '%';
    s.style.fontSize = rand(size[0], size[1]) + 'px';
    s.style.setProperty('--dur', d.toFixed(1) + 's');
    s.style.setProperty('--dx', rand(-70, 70).toFixed(0) + 'px');
    s.style.setProperty('--rise', (layer.clientHeight + 90) + 'px');
    layer.appendChild(s);
    setTimeout(() => s.remove(), d * 1000 + 300);
  };
  return {
    start() { if (id) return; spawn(); id = setInterval(spawn, reduce ? every * 3 : every); },
    stop() { clearInterval(id); id = 0; }
  };
}

/* ═══════════════ PARTICLE ENGINE (confetti, hearts, sparkles, fireworks) ═══════════════ */
const fx = (() => {
  const cv = $('#fx'), c = cv.getContext('2d');
  let W = innerWidth, H = innerHeight, P = [], raf = 0, last = 0;
  const COL = ['#ff7fb0', '#ffb3d1', '#ffd75e', '#78c0f5', '#9b7bff', '#4fd1a0', '#ffa97a', '#fff1a8'];
  function size() {
    const d = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * d; cv.height = H * d;
    c.setTransform(d, 0, 0, d, 0, 0);
  }
  addEventListener('resize', size); size();

  function add(p) {
    if (P.length > 700) return;
    p.t = 0; P.push(p);
    if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
  }
  /* kinds: 0 confetti · 1 dot · 2 heart · 3 star · 4 rocket */
  const conf = (x, y, vx, vy, col) => add({ k: 0, x, y, vx, vy, g: 520, dr: .965, life: rand(2.4, 4), s: rand(6, 11), c: col || pick(COL), r: rand(0, 6.28), vr: rand(-9, 9), w: rand(.5, 1) });
  const dot = (x, y, vx, vy, col, life, s, g = 80) => add({ k: 1, x, y, vx, vy, g, dr: .965, life, s, c: col });

  function heartPath(x, y, s) {
    c.beginPath();
    c.moveTo(x, y + s * .3);
    c.bezierCurveTo(x, y - s * .2, x - s, y - s * .2, x - s, y + s * .3);
    c.bezierCurveTo(x - s, y + s * .8, x, y + s * .9, x, y + s * 1.2);
    c.bezierCurveTo(x, y + s * .9, x + s, y + s * .8, x + s, y + s * .3);
    c.bezierCurveTo(x + s, y - s * .2, x, y - s * .2, x, y + s * .3);
    c.closePath();
  }
  function star(x, y, r) {
    c.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4 - Math.PI / 2, rr = i % 2 ? r * .32 : r;
      c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    c.closePath();
  }
  function explode(x, y, col) {
    const n = Math.round(rand(46, 74) * lite()), ring = Math.random() < .4;
    const cols = [col, '#ffffff', pick(COL)];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 6.283 + rand(-.05, .05), v = ring ? 430 : rand(180, 520);
      dot(x, y, Math.cos(a) * v, Math.sin(a) * v, pick(cols), rand(1, 1.7), rand(2.2, 4.2));
    }
  }
  function tick(now) {
    const dt = Math.min((now - last) / 1000, .05); last = now;
    c.clearRect(0, 0, W, H);
    for (let i = P.length - 1; i >= 0; i--) {
      const p = P[i]; p.t += dt;
      if (p.k === 4) {
        p.vy += p.g * dt; p.y += p.vy * dt; p.x += p.vx * dt;
        if (Math.random() < .55) dot(p.x, p.y, rand(-20, 20), rand(10, 40), '#fff3b0', .5, 2, 40);
        if (p.vy > -70 || p.t > p.life) { explode(p.x, p.y, p.c); P.splice(i, 1); continue; }
        c.globalAlpha = 1; c.fillStyle = '#fff'; c.beginPath(); c.arc(p.x, p.y, 2.8, 0, 6.283); c.fill();
        continue;
      }
      if (p.t >= p.life || p.y > H + 40 || p.y < -80) { P.splice(i, 1); continue; }
      const left = 1 - p.t / p.life;
      if (p.k === 2) {
        p.y += p.vy * dt; p.x += Math.sin(p.t * 3 + p.w) * 22 * dt;
        c.globalAlpha = Math.min(1, left * 1.6); c.fillStyle = p.c; heartPath(p.x, p.y, p.s); c.fill();
        continue;
      }
      const d = Math.pow(p.dr, dt * 60);
      p.vx *= d; p.vy = p.vy * d + p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.k === 0) {
        p.r += p.vr * dt;
        c.globalAlpha = Math.min(1, left * 2.2); c.fillStyle = p.c;
        c.save(); c.translate(p.x, p.y); c.rotate(p.r); c.scale(1, Math.cos(p.t * 8 * p.w));
        c.fillRect(-p.s / 2, -p.s * .3, p.s, p.s * .6); c.restore();
      } else if (p.k === 1) {
        c.globalAlpha = Math.max(0, left); c.fillStyle = p.c;
        c.beginPath(); c.arc(p.x, p.y, Math.max(.4, p.s * (.5 + .5 * left)), 0, 6.283); c.fill();
      } else if (p.k === 3) {
        c.globalAlpha = Math.max(0, left); c.fillStyle = p.c; star(p.x, p.y, p.s * left); c.fill();
      }
    }
    c.globalAlpha = 1;
    if (P.length) raf = requestAnimationFrame(tick);
    else { raf = 0; c.clearRect(0, 0, W, H); }
  }

  return {
    confetti(x, y, n = 70, power = 1) {
      n = Math.round(n * lite());
      for (let i = 0; i < n; i++) {
        const a = rand(0, 6.283), v = rand(140, 560) * power;
        conf(x, y, Math.cos(a) * v, Math.sin(a) * v - 220 * power);
      }
    },
    rain(n = 40) {
      n = Math.round(n * lite());
      for (let i = 0; i < n; i++) conf(rand(0, W), rand(-60, -10), rand(-50, 50), rand(40, 160));
    },
    cannons(n = 46) {
      n = Math.round(n * lite());
      for (let i = 0; i < n; i++) {
        conf(0, H, rand(180, 620), -rand(520, 980));
        conf(W, H, -rand(180, 620), -rand(520, 980));
      }
    },
    hearts(x, y, n = 8) {
      for (let i = 0; i < n; i++)
        add({ k: 2, x: x + rand(-30, 30), y: y + rand(-10, 10), vy: -rand(50, 130), life: rand(1.6, 2.8), s: rand(5, 11), c: pick(['#ff7fb0', '#ff9bb8', '#ffb3d1', '#ff6f91', '#d9a0ff']), w: rand(0, 6) });
    },
    sparkle(x, y, n = 1) {
      for (let i = 0; i < n; i++)
        add({ k: 3, x: x + rand(-8, 8), y: y + rand(-8, 8), vx: rand(-40, 40), vy: rand(-30, 40), g: 30, dr: .97, life: rand(.5, 1), s: rand(5, 11), c: pick(['#fff', '#ffe27a', '#ffb3d1', '#bde3ff']) });
    },
    firework(x, y) {
      x = x ?? rand(W * .12, W * .88);
      const ty = y ?? rand(H * .12, H * .45);
      const vy = -Math.sqrt(2 * 500 * Math.max(120, H - ty));
      add({ k: 4, x: x + rand(-40, 40), y: H + 8, vx: rand(-30, 30), vy, g: 500, life: 3, c: pick(COL) });
    },
    pop(x, y, col) {
      const n = Math.round(26 * lite());
      for (let i = 0; i < n; i++) {
        const a = rand(0, 6.283), v = rand(120, 380);
        dot(x, y, Math.cos(a) * v, Math.sin(a) * v, col || pick(COL), rand(.5, .9), rand(2.5, 5), 300);
      }
      for (let i = 0; i < 8; i++) conf(x, y, rand(-300, 300), rand(-380, -60), col);
    }
  };
})();

/* ═══════════════ MUSIC (synthesised with Web Audio, no files needed) ═══════════════ */
const music = (() => {
  let ac = null, master = null, on = false, muted = false, mode = 'happy', i = 0, timer = 0;
  const SC = {
    happy: { base: 523.25, wave: 'sine', step: .3, notes: [0, 4, 7, 12, 9, 7, 4, 2, 0, 4, 9, 7, 5, 4, 2, -1], bass: [-12, -8, -5, -8] },
    sad:   { base: 392, wave: 'triangle', step: .66, notes: [0, 3, 7, 3, 5, 3, 0, -2, 0, 3, 8, 7, 5, 3, 2, -2], bass: [-12, -12, -9, -14] }
  };
  function init() {
    if (ac) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ac = new AC(); master = ac.createGain(); master.gain.value = .55; master.connect(ac.destination);
    return true;
  }
  function tone(f, t, d, type, v, vib) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.value = f;
    if (vib) {
      const l = ac.createOscillator(), lg = ac.createGain();
      l.frequency.value = 5; lg.gain.value = f * .012; l.connect(lg); lg.connect(o.frequency); l.start(t); l.stop(t + d + .1);
    }
    g.gain.setValueAtTime(.0001, t);
    g.gain.linearRampToValueAtTime(v, t + .02);
    g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + d + .05);
  }
  function tick() {
    if (!on) return;
    const s = SC[mode], t = ac.currentTime + .04, n = s.notes[i % s.notes.length];
    tone(s.base * 2 ** (n / 12), t, s.step * 2.6, s.wave, .16, mode === 'sad');
    if (i % 2 === 0) tone(s.base / 2 * 2 ** (s.bass[(i >> 1) % 4] / 12), t, s.step * 4, 'sine', .14);
    if (mode === 'happy' && i % 4 === 2) tone(s.base * 2 * 2 ** (n / 12), t + s.step / 2, .25, 'triangle', .05);
    i++; timer = setTimeout(tick, s.step * 1000);
  }
  return {
    get on() { return on; },
    toggle() {
      if (!init()) return false;
      if (ac.state === 'suspended') ac.resume();
      on = !on; clearTimeout(timer);
      if (on) { muted = false; i = 0; tick(); } else muted = true;
      return on;
    },
    setMode(m) { mode = m; i = 0; },
    pause() { if (ac && ac.state === 'running') ac.suspend(); },
    resume() { if (ac && on && ac.state === 'suspended') ac.resume(); },
    pop() {
      if (!on || !ac) return;
      const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
      o.type = 'triangle'; o.frequency.setValueAtTime(520, t); o.frequency.exponentialRampToValueAtTime(90, t + .12);
      g.gain.setValueAtTime(.3, t); g.gain.exponentialRampToValueAtTime(.001, t + .14);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + .16);
    },
    chime() {
      if (!on || !ac) return;
      [0, 4, 7, 12, 16].forEach((n, k) => tone(784 * 2 ** (n / 12), ac.currentTime + k * .09, .5, 'sine', .12));
    },
    womp() {                       // sad "womp womp womp" on the No page
      if (muted || !init()) return;
      if (ac.state === 'suspended') ac.resume();
      [0, -1, -2].forEach((n, k) => tone(220 * 2 ** (n / 12), ac.currentTime + .05 + k * .32, .3, 'sawtooth', .07, true));
      tone(196 * 2 ** (-4 / 12), ac.currentTime + 1.05, .9, 'sawtooth', .08, true);
    }
  };
})();

/* ═══════════════ SVG BUILDERS (all original artwork) ═══════════════ */
function cakeSVG() {
  const xs = [56, 80, 104], cs = ['#78c0f5', '#ff9bb8', '#b8f0d4'];
  let candles = '';
  xs.forEach((x, k) => {
    candles += `<rect x="${x - 3}" y="44" width="6" height="27" rx="3" fill="${cs[k]}"/><rect x="${x - 3}" y="52" width="6" height="4" fill="#fff" opacity=".7"/><rect x="${x - 3}" y="60" width="6" height="4" fill="#fff" opacity=".7"/>
    <ellipse class="flame" style="animation-delay:-${k * .1}s" cx="${x}" cy="36" rx="5" ry="8.5" fill="#ffb347"/><ellipse class="flame f2" cx="${x}" cy="38" rx="2.5" ry="4.5" fill="#fff3a0"/>
    <circle class="smoke" cx="${x}" cy="34" r="5" fill="#d9d2e6"/>`;
  });
  return `<svg viewBox="0 0 160 175" aria-hidden="true">
    <ellipse cx="80" cy="161" rx="72" ry="9" fill="#fff" stroke="#f0dff0" stroke-width="2"/>
    <rect x="18" y="108" width="124" height="52" rx="16" fill="#ffb3d1"/>
    <path d="M18 122 Q18 108 34 108 H126 Q142 108 142 122 Q134 134 126 122 Q118 138 110 122 Q102 134 94 122 Q86 138 78 122 Q70 134 62 122 Q54 138 46 122 Q38 134 30 122 Q24 130 18 122Z" fill="#fff"/>
    <rect x="38" y="70" width="84" height="42" rx="14" fill="#fff1c9"/>
    <path d="M38 84 Q38 70 52 70 H108 Q122 70 122 84 Q114 96 106 84 Q98 98 90 84 Q82 96 74 84 Q66 98 58 84 Q50 96 42 84Z" fill="#fff"/>
    <rect x="30" y="140" width="7" height="3.5" rx="1.7" fill="#78c0f5" transform="rotate(25 33 141)"/><rect x="118" y="132" width="7" height="3.5" rx="1.7" fill="#ffd75e" transform="rotate(-30 121 133)"/>
    <rect x="56" y="148" width="7" height="3.5" rx="1.7" fill="#9b7bff" transform="rotate(40 59 149)"/><rect x="96" y="144" width="7" height="3.5" rx="1.7" fill="#4fd1a0" transform="rotate(-15 99 145)"/>
    <rect x="48" y="96" width="7" height="3.5" rx="1.7" fill="#ff7fb0" transform="rotate(-20 51 97)"/><rect x="104" y="98" width="7" height="3.5" rx="1.7" fill="#78c0f5" transform="rotate(30 107 99)"/>
    <text x="80" y="143" text-anchor="middle" font-size="20">💖</text>
    ${candles}</svg>`;
}

function peachCat(body = '#ffc9a5', ear = '#ffb59a') {
  return `<svg viewBox="0 0 120 120" aria-hidden="true">
    <ellipse cx="60" cy="112" rx="34" ry="5" fill="rgba(120,80,120,.14)"/>
    <path d="M104 92 Q124 84 116 62" stroke="${ear}" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M22 46 L20 12 L48 31Z" fill="${ear}"/><path d="M98 46 L100 12 L72 31Z" fill="${ear}"/>
    <path d="M27 40 L26 22 L42 32Z" fill="#ff9bb8"/><path d="M93 40 L94 22 L78 32Z" fill="#ff9bb8"/>
    <ellipse cx="60" cy="68" rx="47" ry="41" fill="${body}"/>
    <ellipse cx="42" cy="50" rx="14" ry="8" fill="#fff" opacity=".35" transform="rotate(-22 42 50)"/>
    <path d="M60 30 Q57 42 60 52" stroke="#eb9d7e" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".7"/>
    <path d="M36 68 Q43 59 50 68" stroke="#6b4a5e" stroke-width="3.6" fill="none" stroke-linecap="round"/>
    <path d="M70 68 Q77 59 84 68" stroke="#6b4a5e" stroke-width="3.6" fill="none" stroke-linecap="round"/>
    <ellipse cx="31" cy="79" rx="8" ry="5" fill="#ff9bb8" opacity=".6"/><ellipse cx="89" cy="79" rx="8" ry="5" fill="#ff9bb8" opacity=".6"/>
    <path d="M54 78 Q57 83 60 78 Q63 83 66 78" stroke="#6b4a5e" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M22 76 L8 73 M22 82 L9 85 M98 76 L112 73 M98 82 L111 85" stroke="#6b4a5e" stroke-width="1.6" stroke-linecap="round" opacity=".5"/>
    <ellipse cx="40" cy="106" rx="11" ry="7" fill="#ffe0cc"/><ellipse cx="80" cy="106" rx="11" ry="7" fill="#ffe0cc"/>
    <path d="M60 31 C57 18 68 9 79 12 C79 24 71 32 60 31Z" fill="#7fd99a"/><path d="M60 31 C62 22 66 16 72 14" stroke="#4fb878" stroke-width="2" fill="none" stroke-linecap="round"/>
  </svg>`;
}

function face(cx, cy, r, skin) {
  const e = r * .36, ey = cy + r * .05;
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${skin}"/>
  <ellipse cx="${cx - e}" cy="${ey}" rx="${r * .11}" ry="${r * .15}" fill="${INK}"/><ellipse cx="${cx + e}" cy="${ey}" rx="${r * .11}" ry="${r * .15}" fill="${INK}"/>
  <circle cx="${cx - e + r * .04}" cy="${ey - r * .06}" r="${r * .045}" fill="#fff"/><circle cx="${cx + e + r * .04}" cy="${ey - r * .06}" r="${r * .045}" fill="#fff"/>
  <path d="M${cx - r * .22} ${cy + r * .34} Q${cx} ${cy + r * .6} ${cx + r * .22} ${cy + r * .34}" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <circle cx="${cx - r * .62}" cy="${cy + r * .3}" r="${r * .14}" fill="#ff9bb8" opacity=".65"/><circle cx="${cx + r * .62}" cy="${cy + r * .3}" r="${r * .14}" fill="#ff9bb8" opacity=".65"/>`;
}

const CHARS = {
  hero: () => `<svg viewBox="0 0 100 140" aria-hidden="true">
    <path class="cape" d="M30 64 L14 118 Q50 134 86 118 L70 64Z" fill="#ff5a6e"/>
    <rect x="36" y="104" width="12" height="24" rx="6" fill="#3b4a8a"/><rect x="52" y="104" width="12" height="24" rx="6" fill="#3b4a8a"/>
    <ellipse cx="42" cy="130" rx="10" ry="5.5" fill="#fff"/><ellipse cx="58" cy="130" rx="10" ry="5.5" fill="#fff"/>
    <rect x="31" y="66" width="38" height="42" rx="15" fill="#4aa8ff"/>
    <path d="M50 77l3.6 7.4 8.2 1.2-6 5.7 1.5 8.1L50 95.4l-7.3 4 1.5-8.1-6-5.7 8.2-1.2z" fill="#ffd75e"/>
    <path d="M33 74 Q20 86 22 100" stroke="#ffd9b8" stroke-width="9" stroke-linecap="round" fill="none"/>
    <g class="arm-up"><path d="M67 74 Q82 66 88 48" stroke="#ffd9b8" stroke-width="9" stroke-linecap="round" fill="none"/><circle cx="88" cy="46" r="6.5" fill="#ffd9b8"/></g>
    ${face(50, 44, 26, '#ffd9b8')}
    <path d="M23 38 L26 14 L37 27 L45 8 L53 25 L63 9 L68 28 L78 16 L77 40 Q50 22 23 38Z" fill="#7a4a2a"/>
    <rect x="27" y="29" width="46" height="9" rx="4.5" fill="#ff9f43"/><circle cx="37" cy="33.5" r="6.5" fill="#bde3ff" stroke="#fff" stroke-width="2"/><circle cx="63" cy="33.5" r="6.5" fill="#bde3ff" stroke="#fff" stroke-width="2"/></svg>`,

  magic: () => `<svg viewBox="0 0 100 140" aria-hidden="true">
    <circle cx="50" cy="48" r="30" fill="#ff8fc0"/><circle cx="19" cy="64" r="10" fill="#ff8fc0"/><circle cx="81" cy="64" r="10" fill="#ff8fc0"/>
    <circle cx="22" cy="53" r="4" fill="#fff"/><circle cx="78" cy="53" r="4" fill="#fff"/>
    <path d="M28 68 L15 122 H85 L72 68Z" fill="#c9b3ff"/><path d="M40 68 L50 81 L60 68Z" fill="#fff"/><circle cx="50" cy="98" r="5" fill="#ffd75e"/>
    <rect x="38" y="120" width="9" height="12" rx="4" fill="#ffd9b8"/><rect x="53" y="120" width="9" height="12" rx="4" fill="#ffd9b8"/>
    <ellipse cx="42" cy="133" rx="9" ry="4.8" fill="#9b7bff"/><ellipse cx="58" cy="133" rx="9" ry="4.8" fill="#9b7bff"/>
    <path d="M28 76 Q16 88 20 100" stroke="#ffd9b8" stroke-width="8" stroke-linecap="round" fill="none"/>
    <g class="arm-up"><path d="M72 78 Q86 74 90 58" stroke="#ffd9b8" stroke-width="8" stroke-linecap="round" fill="none"/>
      <line x1="90" y1="58" x2="94" y2="34" stroke="#8a5a2b" stroke-width="3" stroke-linecap="round"/>
      <path class="wand-star" d="M94 18l3.2 6.8 7.4 1-5.4 5.2 1.3 7.4-6.5-3.5-6.5 3.5 1.3-7.4-5.4-5.2 7.4-1z" fill="#ffd75e"/></g>
    ${face(50, 48, 25, '#ffd9b8')}
    <path d="M26 44 Q50 22 74 44 Q60 36 50 42 Q40 36 26 44Z" fill="#ff8fc0"/>
    <path d="M25 32 L50 2 L75 32Z" fill="#9b7bff"/><ellipse cx="50" cy="32" rx="34" ry="7" fill="#7b5cf0"/>
    <path d="M50 12l2.2 4.6 5 .7-3.7 3.5.9 5-4.4-2.4-4.4 2.4.9-5-3.7-3.5 5-.7z" fill="#ffd75e"/></svg>`,

  alien: () => `<svg viewBox="0 0 100 140" aria-hidden="true">
    <line x1="40" y1="22" x2="29" y2="6" stroke="#4fd1a0" stroke-width="3" stroke-linecap="round"/><circle cx="29" cy="6" r="5" fill="#ff7fb0"/>
    <line x1="60" y1="22" x2="71" y2="6" stroke="#4fd1a0" stroke-width="3" stroke-linecap="round"/><circle cx="71" cy="6" r="5" fill="#ffd75e"/>
    <rect x="36" y="104" width="12" height="24" rx="6" fill="#2d3436"/><rect x="52" y="104" width="12" height="24" rx="6" fill="#2d3436"/>
    <ellipse cx="42" cy="130" rx="10" ry="5.5" fill="#55efc4"/><ellipse cx="58" cy="130" rx="10" ry="5.5" fill="#55efc4"/>
    <rect x="31" y="66" width="38" height="42" rx="15" fill="#2d3436"/><path d="M31 88 H69" stroke="#55efc4" stroke-width="3"/>
    <circle class="orb" cx="50" cy="88" r="10" fill="#55efc4"/><circle cx="50" cy="88" r="5.5" fill="#fff" opacity=".9"/>
    <path d="M33 74 Q20 86 22 100" stroke="#7bed9f" stroke-width="9" stroke-linecap="round" fill="none"/>
    <g class="arm-up"><path d="M67 74 Q82 66 88 50" stroke="#7bed9f" stroke-width="9" stroke-linecap="round" fill="none"/><circle cx="88" cy="48" r="6.5" fill="#7bed9f"/></g>
    ${face(50, 44, 26, '#7bed9f')}
    <circle cx="36" cy="30" r="2.6" fill="#55c98a"/><circle cx="62" cy="28" r="3.2" fill="#55c98a"/><circle cx="52" cy="24" r="2" fill="#55c98a"/></svg>`,

  funny: () => `<svg viewBox="0 0 100 140" aria-hidden="true">
    <path class="cape" d="M28 66 L12 120 Q50 136 88 120 L72 66Z" fill="#ffd75e"/>
    <rect x="36" y="104" width="12" height="24" rx="6" fill="#6c5ce7"/><rect x="52" y="104" width="12" height="24" rx="6" fill="#6c5ce7"/>
    <ellipse cx="42" cy="130" rx="11" ry="6" fill="#ff6b81"/><ellipse cx="58" cy="130" rx="11" ry="6" fill="#ff6b81"/>
    <rect x="27" y="66" width="46" height="44" rx="20" fill="#ff9f43"/>
    <circle cx="50" cy="88" r="11" fill="#fff"/><text x="50" y="94" text-anchor="middle" font-family="Chewy,Fredoka,sans-serif" font-size="16" fill="#ff6b81">B</text>
    <circle cx="21" cy="84" r="11" fill="#ffcf9f"/><g class="arm-up"><circle cx="80" cy="76" r="11" fill="#ffcf9f"/></g>
    ${face(50, 44, 26, '#ffcf9f')}
    <path d="M24 40 Q50 28 76 40 L74 55 Q50 47 26 55Z" fill="#6c5ce7"/>
    <ellipse cx="40" cy="46" rx="7.5" ry="6" fill="#fff"/><ellipse cx="60" cy="46" rx="7.5" ry="6" fill="#fff"/>
    <circle cx="41.5" cy="47" r="3" fill="${INK}"/><circle cx="61.5" cy="47" r="3" fill="${INK}"/>
    <path d="M36 58 Q50 76 64 58Z" fill="#ff6b81" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><path d="M41 60.5 H59" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    <path d="M44 20 Q50 6 56 20" stroke="#8a5a2b" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`,

  squad: () => {
    const mini = (cx, col, hair, up) => `
      <rect x="${cx - 9}" y="88" width="7" height="20" rx="3.5" fill="#3b4a8a"/><rect x="${cx + 2}" y="88" width="7" height="20" rx="3.5" fill="#3b4a8a"/>
      <ellipse cx="${cx - 5.5}" cy="109" rx="7" ry="4" fill="#fff"/><ellipse cx="${cx + 5.5}" cy="109" rx="7" ry="4" fill="#fff"/>
      <rect x="${cx - 15}" y="60" width="30" height="34" rx="12" fill="${col}"/>
      <path d="M${cx - 14} 68 Q${cx - 26} 62 ${cx - 25} 50" stroke="#ffd9b8" stroke-width="7" stroke-linecap="round" fill="none"/>
      <g class="${up ? 'arm-up' : ''}"><path d="M${cx + 14} 68 Q${cx + 26} 62 ${cx + 25} 48" stroke="#ffd9b8" stroke-width="7" stroke-linecap="round" fill="none"/></g>
      ${face(cx, 42, 17, '#ffd9b8')}
      <path d="M${cx - 17} 40 Q${cx - 17} 20 ${cx} 20 Q${cx + 17} 20 ${cx + 17} 40 Q${cx} 29 ${cx - 17} 40Z" fill="${hair}"/>`;
    return `<svg viewBox="0 0 150 120" aria-hidden="true">${mini(28, '#ff6f91', '#7a4a2a', 0)}${mini(122, '#4fd1a0', '#ffb347', 1)}${mini(75, '#4aa8ff', '#2d3436', 1)}
      <text x="75" y="14" text-anchor="middle" font-size="16">⭐</text></svg>`;
  }
};

const TOONS = [
  { n: 'Captain Brave', k: 'hero', say: ['Birthday power: ACTIVATED! ⚡', 'Brave hero reporting for cake duty!', 'I defeated 3 boring Mondays for you 💪'] },
  { n: 'Starlight Sasha', k: 'magic', say: ['Abra-cake-dabra! ✨', 'I wished for ALL your wishes 🌟', 'Spell of the day: extra frosting 🪄'] },
  { n: 'Zorp the Shifter', k: 'alien', say: ['Transforming into PARTY MODE! 👾', 'Earth cake detected. Delicious. 🍰', 'Even aliens know it’s your day! 🛸'] },
  { n: 'Bonk Bolt', k: 'funny', say: ['BOINK! Surprise! 💥', 'I tripped on the cake. Worth it. 😂', 'Muscles AND confetti!'] },
  { n: 'Adventure Squad', k: 'squad', wide: true, say: ['Squad goals: eat cake together! 🎂', 'Adventure awaits, birthday star! 🗺️', 'Three cheers for you! 🎉🎉🎉'] }
];

function toonHTML(t, i) {
  return `<button class="toon${t.wide ? ' wide' : ''}" style="--d:${(-i * .23).toFixed(2)}s" data-i="${TOONS.indexOf(t)}" aria-label="${t.n}">
    <span class="bubble"></span>${CHARS[t.k]()}<span class="tag">${t.n}</span></button>`;
}
function cakeToonHTML() {
  return `<div class="toon cake-toon" aria-hidden="true">${cakeSVG()}<span class="tag">🎂 the cake</span></div>`;
}
function talk(el) {
  const t = TOONS[+el.dataset.i]; if (!t) return;
  const b = $('.bubble', el); b.textContent = pick(t.say);
  el.classList.add('talk'); clearTimeout(el._tm);
  el._tm = setTimeout(() => el.classList.remove('talk'), 2600);
}
function toonClick(e) {
  const el = e.target.closest('.toon[data-i]'); if (!el) return;
  const r = el.getBoundingClientRect();
  talk(el); music.pop();
  fx.confetti(r.left + r.width / 2, r.top + r.height * .4, 34, .8);
  fx.hearts(r.left + r.width / 2, r.top, 4);
}

/* ═══════════════ SCREEN MANAGER ═══════════════ */
const screens = { loader: $('#loader'), ask: $('#ask'), sad: $('#sad'), story: $('#story') };
let cur = screens.loader;
const FL = {
  loader: floaters($('#loader .floaters'), ['💖', '💗', '✨', '⭐', '🌸', '🎈', '🧁'], 650),
  ask:    floaters($('#ask .floaters'),    ['💖', '🎁', '✨', '🌸', '🎈', '🍰', '💗'], 600),
  sad:    floaters($('#sad .floaters'),    ['💔', '💔', '😢', '💧', '🥺'], 520)
};
let loaderConf = 0;
const hooks = {
  loader: { on() { FL.loader.start(); loaderConf = setInterval(() => fx.rain(12), 1700); }, off() { FL.loader.stop(); clearInterval(loaderConf); } },
  ask:    { on() { FL.ask.start(); }, off() { FL.ask.stop(); } },
  sad:    { on() { FL.sad.start(); music.setMode('sad'); music.womp(); }, off() { FL.sad.stop(); music.setMode('happy'); } },
  story:  {}
};
function go(id) {
  const next = screens[id];
  if (!next || next === cur) return;
  const old = cur;
  old.classList.remove('active'); old.classList.add('leaving');
  setTimeout(() => old.classList.remove('leaving'), 520);
  hooks[old.id] && hooks[old.id].off && hooks[old.id].off();
  next.classList.add('active'); cur = next;
  if (id === 'story') next.scrollTop = 0; else next.scrollTop = 0;
  hooks[id] && hooks[id].on && hooks[id].on();
}

/* ═══════════════ 1 · LOADER ═══════════════ */
let loadTok = 0;
function runLoader() {
  const tok = ++loadTok;
  const scene = $('.load-scene'), pct = $('#pct'), msg = $('#loadMsg');
  const steps = [[0, 'Baking the cake… 🧁'], [24, 'Sprinkling sparkles… ✨'], [48, 'Inflating balloons… 🎈'], [72, 'Wrapping the surprise… 🎁'], [93, 'Almost there… 💖']];
  const dur = reduce ? 1500 : 7200, t0 = performance.now();
  scene.style.setProperty('--p', '0%'); pct.textContent = '0'; msg.textContent = steps[0][1];
  let lastMsg = 0;
  function f(now) {
    if (tok !== loadTok) return;
    const t = Math.min((now - t0) / dur, 1);
    const e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const v = (t * .4 + e * .6) * 100;
    scene.style.setProperty('--p', v.toFixed(2) + '%');
    pct.textContent = Math.floor(v);
    for (let k = steps.length - 1; k >= 0; k--) if (v >= steps[k][0]) { if (k !== lastMsg) { lastMsg = k; msg.textContent = steps[k][1]; } break; }
    if (t < 1) requestAnimationFrame(f);
    else {
      pct.textContent = '100'; msg.textContent = 'Ready! 🎉';
      fx.confetti(innerWidth / 2, innerHeight * .5, 100, 1.2); fx.rain(60);
      setTimeout(() => { if (tok === loadTok) go('ask'); }, 1400);
    }
  }
  requestAnimationFrame(f);
}

/* ═══════════════ 2 + 3 · ASK & NO ═══════════════ */
let asks = 0, going = false;
const ASK = [
  ['I have a surprise for you 🎁', 'Do you want to see it?'],
  ['Okay okay, second chance! 🥹', 'Do you want to see it?'],
  ['Pleeease? I worked SO hard on it 🥺', 'Do you want to see it?'],
  ['I will pay you in cake 🎂', '…now do you want to see it?'],
  ['Fine, I’m just going to assume yes 😤', 'Right? RIGHT? 🥹']
];
const HINTS = ['(psst… it’s a really good one)', '(the duck is still sniffling…)', '(the duck cried a little bit 🦆)', '(the Yes button is getting bigger, just saying)', '(the No button gave up 🙈)'];
const NOLAB = ['❌ No', '🙄 Nope', '🥲 Hmm… no?', '😬 Still no?', '🙈 Okay, yes'];
function applyAsk() {
  const k = Math.min(asks, 4), t = $('#askTitle');
  $('#askL1').textContent = ASK[k][0]; $('#askL2').textContent = ASK[k][1];
  $('#askHint').textContent = HINTS[k]; $('#noBtn').textContent = NOLAB[k];
  $('#yesBtn').style.setProperty('--ys', Math.min(1 + asks * .13, 1.5));
  $('#noBtn').style.setProperty('--ns', Math.max(.6, 1 - asks * .11));
  t.classList.remove('swap'); void t.offsetWidth; t.classList.add('swap');
}
function doYes(btn) {
  if (going) return; going = true;
  const r = btn.getBoundingClientRect();
  fx.confetti(r.left + r.width / 2, r.top + r.height / 2, 100, 1.1); fx.rain(40);
  music.chime();
  setTimeout(() => { go('story'); initStory(); going = false; }, 600);
}
function initAsk() {
  $('#yesBtn').addEventListener('click', e => doYes(e.currentTarget));
  $('#noBtn').addEventListener('click', e => {
    if (asks >= 4) return doYes(e.currentTarget);
    asks++; go('sad');
  });
  $('#againBtn').addEventListener('click', () => { applyAsk(); go('ask'); });
  /* rain on the sad page */
  $('#rain').innerHTML = Array.from({ length: 44 }, () =>
    `<i class="drop" style="--x:${rand(0, 100).toFixed(1)}%;--dur:${rand(.7, 1.3).toFixed(2)}s;--dl:-${rand(0, 2).toFixed(2)}s"></i>`).join('');
}

/* ═══════════════ STORY ═══════════════ */
let storyReady = false;
function split(el, text) {
  let i = 0;
  el.innerHTML = text.split(' ').map(w =>
    `<span class="word">${[...w].map(ch => `<span class="ltr" style="--i:${i};--c:${LETTER_COL[i++ % LETTER_COL.length]}" aria-hidden="true">${ch}</span>`).join('')}</span>`).join('');
}

function initStory() {
  if (storyReady) return; storyReady = true;
  const story = screens.story;

  /* names */
  $$('.fname').forEach(e => (e.textContent = CONFIG.friendName));
  $$('.fromname').forEach(e => (e.textContent = CONFIG.fromName));

  /* ── titles ── */
  split($('#hbdTitle'), 'Happy Birthday!');
  split($('#megaTitle'), 'Happy Birthday!');

  /* ── welcome balloons (decor) ── */
  const BC = ['#ffb3d1', '#ffd3b6', '#bde3ff', '#d9c8ff', '#fff1a8', '#b8f0d4', '#ff9bb8'];
  $('#welcomeBalloons').innerHTML = Array.from({ length: innerWidth < 600 ? 8 : 13 }, () =>
    `<i class="bln" style="--x:${rand(0, 93).toFixed(1)}%;--w:${rand(40, 82).toFixed(0)}px;--c:${pick(BC)};--dur:${rand(11, 20).toFixed(1)}s;--dl:-${rand(0, 18).toFixed(1)}s"></i>`).join('');

  /* ── cakes ── */
  $('#cakeBtn').innerHTML = cakeSVG();
  $('#finaleCake').innerHTML = cakeSVG();
  const cakeFlame = (host, hint) => {
    let busy = false;
    host.addEventListener('click', () => {
      if (busy) return; busy = true;
      const r = host.getBoundingClientRect();
      host.classList.remove('out'); void host.offsetWidth; host.classList.add('out');
      fx.sparkle(r.left + r.width / 2, r.top + r.height * .25, 18);
      fx.confetti(r.left + r.width / 2, r.top + r.height * .3, 60, .9);
      fx.hearts(r.left + r.width / 2, r.top + r.height * .2, 7);
      music.chime();
      if (hint) hint.textContent = 'Your wish is on its way ✨🌠';
      setTimeout(() => { host.classList.remove('out'); busy = false; if (hint) hint.textContent = '👆 tap again to relight & wish twice'; }, 3800);
    });
  };
  cakeFlame($('#cakeBtn'), $('#cakeHint'));
  cakeFlame($('#finaleCake'));

  /* ── lazy-load user photos ── */
  const markOk = img => { img.classList.add('ok'); const p = img.closest('.photo'); p && p.classList.add('has-img'); };
  const wire = img => {
    img.addEventListener('load', () => markOk(img), { once: true });
    img.addEventListener('error', () => img.removeAttribute('src'), { once: true });
    if (img.complete && img.naturalWidth > 0) markOk(img);   // already loaded / cached
  };
  /* A) photos written with a plain src="images/xx.jpg" */
  $$('.photo img[src]').forEach(img => {
    if (img.getAttribute('src').trim()) wire(img); else img.removeAttribute('src');
  });
  /* B) photos written with data-src="images/xx.jpg" (lazy-loaded when near the screen) */
  const imgIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const frame = e.target; imgIO.unobserve(frame);
    const img = $('img[data-src]', frame); if (!img) return;
    const s = (img.dataset.src || '').trim(); if (!s) return;
    img.decoding = 'async';
    wire(img);
    img.src = s;
  }), { root: story, rootMargin: '500px' });
  /* observe the frame (the <img> itself is display:none until it has a src) */
  $$('img[data-src]').forEach(i => { const f = i.closest('.photo'); f && imgIO.observe(f); });

  /* ── scroll reveal ── */
  const countUp = b => {
    const to = +b.dataset.count, suf = b.dataset.suffix || '', t0 = performance.now();
    (function s(now) {
      const t = Math.min((now - t0) / 1400, 1);
      b.textContent = Math.round(to * (1 - Math.pow(1 - t, 3))) + suf;
      if (t < 1) requestAnimationFrame(s);
    })(t0);
  };
  const revealIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target; revealIO.unobserve(el);
    el.classList.add('in');
    const b = el.querySelector('[data-count]'); if (b) countUp(b);
    const d = parseFloat(getComputedStyle(el).getPropertyValue('--d')) || 0;
    setTimeout(() => el.classList.remove('reveal', 'in'), (d + 1.4) * 1000);
  }), { root: story, threshold: .12, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal').forEach(el => revealIO.observe(el));

  /* ── tilt (mouse only) ── */
  if (fine) {
    let tEl = null;
    story.addEventListener('pointermove', e => {
      const el = e.target.closest && e.target.closest('.tilt');
      if (tEl && tEl !== el) { tEl.style.setProperty('--rx', '0deg'); tEl.style.setProperty('--ry', '0deg'); tEl = null; }
      if (!el) return; tEl = el;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--ry', (((e.clientX - r.left) / r.width - .5) * 14).toFixed(1) + 'deg');
      el.style.setProperty('--rx', (-((e.clientY - r.top) / r.height - .5) * 14).toFixed(1) + 'deg');
    });
  }

  /* ── parallax ── */
  const pxs = $$('.px');
  let pTick = false;
  const doPx = () => {
    pTick = false;
    pxs.forEach(p => {
      const par = p.parentElement.getBoundingClientRect();
      if (par.bottom < -300 || par.top > innerHeight + 300) return;
      p.style.setProperty('--py', ((par.top + par.height / 2 - innerHeight / 2) * parseFloat(p.dataset.speed || 0)).toFixed(1) + 'px');
    });
  };
  story.addEventListener('scroll', () => { if (!pTick) { pTick = true; requestAnimationFrame(doPx); } }, { passive: true });
  doPx();

  /* ── nav dots ── */
  const secs = $$('.sec', story), nav = $('#dots');
  secs.forEach(s => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Go to ' + s.dataset.title); b.dataset.t = s.dataset.title;
    b.addEventListener('click', () => s.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    nav.appendChild(b);
  });
  const navIO = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) $$('button', nav).forEach((b, i) => b.classList.toggle('on', secs[i] === e.target));
  }), { root: story, rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(s => navIO.observe(s));

  /* ── flip cards ── */
  $$('.flip').forEach(f => {
    f.addEventListener('click', () => f.classList.toggle('on'));
    f.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); f.classList.toggle('on'); } });
  });

  /* ── peach cats ── */
  const cats = [['#ffc9a5', '#ffb59a'], ['#ffd0dc', '#ffb0c4'], ['#ffe2b0', '#ffcb85']];
  $('#catStage').innerHTML = cats.map((c, i) =>
    `<div class="cat" style="--d:${-i * .7}s" role="button" tabindex="0" aria-label="Peach cat"><div class="bubble">${pick(CONFIG.catLines)}</div>${peachCat(c[0], c[1])}</div>`).join('');
  const catSay = cat => {
    const b = $('.bubble', cat); b.textContent = pick(CONFIG.catLines);
    b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
  };
  $$('.cat').forEach(cat => {
    const act = () => {
      cat.classList.remove('squish'); void cat.offsetWidth; cat.classList.add('squish');
      setTimeout(() => cat.classList.remove('squish'), 700);
      catSay(cat); music.pop();
      const r = cat.getBoundingClientRect(); fx.hearts(r.left + r.width / 2, r.top + r.height * .4, 7);
    };
    cat.addEventListener('click', act);
    cat.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
  });
  /* paw prints walking diagonally */
  $('#peach .paws').innerHTML = Array.from({ length: 14 }, (_, i) => {
    const t = i / 13, side = i % 2 ? 3.2 : -3.2;
    return `<span class="paw" style="--i:${i};--x:${(6 + 84 * t).toFixed(1)}%;--y:${(86 - 66 * t + side).toFixed(1)}%;--rot:${-38 + (i % 2 ? 14 : -14)}deg">🐾</span>`;
  }).join('');
  const peachFl = floaters($('#peachFloaters'), () => (Math.random() < .45 ? peachCat() : pick(['🍑', '🐾', '💗', '✨', '🩷'])), 800, { size: [24, 54], dur: [8, 13] });
  let catTimer = 0;

  /* ── cartoon world ── */
  $('#flags').innerHTML = Array.from({ length: 16 }, (_, i) => `<i style="--c:${pick(BC)};--i:${i}"></i>`).join('');
  const row = TOONS.map(toonHTML);
  row.splice(2, 0, cakeToonHTML());
  $('#toonRow').innerHTML = row.join('');
  $('#toonRow').addEventListener('click', toonClick);
  $('#dancers').innerHTML = TOONS.map(toonHTML).join('');
  $('#dancers').addEventListener('click', toonClick);
  let toonTimer = 0, confTimer = 0;

  /* ── wishes ── */
  let typeTok = 0, wishDone = false;
  async function typeWishes() {
    const tok = ++typeTok, box = $('#typed'); box.innerHTML = '';
    const lines = CONFIG.wishes;
    for (let li = 0; li < lines.length; li++) {
      if (tok !== typeTok) return;
      const p = document.createElement('p'); p.className = 'wish-line';
      const cur = document.createElement('span'); cur.className = 'caret';
      p.append(cur); box.append(p);
      for (const ch of lines[li]) {
        if (tok !== typeTok) return;
        cur.before(ch); await sleep(rand(28, 60));
      }
      const r = p.getBoundingClientRect(); fx.hearts(r.left + r.width / 2, r.top, 5);
      music.chime(); await sleep(450);
      if (tok !== typeTok) return;
      if (li < lines.length - 1) cur.remove();
    }
    for (let k = 0; k < 5; k++) { if (tok !== typeTok) return; fx.firework(); await sleep(380); }
  }
  $('#replayWish').addEventListener('click', typeWishes);
  $('#fwBtn').addEventListener('click', () => { for (let k = 0; k < 6; k++) setTimeout(() => fx.firework(), k * 260); music.chime(); });
  const wishFl = floaters($('#wishFloaters'), ['💖', '💗', '💕', '✨', '🌸', '🩷'], 500);
  let wishFw = 0;

  /* ── secret letter ── */
  const env = $('#envelope'), paper = $('#letterPaper'), wrap = $('#envWrap');
  let opened = false;
  env.addEventListener('click', () => {
    if (opened) return; opened = true;
    env.classList.add('open'); music.chime();
    const r = env.getBoundingClientRect();
    fx.hearts(r.left + r.width / 2, r.top + r.height / 2, 14); fx.sparkle(r.left + r.width / 2, r.top, 16);
    $('#envHint').textContent = '✨ shhh… ✨';
    setTimeout(() => {
      wrap.classList.add('gone'); paper.hidden = false;
      paper.classList.remove('show'); void paper.offsetWidth; paper.classList.add('show');
      fx.confetti(innerWidth / 2, innerHeight * .4, 60, .9);
      setTimeout(() => paper.scrollIntoView({ behavior: 'smooth', block: 'center' }), 450);
    }, reduce ? 200 : 2100);
  });
  $('#closeLetter').addEventListener('click', () => {
    paper.hidden = true; paper.classList.remove('show');
    wrap.classList.remove('gone'); env.classList.remove('open'); opened = false;
    $('#envHint').textContent = '💌 tap the envelope';
    setTimeout(() => wrap.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
  });

  /* ── finale ── */
  buildSky($('#finaleSky'), 0, 60);
  const field = $('#balloonField'), FB = ['#ff9bb8', '#ffd3b6', '#bde3ff', '#d9c8ff', '#fff1a8', '#b8f0d4', '#ffb3d1', '#ff8fc0'];
  function spawnBalloon() {
    if (field.childElementCount > 18) return;
    const left = Math.random() < .5, c = pick(FB);
    const b = document.createElement('i');
    b.className = 'fb'; b.dataset.c = c;
    b.style.cssText = `--x:${(left ? rand(1, 24) : rand(70, 90)).toFixed(1)}%;--y:${rand(4, 72).toFixed(1)}%;--w:${rand(44, 80).toFixed(0)}px;--c:${c};--dur:${rand(2.4, 4.4).toFixed(1)}s;--dl:-${rand(0, 3).toFixed(1)}s`;
    field.appendChild(b);
  }
  for (let i = 0; i < (innerWidth < 600 ? 8 : 12); i++) spawnBalloon();
  function popBalloon(b) {
    if (b.classList.contains('pop')) return;
    const r = b.getBoundingClientRect();
    fx.pop(r.left + r.width / 2, r.top + r.height / 2, b.dataset.c); music.pop();
    b.classList.add('pop');
    setTimeout(() => { b.remove(); setTimeout(spawnBalloon, 2600); }, 240);
  }
  field.addEventListener('click', e => { const b = e.target.closest('.fb'); if (b) popBalloon(b); });
  $('#popBtn').addEventListener('click', () => $$('.fb:not(.pop)', field).forEach((b, i) => setTimeout(() => popBalloon(b), i * 110)));
  const bigShow = () => {
    for (let k = 0; k < 7; k++) setTimeout(() => fx.firework(), k * 250);
    fx.cannons(); fx.rain(60); fx.hearts(innerWidth / 2, innerHeight, 12); music.chime();
  };
  $('#moreBtn').addEventListener('click', bigShow);
  $('#replayAll').addEventListener('click', () => {
    story.scrollTo({ top: 0, behavior: 'auto' });
    asks = 0; applyAsk(); music.setMode('happy');
    go('loader'); runLoader();
  });
  const finaleFl = floaters($('#finaleFloaters'), ['💖', '✨', '🎈', '⭐', '💗', '🎉', '🌟'], 450);
  let celeb = 0, cn = 0;

  /* ── per-section hooks (start / stop effects only while visible) ── */
  const wFl = floaters($('#welcome .floaters'), ['💖', '💗', '✨', '🌸', '⭐', '🩷'], 550);
  let wSpark = 0;
  const H = {
    welcome: {
      on() { wFl.start(); if (!wSpark) wSpark = setInterval(() => fx.sparkle(rand(innerWidth * .1, innerWidth * .9), rand(innerHeight * .08, innerHeight * .6), 3), 600); },
      off() { wFl.stop(); clearInterval(wSpark); wSpark = 0; }
    },
    peach: {
      on() {
        peachFl.start();
        if (!catTimer) catTimer = setInterval(() => { const cs = $$('.cat'); catSay(pick(cs)); }, 2600);
      },
      off() { peachFl.stop(); clearInterval(catTimer); catTimer = 0; }
    },
    toons: {
      on() {
        if (!toonTimer) toonTimer = setInterval(() => talk(pick($$('#toonRow .toon[data-i]'))), 2200);
        if (!confTimer) confTimer = setInterval(() => fx.rain(14), 2400);
      },
      off() { clearInterval(toonTimer); clearInterval(confTimer); toonTimer = confTimer = 0; }
    },
    wishes: {
      on() {
        wishFl.start();
        if (!wishDone) { wishDone = true; typeWishes(); }
        if (!wishFw) wishFw = setInterval(() => fx.firework(), 3000);
      },
      off() { wishFl.stop(); clearInterval(wishFw); wishFw = 0; }
    },
    finale: {
      on() {
        finaleFl.start();
        if (celeb) return;
        fx.cannons(); fx.hearts(innerWidth / 2, innerHeight, 10);
        const run = () => {
          fx.firework(); if (cn % 2 === 0) fx.firework();
          if (cn % 3 === 0) fx.rain(24);
          if (cn % 4 === 0) fx.hearts(rand(innerWidth * .2, innerWidth * .8), innerHeight, 6);
          cn++;
        };
        run(); celeb = setInterval(run, 1700);
      },
      off() { finaleFl.stop(); clearInterval(celeb); celeb = 0; }
    }
  };
  const secIO = new IntersectionObserver(es => es.forEach(e => {
    const h = H[e.target.id]; if (!h) return;
    e.isIntersecting ? h.on() : h.off();
  }), { root: story, rootMargin: '-15% 0px -15% 0px', threshold: 0 });
  secs.forEach(s => secIO.observe(s));
}

/* ═══════════════ GLOBAL: music button, cursor magic, boot ═══════════════ */
function initGlobal() {
  const btn = $('#musicBtn'), ico = $('#musicIco');
  btn.addEventListener('click', () => {
    const on = music.toggle();
    btn.classList.add('used'); btn.classList.toggle('on', on);
    btn.setAttribute('aria-pressed', on); ico.textContent = on ? '🎶' : '🔇';
  });
  document.addEventListener('visibilitychange', () => (document.hidden ? music.pause() : music.resume()));

  let lastSp = 0;
  if (fine) addEventListener('pointermove', e => {
    const n = performance.now(); if (n - lastSp < 45) return; lastSp = n;
    fx.sparkle(e.clientX, e.clientY, 1);
  }, { passive: true });
  addEventListener('pointerdown', e => {
    if (e.target.closest && e.target.closest('.music-btn')) return;
    fx.hearts(e.clientX, e.clientY, 4); fx.sparkle(e.clientX, e.clientY, 6);
  }, { passive: true });
}

function boot() {
  $$('.sky').forEach(s => buildSky(s, s.closest('.finale') ? 0 : 6, 34));
  initAsk(); initGlobal(); applyAsk();
  hooks.loader.on();
  runLoader();
}
boot();

})();
