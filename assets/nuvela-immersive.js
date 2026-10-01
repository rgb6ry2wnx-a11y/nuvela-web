/* Nuvela — animaciones e interacciones (GSAP + Lenis). */

  (function () {
    'use strict';
    // NV = "Nuvela" — todo el código del home nuevo vive dentro de este objeto.
    const NV = (window.NV = {});
    const q = (s, r) => (r || document).querySelector(s);
    const qa = (s, r) => Array.from((r || document).querySelectorAll(s));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const hasGsap = !!(window.gsap && window.ScrollTrigger);
    const lang = () => (typeof currentLang !== 'undefined' ? currentLang : 'es');
    const isMobile = () => window.innerWidth <= 900;
    const GOLD = [[185, 155, 63], [205, 174, 85], [240, 222, 170]];

    if (!hasGsap) document.documentElement.classList.add('nv-static');
    if (fine) document.body.classList.add('nv-fine');

    // Ruido suave (para el "diseño generativo"): mezcla de senos, sin librerías.
    function noise(x, y, z) {
      return (Math.sin(x * 1.7 + z) * Math.cos(y * 1.3 - z * 0.7)
        + Math.sin((x + y) * 0.9 + z * 1.3) * 0.5
        + Math.sin(x * 0.5 - y * 2.1 + z * 0.4) * 0.35) / 1.85;
    }

    // ---------- Scroll suave (Lenis) ----------
    let lenis = null;
    if (hasGsap) gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis && !reduce) {
      lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95 });
      NV.lenis = lenis;
      if (hasGsap) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((t) => lenis.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
      } else {
        const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      }
    }
    // Zonas con su propio scroll (menú móvil, quiz, popup) — el scroll suave no las toca.
    qa('#drawer, #quiz-overlay, #lead-popup-overlay, .js-nav-products-list, #cart-toast')
      .forEach((el) => el.setAttribute('data-lenis-prevent', ''));

    NV.scrollTop = function () {
      if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
      else window.scrollTo(0, 0);
    };

    // ---------- Mouse global ----------
    const mouse = { x: -9999, y: -9999, active: false };
    window.addEventListener('pointermove', (e) => {
      mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
    }, { passive: true });
    window.addEventListener('mouseout', (e) => { if (!e.relatedTarget) { mouse.active = false; mouse.x = mouse.y = -9999; } });

    // ---------- Motor de animación: un solo requestAnimationFrame ----------
    // Cada canvas solo se dibuja si está en pantalla y si el home está activo.
    const loops = [];
    function addLoop(el, fn) {
      const L = { el, fn, visible: false };
      loops.push(L);
      if ('IntersectionObserver' in window) {
        new IntersectionObserver((ents) => ents.forEach((en) => { L.visible = en.isIntersecting; }), { rootMargin: '120px' }).observe(el);
      } else L.visible = true;
      return L;
    }
    function tick(t) {
      for (const L of loops) if (L.visible) L.fn(t);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    function fitCanvas(cv, maxDpr) {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr || 2);
      cv.width = Math.max(1, Math.round(r.width * dpr));
      cv.height = Math.max(1, Math.round(r.height * dpr));
      const ctx = cv.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { ctx, w: r.width, h: r.height, rect: r };
    }

    // =====================================================================
    // 1. HERO — "NUVELA" en partículas doradas
    // =====================================================================
    const hero = (function () {
      const cv = q('#nv-hero-canvas');
      const sec = q('#nv-hero');
      const slot = q('.nv-wordmark-slot');
      if (!cv || !sec || !slot) return null;
      let ctx, w = 0, h = 0, pts = [], dust = [], assembled = false, built = false;
      const state = { explode: 0 };

      function build() {
        const fit = fitCanvas(cv, 2);
        ctx = fit.ctx; const nw = fit.w, nh = fit.h;
        if (!nw || !nh) return;
        const secR = sec.getBoundingClientRect();
        const sr = slot.getBoundingClientRect();
        const cy = sr.top - secR.top + sr.height / 2;
        const off = document.createElement('canvas');
        off.width = Math.ceil(nw); off.height = Math.ceil(nh);
        const o = off.getContext('2d');
        let fs = (sr.height * 0.86) / 0.64; // altura de mayúsculas ≈ 64% del tamaño de letra
        const letters = 'NUVELA'.split('');
        const measure = () => {
          o.font = `500 ${fs}px "Cormorant Garamond", serif`;
          const ws = letters.map((l) => o.measureText(l).width);
          const sp = fs * 0.1;
          return { ws, sp, total: ws.reduce((a, b) => a + b, 0) + sp * (letters.length - 1) };
        };
        let m = measure();
        const maxW = nw * (nw < 700 ? 0.86 : 0.74);
        if (m.total > maxW) { fs *= maxW / m.total; m = measure(); }
        o.fillStyle = '#fff';
        o.textBaseline = 'alphabetic';
        let x = (nw - m.total) / 2;
        letters.forEach((l, i) => { o.fillText(l, x, cy + fs * 0.32); x += m.ws[i] + m.sp; });
        const data = o.getImageData(0, 0, off.width, off.height).data;
        let step = nw < 700 ? 3 : nw < 1300 ? 4 : 5;
        let found = [];
        const sample = () => {
          found = [];
          for (let y = 0; y < off.height; y += step) {
            for (let xx = 0; xx < off.width; xx += step) {
              if (data[(y * off.width + xx) * 4 + 3] > 130) found.push([xx, y]);
            }
          }
        };
        sample();
        while (found.length > 5200) { step += 1; sample(); }
        const old = pts;
        pts = found.map(([hx, hy], i) => {
          const prev = old[i];
          const ang = Math.random() * Math.PI * 2;
          const rad = Math.max(nw, nh) * (0.35 + Math.random() * 0.6);
          const sx = nw / 2 + Math.cos(ang) * rad, sy = nh / 2 + Math.sin(ang) * rad * 0.7;
          return {
            hx, hy, sx, sy,
            x: prev ? prev.x : (assembled ? hx : sx), y: prev ? prev.y : (assembled ? hy : sy),
            vx: 0, vy: 0,
            s: (nw < 700 ? 0.9 : 1.1) + Math.random() * (nw < 700 ? 1.1 : 1.6),
            c: Math.random() < 0.12 ? 2 : Math.random() < 0.55 ? 1 : 0,
            ph: Math.random() * 6.283,
          };
        }).sort((a, b) => a.c - b.c);
        if (!dust.length || Math.abs(nw - w) > 40) {
          dust = Array.from({ length: nw < 700 ? 50 : 110 }, () => ({
            x: Math.random() * nw, y: Math.random() * nh,
            v: 0.08 + Math.random() * 0.35, r: 0.4 + Math.random() * 1.4, ph: Math.random() * 6.283,
          }));
        }
        w = nw; h = nh; built = true;
        if (reduce) draw(0, true);
      }

      function draw(t, still) {
        if (!built) return;
        const time = t * 0.001;
        const r = sec.getBoundingClientRect();
        const mx = mouse.x - r.left, my = mouse.y - r.top;
        const E = state.explode;
        ctx.clearRect(0, 0, w, h);
        // polvo dorado ambiental
        for (const d of dust) {
          if (!still) { d.y -= d.v; d.x += Math.sin(time * 0.5 + d.ph) * 0.15; if (d.y < -5) { d.y = h + 5; d.x = Math.random() * w; } }
          ctx.globalAlpha = 0.12 + 0.25 * (0.5 + 0.5 * Math.sin(time * 1.6 + d.ph));
          ctx.fillStyle = 'rgb(205,174,85)';
          ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.283); ctx.fill();
        }
        // partículas del logo
        const k = assembled ? 0.04 : 0.006;
        const damp = assembled ? 0.86 : 0.94;
        const R = w < 700 ? 70 : 120, R2 = R * R;
        ctx.globalAlpha = Math.max(0, 1 - E * 1.05);
        let cur = -1;
        for (const p of pts) {
          let tx, ty;
          if (!assembled) {
            tx = p.sx + Math.sin(time * 0.4 + p.ph) * 30;
            ty = p.sy + Math.cos(time * 0.35 + p.ph) * 30;
          } else {
            tx = p.hx + Math.sin(time * 1.3 + p.ph) * 0.7;
            ty = p.hy + Math.cos(time * 1.1 + p.ph) * 0.7;
          }
          if (E > 0.001) {
            const a = noise(p.hx * 0.006, p.hy * 0.006, time * 0.25) * Math.PI * 2;
            tx += Math.cos(a) * E * w * 0.3 + (p.hx - w / 2) * E * 0.9;
            ty += Math.sin(a) * E * h * 0.3 - E * h * 0.35;
          }
          if (still) { p.x = tx; p.y = ty; }
          else {
            const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
            if (mouse.active && d2 < R2) {
              const d = Math.sqrt(d2) || 1, f = (1 - d / R) * 5.5;
              p.vx += (dx / d) * f; p.vy += (dy / d) * f;
            }
            p.vx = (p.vx + (tx - p.x) * k) * damp;
            p.vy = (p.vy + (ty - p.y) * k) * damp;
            p.x += p.vx; p.y += p.vy;
          }
          if (p.c !== cur) { cur = p.c; const c = GOLD[cur]; ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`; }
          ctx.fillRect(p.x, p.y, p.s, p.s);
        }
        ctx.globalAlpha = 1;
      }

      addLoop(sec, (t) => { if (!reduce) draw(t); });
      return {
        state,
        build,
        assemble() { assembled = true; },
        assembleNow() { assembled = true; pts.forEach((p) => { p.x = p.hx; p.y = p.hy; p.vx = p.vy = 0; }); },
      };
    })();

    // =====================================================================
    // Ondas generativas (manifiesto y cierre)
    // =====================================================================
    function waves(cv, opts) {
      if (!cv) return null;
      const o = Object.assign({ lines: 18, spread: 0.6, amp: 46, alpha: 0.22, speed: 0.15, center: 0.5 }, opts || {});
      let ctx, w = 0, h = 0;
      const api = { boost: 0 };
      api.build = () => { const f = fitCanvas(cv, 1.5); ctx = f.ctx; w = f.w; h = f.h; };
      function draw(t) {
        if (!ctx) return;
        const time = t * 0.001 * o.speed * 6;
        const r = cv.getBoundingClientRect();
        const mx = mouse.x - r.left, my = mouse.y - r.top;
        const inside = mouse.active && mx > 0 && mx < w && my > 0 && my < h;
        ctx.clearRect(0, 0, w, h);
        ctx.lineWidth = 1;
        const step = w < 700 ? 10 : 14;
        for (let i = 0; i < o.lines; i++) {
          const f = i / (o.lines - 1);
          const y0 = h * (o.center - o.spread / 2 + f * o.spread);
          const mid = 1 - Math.abs(f - 0.5) * 2;
          ctx.strokeStyle = `rgba(205,174,85,${(0.04 + mid * o.alpha) * (1 + api.boost)})`;
          ctx.beginPath();
          for (let x = -10; x <= w + 10; x += step) {
            let y = y0 + noise(x * 0.0022, i * 0.18, time) * o.amp * (1 + api.boost)
              + Math.sin(x * 0.004 + time * 2 + i * 0.35) * o.amp * 0.35;
            if (inside) {
              const g = Math.exp(-((x - mx) ** 2) / (2 * 140 * 140));
              y += (my - y0) * 0.35 * g * mid;
            }
            if (x === -10) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }
      addLoop(cv, draw);
      return api;
    }
    const manifestoWaves = waves(q('#nv-waves-canvas'), { lines: 22, spread: 0.9, amp: 54, alpha: 0.16 });
    const finalWaves = waves(q('#nv-final-canvas'), { lines: 28, spread: 0.55, amp: 70, alpha: 0.3, center: 0.55 });

    // =====================================================================
    // 5. Simulación de resortes (encapsulados vs tradicionales)
    // =====================================================================
    const springs = (function () {
      const cv = q('#nv-springs-canvas');
      if (!cv) return null;
      let ctx, w = 0, h = 0, grid = [], sp = 20, mode = 'nuvela';
      const ptr = { x: 0, y: 0, on: false, I: 0, lx: -999, ly: -999 };
      const ripples = []; // ondas que salen del cursor cuando te mueves
      let shown = 0, frame = 0, lastAuto = 0, pm = 0, jolt = 0;
      const valEl = q('#nv-meter-val'), fillEl = q('#nv-meter-fill');

      // Foto opcional de la pareja dormida (vista desde arriba, PNG sin fondo).
      // Si existe images/home/pareja-dormida.png se usa esa; si no, se dibuja
      // una silueta elegante en dorado.
      const partnerImg = new Image();
      let partnerOk = false;
      partnerImg.onload = () => { partnerOk = true; };
      partnerImg.src = '/images/home/pareja-dormida.png';

      function build() {
        const f = fitCanvas(cv, 2); ctx = f.ctx; w = f.w; h = f.h;
        const cols = w < 500 ? 15 : 24;
        sp = w / cols;
        grid = [];
        const rowH = sp * 0.87;
        for (let r = 0, y = rowH * 0.9; y < h - rowH * 0.4; r++, y += rowH) {
          for (let x = (r % 2 ? sp : sp / 2); x < w; x += sp) grid.push({ x, y, d: 0 });
        }
      }
      function spawn(x, y, amp) {
        ripples.push({ x, y, t0: performance.now(), amp: Math.min(1.3, amp) });
        if (ripples.length > (mode === 'trad' ? 8 : 14)) ripples.shift();
      }
      function onPtr(e, force) {
        const r = cv.getBoundingClientRect();
        ptr.x = Math.min(e.clientX - r.left, w * 0.52); ptr.y = e.clientY - r.top; ptr.on = true;
        const dist = Math.hypot(ptr.x - ptr.lx, ptr.y - ptr.ly);
        if (force || dist > sp * 1.3) {
          spawn(ptr.x, ptr.y, force ? 0.9 : 0.3 + dist / (sp * 3.5));
          ptr.lx = ptr.x; ptr.ly = ptr.y;
        }
      }
      cv.addEventListener('pointermove', (e) => onPtr(e, false));
      cv.addEventListener('pointerdown', (e) => onPtr(e, true));
      cv.addEventListener('pointerleave', () => { ptr.on = false; });
      qa('.nv-toggle button').forEach((b) => b.addEventListener('click', () => {
        mode = b.dataset.mode;
        qa('.nv-toggle button').forEach((x) => x.classList.toggle('is-on', x === b));
      }));

      // Silueta de una mujer dormida vista desde arriba (cabeza arriba)
      function drawSleeper(cx, cy, u, time) {
        const shake = Math.sin(time * 26) * jolt * u * 0.05;
        const tilt = Math.sin(time * 19) * jolt * 0.07;
        const breathe = 1 + Math.sin(time * 1.6) * 0.012 * (1 - Math.min(1, jolt * 2));
        ctx.save();
        ctx.translate(cx + shake, cy);
        ctx.rotate(tilt);
        ctx.scale(breathe, breathe);
        if (partnerOk) {
          const ih = u * 1.05, iw = ih * (partnerImg.width / partnerImg.height);
          ctx.globalAlpha = 0.95;
          ctx.drawImage(partnerImg, -iw / 2, -ih / 2, iw, ih);
          ctx.globalAlpha = 1;
          ctx.restore();
          return;
        }
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        // almohada
        ctx.fillStyle = 'rgba(40,37,32,.9)'; ctx.strokeStyle = 'rgba(205,174,85,.5)'; ctx.lineWidth = 1;
        roundRect(-0.24 * u, -0.52 * u, 0.48 * u, 0.2 * u, 0.06 * u); ctx.fill(); ctx.stroke();
        // cabello largo extendido sobre la almohada
        ctx.fillStyle = 'rgba(185,155,63,.55)';
        ctx.beginPath();
        ctx.moveTo(-0.02 * u, -0.47 * u);
        ctx.bezierCurveTo(-0.16 * u, -0.5 * u, -0.2 * u, -0.38 * u, -0.17 * u, -0.3 * u);
        ctx.bezierCurveTo(-0.15 * u, -0.24 * u, -0.1 * u, -0.25 * u, -0.07 * u, -0.29 * u);
        ctx.bezierCurveTo(-0.02 * u, -0.27 * u, 0.06 * u, -0.27 * u, 0.09 * u, -0.31 * u);
        ctx.bezierCurveTo(0.14 * u, -0.27 * u, 0.2 * u, -0.33 * u, 0.15 * u, -0.41 * u);
        ctx.bezierCurveTo(0.12 * u, -0.49 * u, 0.04 * u, -0.5 * u, -0.02 * u, -0.47 * u);
        ctx.fill();
        // rostro (de lado, mirando a la izquierda)
        ctx.fillStyle = 'rgba(232,214,182,.9)';
        ctx.beginPath(); ctx.ellipse(-0.015 * u, -0.37 * u, 0.062 * u, 0.078 * u, -0.25, 0, 6.283); ctx.fill();
        // cobija (cuerpo de lado, hombro y cadera marcados)
        ctx.fillStyle = 'rgba(30,28,24,.88)'; ctx.strokeStyle = 'rgba(205,174,85,.8)'; ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-0.17 * u, -0.27 * u);
        ctx.bezierCurveTo(-0.24 * u, -0.18 * u, -0.22 * u, -0.02 * u, -0.17 * u, 0.06 * u);
        ctx.bezierCurveTo(-0.24 * u, 0.16 * u, -0.22 * u, 0.36 * u, -0.14 * u, 0.5 * u);
        ctx.lineTo(0.14 * u, 0.5 * u);
        ctx.bezierCurveTo(0.2 * u, 0.32 * u, 0.2 * u, 0.12 * u, 0.15 * u, 0.02 * u);
        ctx.bezierCurveTo(0.2 * u, -0.08 * u, 0.2 * u, -0.22 * u, 0.13 * u, -0.27 * u);
        ctx.bezierCurveTo(0.05 * u, -0.25 * u, -0.08 * u, -0.25 * u, -0.17 * u, -0.27 * u);
        ctx.fill(); ctx.stroke();
        // brazo sobre la cobija
        ctx.strokeStyle = 'rgba(240,222,190,.85)'; ctx.lineWidth = Math.max(2, u * 0.035);
        ctx.beginPath(); ctx.moveTo(-0.12 * u, -0.2 * u);
        ctx.bezierCurveTo(-0.16 * u, -0.08 * u, -0.08 * u, 0.0, 0.04 * u, -0.02 * u); ctx.stroke();
        // pliegues de la cobija
        ctx.strokeStyle = 'rgba(205,174,85,.35)'; ctx.lineWidth = 1;
        [[-0.1, 0.12, 0.08, 0.16], [-0.12, 0.28, 0.1, 0.3], [-0.06, 0.4, 0.09, 0.43]].forEach(([x1, y1, x2, y2]) => {
          ctx.beginPath(); ctx.moveTo(x1 * u, y1 * u); ctx.quadraticCurveTo(0, (y1 + 0.04) * u, x2 * u, y2 * u); ctx.stroke();
        });
        ctx.restore();
      }
      function roundRect(x, y, ww, hh, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y); ctx.arcTo(x + ww, y, x + ww, y + hh, r); ctx.arcTo(x + ww, y + hh, x, y + hh, r);
        ctx.arcTo(x, y + hh, x, y, r); ctx.arcTo(x, y, x + ww, y, r); ctx.closePath();
      }

      function draw(t) {
        if (!ctx) return;
        const now = performance.now();
        const time = t * 0.001;
        let px, py, I;
        if (ptr.on) { px = ptr.x; py = ptr.y; I = 1; }
        else {
          // demo automática: alguien dándose vuelta en el lado izquierdo
          px = w * 0.25 + Math.sin(time * 0.7) * w * 0.12;
          py = h * 0.5 + Math.sin(time * 1.1) * h * 0.26;
          I = 0.65 + 0.35 * Math.sin(time * 2.2);
          if (now - lastAuto > 1100) { spawn(px, py, 0.7); lastAuto = now; }
        }
        ptr.I += (I - ptr.I) * 0.1;
        const trad = mode === 'trad';
        const sig = sp * 1.6, sig2 = 2 * sig * sig;
        const speed = trad ? 520 : 300;          // px por segundo de cada onda
        const band = sp * (trad ? 1.3 : 0.9);    // grosor de la onda
        // quitar ondas viejas
        for (let i = ripples.length - 1; i >= 0; i--) if ((now - ripples[i].t0) > (trad ? 2600 : 1100)) ripples.splice(i, 1);
        ctx.clearRect(0, 0, w, h);

        // anillos de las ondas (exagerados)
        for (const rp of ripples) {
          const age = (now - rp.t0) / 1000, rad = age * speed;
          const fade = trad ? Math.exp(-age * 1.1) : Math.exp(-age * 3.2) * Math.exp(-rad / (sp * 5));
          if (fade < 0.02) continue;
          for (let k = 0; k < (trad ? 3 : 2); k++) {
            const rr = rad - k * sp * 0.9;
            if (rr <= 0) continue;
            ctx.strokeStyle = `rgba(205,174,85,${fade * rp.amp * (0.38 - k * 0.12)})`;
            ctx.lineWidth = (trad ? 1.6 : 1.1) - k * 0.35;
            ctx.beginPath(); ctx.arc(rp.x, rp.y, rr, 0, 6.283); ctx.stroke();
          }
        }

        const zx = w * 0.62;
        let pSum = 0, pN = 0;
        for (const s of grid) {
          const dx = s.x - px, dy = s.y - py, dist2 = dx * dx + dy * dy;
          let target = ptr.I * Math.exp(-dist2 / sig2) * (trad ? 0.8 : 1.15);
          let push = 0;
          for (const rp of ripples) {
            const age = (now - rp.t0) / 1000, rad = age * speed;
            const dd = Math.hypot(s.x - rp.x, s.y - rp.y);
            const fade = trad ? Math.exp(-age * 1.1) : Math.exp(-age * 3.2) * Math.exp(-dd / (sp * 3.2));
            const wv = rp.amp * fade * Math.exp(-((dd - rad) ** 2) / (2 * band * band));
            target += wv * (trad ? 0.6 : 0.65);
            push += wv;
          }
          if (trad) target += ptr.I * 0.1 * Math.exp(-Math.sqrt(dist2) / (w * 0.6)) * (0.6 + 0.4 * Math.sin(Math.sqrt(dist2) * 0.05 - time * 9));
          s.d += (target - s.d) * 0.28;
          if (s.x > zx) { pSum += s.d; pN++; }
          const d = Math.min(1.4, s.d);
          const dn = Math.min(1, d);
          const rr = sp * 0.38 * (1 - dn * 0.5);
          const c0 = GOLD[1], c1 = GOLD[2];
          const cr = Math.round(c0[0] + (c1[0] - c0[0]) * dn), cg = Math.round(c0[1] + (c1[1] - c0[1]) * dn), cb = Math.round(c0[2] + (c1[2] - c0[2]) * dn);
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${0.3 + dn * 0.7})`;
          ctx.lineWidth = 1 + dn * 0.8;
          ctx.beginPath(); ctx.arc(s.x, s.y, rr, 0, 6.283); ctx.stroke();
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(s.x, s.y, rr * 0.55, 0, 6.283); ctx.stroke();
          if (dn > 0.04) {
            ctx.fillStyle = `rgba(${cr},${cg},${cb},${dn * 0.6})`;
            ctx.beginPath(); ctx.arc(s.x, s.y, rr * 0.55, 0, 6.283); ctx.fill();
          }
          if (push > 0.35) { // destello en la cresta de la onda
            ctx.fillStyle = `rgba(255,240,200,${Math.min(0.3, push * 0.25)})`;
            ctx.beginPath(); ctx.arc(s.x, s.y, rr * 1.15, 0, 6.283); ctx.fill();
          }
        }

        // tú (el cursor)
        const g = ctx.createRadialGradient(px, py, 0, px, py, sp * 3.2);
        g.addColorStop(0, `rgba(252,249,245,${0.22 * ptr.I})`); g.addColorStop(1, 'rgba(252,249,245,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, sp * 3.2, 0, 6.283); ctx.fill();
        ctx.strokeStyle = 'rgba(252,249,245,.7)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(px, py, sp * 0.9, 0, 6.283); ctx.stroke();

        // tu pareja dormida
        pm = pN ? pSum / pN : 0;
        jolt += (Math.min(1, pm * 3.2) - jolt) * 0.12;
        ctx.setLineDash([4, 6]);
        ctx.strokeStyle = `rgba(205,174,85,${0.22 + Math.min(0.6, pm * 3)})`;
        ctx.strokeRect(zx, 14, w - zx - 14, h - 28);
        ctx.setLineDash([]);
        const u = Math.min((w - zx) * 1.25, h * 0.7);
        drawSleeper(zx + (w - zx - 14) / 2, h * 0.52, u, time);
        // "Zzz" cuando duerme tranquila
        const calm = Math.max(0, 1 - jolt * 2.5);
        if (calm > 0.05) {
          ctx.fillStyle = `rgba(205,174,85,${0.7 * calm})`;
          ctx.font = `600 ${Math.round(sp * 0.55)}px Inter, sans-serif`;
          for (let k = 0; k < 3; k++) {
            const ph = (time * 0.5 + k / 3) % 1;
            ctx.globalAlpha = calm * Math.sin(ph * Math.PI);
            ctx.fillText('z', zx + (w - zx) * 0.68 + ph * sp * 1.2, h * 0.2 - ph * sp * 1.6 + k * 2);
          }
          ctx.globalAlpha = 1;
        }

        // medidor
        const pct = Math.min(100, Math.round((pm / Math.max(0.2, ptr.I)) * 220));
        shown += (pct - shown) * 0.12;
        if (++frame % 6 === 0) {
          if (valEl) valEl.textContent = Math.round(shown) + '%';
          if (fillEl) fillEl.style.width = Math.round(shown) + '%';
        }
      }
      addLoop(cv, draw);
      return { build };
    })();

    // =====================================================================
    // Textos que se encienden palabra por palabra
    // =====================================================================
    function splitWords(el) {
      const txt = el.getAttribute('data-nv-' + lang()) || el.getAttribute('data-nv-es') || '';
      el.setAttribute('aria-label', txt.replace(/\*/g, ''));
      el.innerHTML = txt.split(/\s+/).map((word) => {
        const gold = /^\*.*\*$/.test(word);
        const clean = word.replace(/\*/g, '');
        return `<span class="nv-w${gold ? ' nv-gold' : ''}" aria-hidden="true">${clean}</span>`;
      }).join(' ');
    }

    // =====================================================================
    // 6. Colección (sale del arreglo PRODUCTS del catálogo)
    // =====================================================================
    NV.renderCollection = function () {
      const track = q('#nv-collection-track');
      if (!track || typeof PRODUCTS === 'undefined') return;
      const es = lang() === 'es';
      const list = PRODUCTS.filter((p) => p.mainImage && !/logosinfondo/.test(p.mainImage));
      track.innerHTML = list.map((p, i) => {
        const pf = typeof priceFrom === 'function' ? priceFrom(p) : '';
        const price = /^Q/.test(pf) ? (es ? 'Desde ' : 'From ') + pf : pf;
        const name = typeof pick === 'function' ? pick(p.name) : p.name.es;
        const cat = typeof pick === 'function' ? pick(p.category) : p.category.es;
        return `
          <article class="nv-pcard js-view-product" data-product-id="${p.id}" data-cursor="view">
            <div class="nv-pcard-media">
              <span class="nv-pcard-idx">${String(i + 1).padStart(2, '0')}</span>
              <img src="${p.mainImage}" alt="${name}" loading="lazy" />
            </div>
            <div class="nv-pcard-info">
              <div><p>${cat}</p><h3>${name}</h3></div>
              <span class="nv-pcard-price">${price}</span>
            </div>
          </article>`;
      }).join('') + `
          <article class="nv-pcard nv-pcard-more" data-page="producto" data-cursor="view">
            <div class="nv-pcard-media"><span>${es ? 'Ver catálogo completo →' : 'View full catalog →'}</span></div>
          </article>`;
    };

    // =====================================================================
    // Cursor dorado + botones magnéticos (solo con mouse)
    // =====================================================================
    if (fine && hasGsap) {
      const cur = q('#nv-cursor'), label = q('#nv-cursor span');
      const cx = gsap.quickTo(cur, 'x', { duration: 0.45, ease: 'power3' });
      const cy = gsap.quickTo(cur, 'y', { duration: 0.45, ease: 'power3' });
      window.addEventListener('pointermove', (e) => { cx(e.clientX); cy(e.clientY); }, { passive: true });
      document.addEventListener('pointerover', (e) => {
        const view = e.target.closest('[data-cursor="view"]');
        const hov = e.target.closest('a, button, .nv-toggle, #nv-springs-canvas, .nv-layers-stage');
        cur.classList.toggle('is-view', !!view);
        cur.classList.toggle('is-hover', !view && !!hov);
        if (view) label.textContent = lang() === 'es' ? 'Ver' : 'View';
      });
      document.addEventListener('pointerover', (e) => {
        const m = e.target.closest('.nv-magnetic');
        if (!m || m._nvMag) return;
        m._nvMag = true;
        const xT = gsap.quickTo(m, 'x', { duration: 0.6, ease: 'power3' });
        const yT = gsap.quickTo(m, 'y', { duration: 0.6, ease: 'power3' });
        m.addEventListener('pointermove', (ev) => {
          const r = m.getBoundingClientRect();
          xT((ev.clientX - (r.left + r.width / 2)) * 0.32);
          yT((ev.clientY - (r.top + r.height / 2)) * 0.32);
        });
        m.addEventListener('pointerleave', () => {
          gsap.to(m, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, .4)' });
        });
      });
      // Tarjetas "Por qué Nuvela": inclinación 3D + luz que sigue al mouse
      qa('.nv-tilt').forEach((c) => {
        const rx = gsap.quickTo(c, 'rotationX', { duration: 0.6, ease: 'power3' });
        const ry = gsap.quickTo(c, 'rotationY', { duration: 0.6, ease: 'power3' });
        c.addEventListener('pointermove', (e) => {
          const r = c.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
          c.style.setProperty('--mx', px * 100 + '%'); c.style.setProperty('--my', py * 100 + '%');
          ry((px - 0.5) * 10); rx(-(py - 0.5) * 10);
        });
        c.addEventListener('pointerleave', () => { rx(0); ry(0); });
      });
    }

    // =====================================================================
    // 4. Capas: tocar una capa (o su número) muestra cuál es
    // =====================================================================
    let layersReady = !hasGsap;
    let activeLayer = -1;
    function selectLayer(i) {
      if (!layersReady) return;
      activeLayer = (i === activeLayer) ? -1 : i;
      qa('.nv-layer[data-l]').forEach((el) => {
        const n = Number(el.dataset.l);
        el.classList.toggle('is-active', n === activeLayer);
        el.classList.toggle('is-dim', activeLayer >= 0 && n !== activeLayer);
        if (hasGsap) gsap.to(el, { x: n === activeLayer && !isMobile() ? -22 : 0, duration: 0.7, ease: 'expo.out' });
      });
      qa('.nv-cap').forEach((c) => c.classList.toggle('is-on', Number(c.dataset.c) === activeLayer));
      const hint = q('.nv-layer-hint');
      if (hint) hint.classList.toggle('is-on', activeLayer < 0);
    }
    (function () {
      const stage = q('.nv-layers-stage');
      if (!stage) return;
      stage.addEventListener('click', (e) => {
        const hot = e.target.closest('.nv-hot');
        if (hot) { selectLayer(Number(hot.dataset.l)); return; }
        // ¿Qué capa se tocó? La que tenga su centro más cerca del punto tocado.
        let best = -1, bestD = Infinity;
        qa('.nv-layer[data-l]', stage).forEach((el) => {
          const r = el.getBoundingClientRect();
          if (e.clientX < r.left || e.clientX > r.right) return;
          const d = Math.abs(e.clientY - (r.top + r.height / 2));
          if (d < bestD) { bestD = d; best = Number(el.dataset.l); }
        });
        if (best >= 0) selectLayer(best);
      });
    })();

    // =====================================================================
    // Animaciones de scroll del home (se crean al entrar al home y se
    // destruyen al salir, porque el sitio cambia de "página" sin recargar).
    // =====================================================================
    let gctx = null;
    function buildScroll() {
      if (!hasGsap) return;
      const mobile = isMobile();
      gctx = gsap.context(() => {
        // --- Hero: el logo se dispersa, la foto se acerca, el texto se va
        if (hero) {
          ScrollTrigger.create({
            trigger: '#nv-hero', start: 'top top', end: 'bottom top', scrub: true,
            onUpdate: (s) => { hero.state.explode = s.progress * s.progress * 1.4; },
          });
        }
        gsap.to('.nv-hero-photo', { scale: 1.35, yPercent: -12, ease: 'none', scrollTrigger: { trigger: '#nv-hero', start: 'top top', end: 'bottom top', scrub: true } });
        gsap.to('.nv-hero-copy, .nv-scroll-cue', { opacity: 0, y: -80, ease: 'none', scrollTrigger: { trigger: '#nv-hero', start: 'top top', end: '55% top', scrub: true } });

        // --- Manifiesto: palabras que se encienden
        const mWords = qa('#nv-manifesto .nv-w');
        if (mWords.length) {
          gsap.timeline({ scrollTrigger: { trigger: '#nv-manifesto', start: 'top top', end: '+=130%', pin: true, scrub: 0.6,
            onUpdate: (s) => { if (manifestoWaves) manifestoWaves.boost = s.progress * 0.8; } } })
            .to(mWords, { opacity: 1, stagger: 0.12, ease: 'none', duration: 0.5 });
        }

        // --- Revelación de la foto
        const startClip = mobile ? 'inset(30% 8% 30% 8% round 22px)' : 'inset(22% 30% 22% 30% round 28px)';
        gsap.set('.nv-reveal-media', { clipPath: startClip });
        const counters = qa('.nv-stat b');
        const cObj = { p: 0 };
        gsap.timeline({ scrollTrigger: { trigger: '#nv-reveal', start: 'top top', end: '+=170%', pin: true, scrub: 0.8 } })
          .to('.nv-reveal-media', { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.inOut', duration: 4 }, 0)
          .to('.nv-reveal-media img', { scale: 1, ease: 'power2.inOut', duration: 4 }, 0)
          .to('.nv-reveal-scrim', { opacity: 1, duration: 1.5 }, 2.6)
          .fromTo('.nv-reveal-copy', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.5 }, 3)
          .fromTo('.nv-stats', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2 }, 3.8)
          .to(cObj, { p: 1, duration: 2, ease: 'power1.out', onUpdate: () => {
            counters.forEach((b) => { b.textContent = Math.round(cObj.p * Number(b.dataset.count)); });
          } }, 3.8)
          .to({}, { duration: 1.2 });

        // --- Colchón desarmado en capas
        // --- Colchón desarmado: se abre solo una vez al llegar; luego es interactivo
        const layers = qa('.nv-layer[data-l]').sort((a, b) => a.dataset.l - b.dataset.l);
        const stage = q('.nv-layers-stage');
        const spread = [-0.36, -0.12, 0.12, 0.35];
        // En el teléfono las capas se separan según el espacio libre que hay
        // entre el título y el texto de abajo, para que no queden pegadas.
        let offsets = () => spread.map((v) => v * stage.offsetWidth);
        if (mobile) {
          const head = q('.nv-layers-head'), caps = q('.nv-layer-captions');
          const band = () => ({ top: head.offsetTop + head.offsetHeight + 18, bottom: caps.offsetTop - 6 });
          const bd = band();
          gsap.set(stage, { top: (bd.top + bd.bottom) / 2 });
          offsets = () => {
            const b = band();
            const lh = Math.max.apply(null, layers.map((l) => l.offsetHeight)) * 0.9;
            const span = Math.max(0.7 * stage.offsetWidth, (b.bottom - b.top - lh) / 0.9);
            return [-0.5, -0.19, 0.15, 0.5].map((v) => v * span);
          };
        }
        layersReady = false;
        gsap.timeline({ scrollTrigger: { trigger: '#nv-layers', start: 'top 55%', once: true },
          onComplete: () => { layersReady = true; } })
          .fromTo('.nv-layers-head', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out' }, 0)
          .fromTo('.nv-layer-full', { opacity: 0, scale: 0.9, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'expo.out' }, 0.1)
          .set(layers, { opacity: 1 }, 1.3)
          .set('.nv-layer-full', { opacity: 0 }, 1.32)
          .to(layers, { y: (i) => offsets()[i], duration: 1.6, ease: 'expo.inOut', stagger: 0.04 }, 1.32)
          .to(stage, { scale: mobile ? 0.9 : 0.92, duration: 1.6, ease: 'expo.inOut' }, 1.32)
          .to('.nv-hot', { opacity: 1, duration: 0.6, stagger: 0.08 }, 2.6);
        const track = q('#nv-collection-track');
        if (track && !mobile) {
          const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
          const htw = gsap.to(track, { x: () => -dist(), ease: 'none',
            scrollTrigger: { trigger: '#nv-collection', start: 'top top', end: () => '+=' + dist(), pin: '.nv-collection-pin', scrub: 0.8, invalidateOnRefresh: true } });
          qa('.nv-pcard-media img', track).forEach((img) => {
            gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: img.closest('.nv-pcard'), containerAnimation: htw, start: 'left right', end: 'right left', scrub: true } });
          });
          // El título se desvanece cuando las tarjetas pasan por debajo
          gsap.to('.nv-collection-head', { opacity: 0, x: -40, ease: 'none', scrollTrigger: { trigger: '#nv-collection', start: 'top top', end: () => '+=' + window.innerWidth * 0.3, scrub: true } });
          gsap.from('.nv-collection-head > *', { opacity: 0, y: 40, stagger: 0.1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '#nv-collection', start: 'top 70%' } });
        } else if (track) {
          gsap.from('.nv-pcard', { opacity: 0, x: 60, stagger: 0.08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: track, start: 'top 85%' } });
        }

        // --- Marquesina: acelera con la velocidad del scroll
        const rows = qa('.nv-marquee-row');
        const tweens = rows.map((row) => {
          const inner = q('.nv-marquee-inner', row);
          const dir = Number(row.dataset.dir);
          return gsap.fromTo(inner, { xPercent: dir < 0 ? 0 : -50 }, { xPercent: dir < 0 ? -50 : 0, duration: 60, ease: 'none', repeat: -1 });
        });
        ScrollTrigger.create({
          trigger: '#nv-marquee', start: 'top bottom', end: 'bottom top',
          onUpdate: (s) => {
            const v = Math.min(3, 1 + Math.abs(s.getVelocity()) / 600);
            tweens.forEach((tw) => gsap.to(tw, { timeScale: v, duration: 0.2, overwrite: true, onComplete: () => gsap.to(tw, { timeScale: 1, duration: 1.2 }) }));
          },
        });

        // --- Títulos que suben al aparecer
        qa('#nv-springs .nv-springs-copy > *, #nv-why .nv-why-head > *, #nv-gallery .nv-gallery-head > *, #nv-final .nv-final-inner > *').forEach((el) => {
          gsap.from(el, { opacity: 0, y: 50, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } });
        });
        gsap.from('.nv-springs-bed', { opacity: 0, scale: 0.92, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.nv-springs-bed', start: 'top 85%', toggleActions: 'play none none reverse' } });
        gsap.from('.nv-card', { opacity: 0, y: 80, rotationX: -14, stagger: 0.08, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.nv-why-grid', start: 'top 82%', toggleActions: 'play none none reverse' } });

        // --- Testimonio
        const vWords = qa('#nv-voice .nv-w');
        if (vWords.length) gsap.to(vWords, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: '#nv-voice', start: 'top 70%', end: 'bottom 70%', scrub: 0.6 } });

        // --- Galería con parallax
        qa('.nv-g').forEach((g) => {
          const s = Number(g.dataset.speed || 0) * (mobile ? 0.5 : 1);
          gsap.fromTo(g, { y: s }, { y: -s, ease: 'none', scrollTrigger: { trigger: g, start: 'top bottom', end: 'bottom top', scrub: true } });
        });

        // --- Cierre: las ondas se intensifican al llegar
        ScrollTrigger.create({ trigger: '#nv-final', start: 'top bottom', end: 'center center', scrub: true,
          onUpdate: (s) => { if (finalWaves) finalWaves.boost = s.progress * 0.6; } });
      }, '#page-home');
    }

    // =====================================================================
    // PRODUCTOS y DETALLE DE PRODUCTO (mismo estilo inmersivo del home)
    // =====================================================================
    const prodWaves = waves(q('#nv-prod-canvas'), { lines: 30, spread: 1.05, amp: 80, alpha: 0.12, center: 0.55 });
    let pageCtx = null;

    function tiltCard(c, max) {
      if (!fine || !hasGsap || c._nvTilt) return;
      c._nvTilt = true;
      const rx = gsap.quickTo(c, 'rotationX', { duration: 0.6, ease: 'power3' });
      const ry = gsap.quickTo(c, 'rotationY', { duration: 0.6, ease: 'power3' });
      c.addEventListener('pointermove', (e) => {
        const r = c.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * max);
        rx(-((e.clientY - r.top) / r.height - 0.5) * max);
      });
      c.addEventListener('pointerleave', () => { rx(0); ry(0); });
    }

    // Tarjetas nuevas de la cuadrícula: entran con animación, se inclinan
    // con el mouse y muestran "Ver" en el cursor dorado.
    function animateCards(nodes) {
      const cards = nodes.filter((n) => n.nodeType === 1 && n.classList.contains('product-card'));
      if (!cards.length) return;
      cards.forEach((c) => { c.setAttribute('data-cursor', 'view'); tiltCard(c, 7); });
      if (hasGsap && !reduce) gsap.fromTo(cards, { opacity: 0, y: 60, rotationX: -10 }, { opacity: 1, y: 0, rotationX: 0, duration: 1.1, ease: 'expo.out', stagger: 0.07, clearProps: 'opacity,y' });
    }
    const pGrid = q('#products-grid');
    if (pGrid && 'MutationObserver' in window) {
      new MutationObserver((muts) => {
        if (!q('#page-producto.active')) return;
        animateCards(muts.flatMap((m) => Array.from(m.addedNodes)));
      }).observe(pGrid, { childList: true });
    }
    const pFilter = q('#products-filter');
    if (pFilter && 'MutationObserver' in window) {
      new MutationObserver(() => qa('#products-filter > *').forEach((b) => tiltCard(b, 9))).observe(pFilter, { childList: true });
    }

    // Precio grande del tamaño elegido (cuenta hacia el nuevo precio)
    const priceEl = q('#nv-pd-price'), priceSize = q('#nv-pd-price-size');
    const priceState = { v: 0 };
    function updatePrice() {
      if (!priceEl || typeof PRODUCTS === 'undefined' || typeof currentProductId === 'undefined') return;
      const p = PRODUCTS.find((x) => x.id === currentProductId);
      if (!p) return;
      const v = p.variants.find((x) => x.name === pdSelectedVariant) || p.variants[0];
      const tw = q('.nv-trust-warranty'); if (tw) tw.hidden = p.category.es !== 'Colchones';
      if (priceSize) priceSize.textContent = v ? v.name : '';
      if (!v || !v.price) { priceEl.textContent = typeof formatPrice === 'function' ? formatPrice(0) : ''; priceState.v = 0; return; }
      if (!hasGsap || reduce || !priceState.v) { priceState.v = v.price; priceEl.textContent = formatPrice(v.price); return; }
      gsap.to(priceState, { v: v.price, duration: 0.8, ease: 'power3.out', overwrite: true,
        onUpdate: () => { priceEl.textContent = formatPrice(Math.round(priceState.v / 10) * 10); },
        onComplete: () => { priceEl.textContent = formatPrice(v.price); } });
    }
    const pdSizes = q('#pd-sizes');
    if (pdSizes && 'MutationObserver' in window) new MutationObserver(updatePrice).observe(pdSizes, { childList: true });

    function enterProducts() {
      if (prodWaves) prodWaves.build();
      qa('#products-filter > *').forEach((b) => tiltCard(b, 9));
      if (!hasGsap || reduce) return;
      pageCtx = gsap.context(() => {
        gsap.fromTo('.nv-prod-hero-inner > *', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.1 });
        gsap.fromTo('#products-filter > *', { opacity: 0, y: 70, rotationX: -14 }, { opacity: 1, y: 0, rotationX: 0, duration: 1.2, ease: 'expo.out', stagger: 0.07, delay: 0.25 });
      }, '#page-producto');
    }
    function enterDetail() {
      priceState.v = 0; updatePrice();
      if (!hasGsap || reduce) return;
      pageCtx = gsap.context(() => {
        gsap.fromTo('.nv-pd-zoom', { opacity: 0, scale: 0.94, clipPath: 'inset(6% 6% 6% 6% round 28px)' }, { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 1.4, ease: 'expo.out' });
        gsap.fromTo('#pd-thumbs .thumb', { opacity: 0, y: 20 }, { opacity: (i, el) => (el.classList.contains('border-gold') ? 1 : 0.55), y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.05, delay: 0.3, clearProps: 'opacity' });
        gsap.fromTo('#pd-eyebrow, #pd-title, #pd-tagline', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08, delay: 0.1 });
        gsap.fromTo('#pd-stats > div', { opacity: 0, y: 24, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'expo.out', stagger: 0.04, delay: 0.35 });
        gsap.fromTo('.nv-pd-price, #pd-sizes > *, #pd-purchase', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05, delay: 0.5 });
        qa('#pd-benefits > div, #pd-specs-table, #pd-faq .faq-item').forEach((el) => {
          gsap.from(el, { opacity: 0, y: 50, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' } });
        });
        qa('#pd-benefits > div').forEach((c) => tiltCard(c, 8));
      }, '#page-producto-detalle');
      ScrollTrigger.refresh();
    }
    // ---- Foto principal del producto: si es vertical, se muestra vertical ----
    (function () {
      const img = q('#pd-main-img'), box = q('.nv-pd-zoom');
      if (!img || !box) return;
      const check = () => { if (img.naturalWidth) box.classList.toggle('is-portrait', img.naturalHeight > img.naturalWidth * 1.05); };
      img.addEventListener('load', check);
      if (img.complete) check();
    })();

    // ---- Scroll suave para los botones que llevan a otra parte de la página ----
    const nativeSIV = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function (opts) {
      if (lenis && opts && typeof opts === 'object' && opts.behavior === 'smooth') {
        const off = opts.block === 'center' ? -(window.innerHeight / 2 - this.offsetHeight / 2) : -110;
        lenis.scrollTo(this, { offset: off, duration: 1.2 });
      } else nativeSIV.call(this, opts);
    };
    document.addEventListener('click', (e) => {
      const b = e.target.closest('.js-nv-goto');
      if (!b) return;
      const t = q(b.dataset.target);
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // ---- Línea para Hoteles ----
    const pill = q('#nv-quote-pill'), pillCount = q('#nv-quote-count');
    function updatePill() {
      if (!pill) return;
      const n = typeof quoteCount === 'function' ? quoteCount() : 0;
      if (pillCount) pillCount.textContent = n;
      pill.classList.toggle('is-on', n > 0);
    }
    const qc = q('#quote-cart-content');
    if (qc && 'MutationObserver' in window) new MutationObserver(updatePill).observe(qc, { childList: true, subtree: true });
    function enterHotel() {
      updatePill();
      qa('#page-linea-hotelera .nv-tilt-h').forEach((c) => tiltCard(c, 8));
      qa('#hotel-products-grid .product-card').forEach((c) => tiltCard(c, 6));
      if (!hasGsap || reduce) return;
      const mobile = isMobile();
      pageCtx = gsap.context(() => {
        gsap.fromTo('.nv-hotel-hero-inner > *', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.1 });
        gsap.fromTo('.nv-hotel-strip > div', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08, delay: 0.5 });
        gsap.to('.nv-hotel-hero-bg', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.nv-hotel-hero', start: 'top top', end: 'bottom top', scrub: true } });
        qa('.nv-hotel-who .nv-eyebrow, .nv-hotel-who .nv-h2, .nv-hotel-catalog .nv-eyebrow, .nv-hotel-catalog .nv-h2, .nv-hotel-steps .nv-eyebrow, .nv-hotel-steps .nv-h2, .nv-hotel-cta .nv-wrap > *').forEach((el) => {
          gsap.from(el, { opacity: 0, y: 50, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } });
        });
        gsap.from('.nv-who', { opacity: 0, y: 70, rotationX: -12, duration: 1.2, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '.nv-who-grid', start: 'top 82%', toggleActions: 'play none none reverse' } });
        gsap.from('.nv-quote-panel', { opacity: 0, y: 40, scale: 0.98, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.nv-quote-panel', start: 'top 90%' } });
        gsap.from('#hotel-products-grid .product-card', { opacity: 0, y: 60, rotationX: -10, duration: 1.1, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: '#hotel-products-grid', start: 'top 85%' } });
        gsap.to('.nv-steps-line i', mobile ? { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.nv-steps', start: 'top 75%', end: 'bottom 60%', scrub: true } }
          : { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.nv-steps', start: 'top 80%', end: 'top 35%', scrub: true } });
        gsap.from('.nv-steps li', { opacity: 0, y: 40, duration: 1, ease: 'expo.out', stagger: 0.15, scrollTrigger: { trigger: '.nv-steps', start: 'top 80%', toggleActions: 'play none none reverse' } });
      }, '#page-linea-hotelera');
      ScrollTrigger.refresh();
    }

    // ---- Agenda tu Cita ----
    const citaWaves = waves(q('#nv-cita-canvas'), { lines: 24, spread: 0.9, amp: 60, alpha: 0.1, center: 0.5 });
    function enterCita() {
      if (citaWaves) citaWaves.build();
      qa('#page-cita .nv-tilt-c').forEach((c) => tiltCard(c, 8));
      const ph = q('.nv-cita-photo'); if (ph) tiltCard(ph, 5);
      if (!hasGsap || reduce) return;
      pageCtx = gsap.context(() => {
        gsap.fromTo('.nv-cita-copy > *', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.08 });
        gsap.fromTo('.nv-cita-photo', { opacity: 0, clipPath: 'inset(12% 12% 12% 12% round 30px)' }, { opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 30px)', duration: 1.6, ease: 'expo.out', delay: 0.15 });
        gsap.fromTo('.nv-cita-photo img', { scale: 1.25 }, { scale: 1.06, duration: 2.2, ease: 'expo.out', delay: 0.15 });
        gsap.fromTo('.nv-cita-badge', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', delay: 0.9 });
        qa('#page-cita .nv-wrap > .nv-eyebrow, #page-cita .nv-wrap > .nv-h2, #page-cita .nv-wrap > .nv-lead').forEach((el) => {
          gsap.from(el, { opacity: 0, y: 50, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } });
        });
        gsap.from('.nv-cita-cards .nv-card', { opacity: 0, y: 70, rotationX: -12, duration: 1.2, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.nv-cita-cards', start: 'top 82%', toggleActions: 'play none none reverse' } });
        gsap.from('#cita-calendar-wrap .grid > div', { opacity: 0, y: 50, scale: 0.96, duration: 1.1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '#cita-calendar-wrap', start: 'top 85%', toggleActions: 'play none none reverse' } });
        gsap.from('#cita-sucursales > div', { opacity: 0, y: 60, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '#cita-sucursales', start: 'top 85%' } });
      }, '#page-cita');
      ScrollTrigger.refresh();
    }

    // ---- Comparar productos ----
    const cmpWaves = waves(q('#nv-cmp-canvas'), { lines: 26, spread: 1, amp: 70, alpha: 0.11, center: 0.5 });
    let onlyDiff = false;
    function updateTray() {
      const tray = q('#nv-cmp-tray'), slots = q('.nv-cmp-slots');
      if (!tray || !slots || typeof compareIds === 'undefined') return;
      const ids = compareIds.slice(0, 3);
      slots.innerHTML = [0, 1, 2].map((i) => {
        const p = ids[i] ? PRODUCTS.find((x) => x.id === ids[i]) : null;
        return p ? `<span class="nv-cmp-slot is-full" title="${pick(p.name)}"><img src="${p.mainImage}" alt="" /></span>` : '<span class="nv-cmp-slot">+</span>';
      }).join('');
      tray.classList.toggle('is-on', ids.length > 0);
    }
    function decorateTable() {
      const wrap = q('#compare-table-wrap');
      if (!wrap) return;
      wrap.classList.toggle('nv-only-diff', onlyDiff);
      const body = q('.min-w-\\[520px\\]', wrap);
      if (!body) return;
      const rows = Array.from(body.children);
      const n = (typeof compareIds !== 'undefined') ? compareIds.length : 0;
      rows.slice(1, -1).forEach((row) => {
        const vals = Array.from(row.children).slice(1).map((c) => c.textContent.trim());
        const same = vals.every((v) => v === vals[0]);
        row.classList.toggle('nv-same', n > 1 && same);
        row.classList.toggle('nv-diff', n > 1 && !same);
      });
      const head = wrap.firstElementChild;
      if (head && n > 1 && !q('.nv-cmp-diff-toggle', head)) {
        head.insertAdjacentHTML('beforeend', `<div><label class="nv-cmp-diff-toggle" role="switch" tabindex="0"><i></i><span>${lang() === 'es' ? 'Ver solo diferencias' : 'Show only differences'}</span></label></div>`);
      }
      if (hasGsap && !reduce && q('#page-comparar.active')) {
        gsap.fromTo(rows, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.03, clearProps: 'opacity,transform' });
      }
    }
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nv-cmp-diff-toggle')) return;
      onlyDiff = !onlyDiff;
      const wrap = q('#compare-table-wrap'); if (wrap) wrap.classList.toggle('nv-only-diff', onlyDiff);
    });
    const cmpPick = q('#compare-picker'), cmpTable = q('#compare-table-wrap');
    if ('MutationObserver' in window) {
      if (cmpPick) new MutationObserver(() => { updateTray(); qa('#compare-picker .grid > div').forEach((c) => tiltCard(c, 6)); }).observe(cmpPick, { childList: true });
      if (cmpTable) new MutationObserver(decorateTable).observe(cmpTable, { childList: true });
    }
    function enterCompare() {
      if (cmpWaves) cmpWaves.build();
      updateTray(); decorateTable();
      qa('#compare-picker .grid > div').forEach((c) => tiltCard(c, 6));
      if (!hasGsap || reduce) return;
      pageCtx = gsap.context(() => {
        gsap.fromTo('.nv-cmp-hero-inner > *', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.1 });
        qa('#compare-picker > div').forEach((g, i) => {
          gsap.from(qa('.grid > div', g), { opacity: 0, y: 50, rotationX: -10, duration: 1.1, ease: 'expo.out', stagger: 0.06, delay: i === 0 ? 0.3 : 0,
            scrollTrigger: i === 0 ? undefined : { trigger: g, start: 'top 88%' } });
        });
      }, '#page-comparar');
      ScrollTrigger.refresh();
    }

    // ---- Tecnología ----
    const techWaves = waves(q('#nv-tech-canvas'), { lines: 22, spread: 0.7, amp: 60, alpha: 0.12, center: 0.45 });
    qa('#page-tecnologia .tech-tile').forEach((c) => c.addEventListener('pointermove', (e) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
      c.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
    }));
    // ---- Tecnología, opción A: explorador (lista + foto grande) ----
    let txTween = null, txAuto = true;
    function txSelect(i, fromUser) {
      const items = qa('.nv-tx-item');
      if (!items.length) return;
      if (fromUser) txAuto = false;
      items.forEach((it) => it.classList.toggle('is-on', Number(it.dataset.i) === i));
      qa('.nv-tx-img').forEach((im) => im.classList.toggle('is-on', Number(im.dataset.i) === i));
      const num = q('.nv-tx-tag-num'); if (num) num.textContent = String(i + 1).padStart(2, '0');
      if (txTween) { txTween.kill(); txTween = null; }
      qa('.nv-tx-bar i').forEach((b) => { b.style.transform = 'scaleX(0)'; });
      const bar = q(`.nv-tx-item[data-i="${i}"] .nv-tx-bar i`);
      if (!bar || !hasGsap) return;
      if (!txAuto) { bar.style.transform = 'scaleX(1)'; return; }
      txTween = gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 6, ease: 'none', onComplete: () => txSelect((i + 1) % items.length, false) });
    }
    document.addEventListener('click', (e) => {
      const it = e.target.closest('.nv-tx-item');
      if (it) txSelect(Number(it.dataset.i), true);
    });

    // ---- Tecnología, opción B: bento (resortes interactivos + cifras) ----
    const bentoSprings = (function () {
      const cv = q('.nv-b-springs .nv-b-canvas');
      if (!cv) return null;
      let ctx, w = 0, h = 0, pts = [], sp = 22;
      const m = { x: -999, y: -999 };
      cv.parentElement.addEventListener('pointermove', (e) => { const r = cv.getBoundingClientRect(); m.x = e.clientX - r.left; m.y = e.clientY - r.top; });
      cv.parentElement.addEventListener('pointerleave', () => { m.x = m.y = -999; });
      function build() {
        const f = fitCanvas(cv, 2); ctx = f.ctx; w = f.w; h = f.h;
        sp = Math.max(18, w / 18); pts = [];
        for (let r = 0, y = sp * 0.7; y < h; r++, y += sp * 0.87) for (let x = (r % 2 ? sp : sp / 2); x < w; x += sp) pts.push({ x, y, d: 0 });
      }
      function draw(t) {
        if (!ctx) return;
        const time = t * 0.001;
        const ax = m.x > -900 ? m.x : w * (0.5 + 0.3 * Math.sin(time * 0.6));
        const ay = m.x > -900 ? m.y : h * (0.35 + 0.15 * Math.cos(time * 0.8));
        ctx.clearRect(0, 0, w, h);
        for (const p of pts) {
          const dd = (p.x - ax) ** 2 + (p.y - ay) ** 2;
          p.d += (Math.exp(-dd / (2 * (sp * 1.4) ** 2)) - p.d) * 0.15;
          const rr = sp * 0.36 * (1 - p.d * 0.45);
          ctx.strokeStyle = `rgba(205,174,85,${0.22 + p.d * 0.75})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(p.x, p.y, rr, 0, 6.283); ctx.stroke();
          ctx.beginPath(); ctx.arc(p.x, p.y, rr * 0.5, 0, 6.283); ctx.stroke();
          if (p.d > 0.05) { ctx.fillStyle = `rgba(240,222,170,${p.d * 0.5})`; ctx.beginPath(); ctx.arc(p.x, p.y, rr * 0.5, 0, 6.283); ctx.fill(); }
        }
      }
      addLoop(cv, draw);
      return { build };
    })();
    function bentoNumbers() {
      qa('.nv-bento [data-count]').forEach((el) => {
        const end = Number(el.dataset.count), o = { v: 0 };
        if (!hasGsap || reduce) { el.textContent = end; return; }
        gsap.to(o, { v: end, duration: 1.8, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v); } });
      });
      if (!hasGsap || reduce) return;
      gsap.to('.nv-b-bars > div > i > i', { scaleX: 1, duration: 1.6, ease: 'expo.out', stagger: 0.15 });
      gsap.to('.nv-b-ring-fill', { strokeDashoffset: 0, duration: 2, ease: 'power3.out' });
      gsap.from('.nv-b-stack i', { scaleX: 0, duration: 1.2, ease: 'expo.out', stagger: 0.1 });
    }

    const techVideo = q('.nv-tech-video-frame video');
    if (techVideo) techVideo.addEventListener('loadedmetadata', () => { if (hasGsap && q('#page-tecnologia.active')) ScrollTrigger.refresh(); });
    function enterTech() {
      if (techWaves) techWaves.build();
      if (bentoSprings) bentoSprings.build();
      qa('#page-tecnologia .nv-b').forEach((c) => tiltCard(c, 5));
      txAuto = true; if (q('.nv-tx-item')) txSelect(0, false);
      if (!hasGsap || reduce) { if (q('.nv-bento')) bentoNumbers(); return; }
      pageCtx = gsap.context(() => {
        gsap.fromTo('.nv-tech-hero-inner > *', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.1 });
        gsap.to('.nv-tech-hero-bg', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.nv-tech-hero', start: 'top top', end: 'bottom top', scrub: true } });
        qa('.nv-tech-video-grid > div:first-child > *').forEach((el) => {
          gsap.from(el, { opacity: 0, y: 50, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } });
        });
        gsap.from('.nv-tech-video-frame', { opacity: 0, scale: 0.9, rotationY: -12, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.nv-tech-video-frame', start: 'top 85%' } });
        qa('.nv-tx-head > *, .nv-bento-sec .nv-wrap > .nv-eyebrow, .nv-bento-sec .nv-wrap > .nv-h2').forEach((el) => {
          gsap.from(el, { opacity: 0, y: 50, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } });
        });
        if (q('.nv-tx-grid')) {
          gsap.from('.nv-tx-visual', { opacity: 0, scale: 0.94, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.nv-tx-grid', start: 'top 80%' } });
          gsap.from('.nv-tx-item', { opacity: 0, x: 40, duration: 1, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: '.nv-tx-grid', start: 'top 80%' } });
        }
        if (q('.nv-bento')) {
          gsap.from('.nv-b', { opacity: 0, y: 60, scale: 0.97, duration: 1.2, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: '.nv-bento', start: 'top 82%', once: true, onEnter: bentoNumbers } });
        }

      }, '#page-tecnologia');
      ScrollTrigger.refresh();
    }

    // ---- Entregas, Reseñas, FAQ, Contáctanos ----
    const resWaves = waves(q('#nv-res-canvas'), { lines: 24, spread: 0.8, amp: 60, alpha: 0.11 });
    const faqWaves = waves(q('#nv-faq-canvas'), { lines: 24, spread: 0.8, amp: 60, alpha: 0.11 });
    const contactWaves = waves(q('#nv-contact-canvas'), { lines: 26, spread: 0.9, amp: 70, alpha: 0.12 });

    // Buscador + filtros de Preguntas Frecuentes
    let faqCat = 'all';
    const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    function faqFilter() {
      const input = q('#nv-faq-input');
      const term = norm(input ? input.value.trim() : '');
      let shown = 0;
      qa('#nv-faq-all .nv-faq-group').forEach((g) => {
        const catOk = faqCat === 'all' || g.dataset.cat === faqCat;
        let any = false;
        qa('.faq-item', g).forEach((it) => {
          const ok = catOk && (!term || norm(it.textContent).includes(term));
          it.classList.toggle('is-hidden', !ok);
          if (ok) { any = true; shown++; if (term) it.classList.add('open'); }
        });
        g.classList.toggle('is-hidden', !any);
      });
      const empty = q('#nv-faq-empty'); if (empty) empty.classList.toggle('is-on', shown === 0);
    }
    document.addEventListener('input', (e) => { if (e.target && e.target.id === 'nv-faq-input') faqFilter(); });
    document.addEventListener('click', (e) => {
      const chip = e.target.closest('.nv-faq-chip');
      if (!chip) return;
      faqCat = chip.dataset.cat;
      qa('.nv-faq-chip').forEach((c) => c.classList.toggle('is-on', c === chip));
      faqFilter();
    });

    function countUp(scope) {
      qa('[data-count]', scope).forEach((el) => {
        const end = Number(el.dataset.count), o = { v: 0 };
        if (!hasGsap || reduce) { el.textContent = end; return; }
        gsap.to(o, { v: end, duration: 1.6, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v); } });
      });
    }
    function revealIn(scopeSel) {
      qa(`${scopeSel} .nv-sec .nv-eyebrow, ${scopeSel} .nv-sec .nv-h2, ${scopeSel} .nv-sec .nv-lead, ${scopeSel} .nv-cta-band .nv-wrap > *`).forEach((el) => {
        gsap.from(el, { opacity: 0, y: 46, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' } });
      });
    }
    function enterSimple(pageId) {
      const scope = '#page-' + pageId;
      if (pageId === 'resenas' && resWaves) resWaves.build();
      if (pageId === 'faq' && faqWaves) faqWaves.build();
      if (pageId === 'contacto' && contactWaves) contactWaves.build();
      qa(`${scope} .nv-lcard`).forEach((c) => tiltCard(c, 5));
      if (pageId === 'faq') faqFilter();
      if (!hasGsap || reduce) { countUp(q(scope)); return; }
      pageCtx = gsap.context(() => {
        gsap.fromTo(`${scope} .nv-ph-inner > *, ${scope} .nv-contact-left-inner > *`, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.08 });
        if (q(`${scope} .nv-ph-bg`)) gsap.to(`${scope} .nv-ph-bg`, { yPercent: 14, ease: 'none', scrollTrigger: { trigger: `${scope} .nv-ph`, start: 'top top', end: 'bottom top', scrub: true } });
        if (pageId === 'resenas') gsap.fromTo('.nv-res-stars i', { opacity: 0, scale: 0.3, rotation: -40 }, { opacity: 1, scale: 1, rotation: 0, duration: 1, ease: 'back.out(2)', stagger: 0.08 });
        if (pageId === 'contacto') {
          gsap.fromTo('.nv-channel', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1, ease: 'expo.out', stagger: 0.07, delay: 0.4 });
          gsap.fromTo('.nv-form > *, .nv-form .form-fields > *', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.05, delay: 0.3 });
        }
        revealIn(scope);
        const stats = q(`${scope} .nv-del-stats`);
        if (stats) gsap.from(`${scope} .nv-del-stats .nv-lcard`, { opacity: 0, y: 60, duration: 1.1, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: stats, start: 'top 85%', once: true, onEnter: () => countUp(stats) } });
        const steps = q(`${scope} .nv-steps`);
        if (steps) {
          const mobile = isMobile();
          gsap.to(`${scope} .nv-steps-line i`, mobile ? { scaleY: 1, ease: 'none', scrollTrigger: { trigger: steps, start: 'top 75%', end: 'bottom 60%', scrub: true } }
            : { scaleX: 1, ease: 'none', scrollTrigger: { trigger: steps, start: 'top 80%', end: 'top 35%', scrub: true } });
          gsap.from(`${scope} .nv-steps li`, { opacity: 0, y: 40, duration: 1, ease: 'expo.out', stagger: 0.15, scrollTrigger: { trigger: steps, start: 'top 80%' } });
        }
        if (q(`${scope} .nv-split2-img`)) gsap.from(`${scope} .nv-split2-img`, { opacity: 0, scale: 0.94, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: `${scope} .nv-split2-img`, start: 'top 85%' } });
        if (q(`${scope} .nv-hours-grid`)) gsap.from(`${scope} .nv-hours-grid .nv-lcard`, { opacity: 0, y: 40, duration: 1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: `${scope} .nv-hours-grid`, start: 'top 92%' } });
      }, scope);
      ScrollTrigger.refresh();
    }

    NV.onOtherPage = function (pageId) {
      if (pageCtx) { pageCtx.revert(); pageCtx = null; }
      if (txTween) { txTween.kill(); txTween = null; }
      document.body.classList.toggle('nv-immersive', ['home', 'producto', 'producto-detalle', 'linea-hotelera', 'cita', 'comparar', 'tecnologia', 'entregas', 'resenas', 'faq', 'contacto', 'medida'].includes(pageId));
      if (pageId === 'producto') setTimeout(enterProducts, 30);
      if (pageId === 'producto-detalle') setTimeout(enterDetail, 30);
      if (pageId === 'linea-hotelera') setTimeout(enterHotel, 30);
      if (pageId === 'cita') setTimeout(enterCita, 30);
      if (pageId === 'comparar') setTimeout(enterCompare, 30);
      if (pageId === 'tecnologia') setTimeout(enterTech, 30);
      if (['entregas', 'resenas', 'faq', 'contacto', 'medida'].includes(pageId)) setTimeout(() => enterSimple(pageId), 30);
    };

    // =====================================================================
    // Entrada / salida del home
    // =====================================================================
    NV.active = false;
    function sizeAll() {
      // Alto del menú de arriba, para que el hero ocupe justo la pantalla visible
      const hs = q('#nv-hero');
      if (hs) document.documentElement.style.setProperty('--nv-nav', Math.max(0, hs.getBoundingClientRect().top + window.scrollY) + 'px');
      if (hero) hero.build();
      if (manifestoWaves) manifestoWaves.build();
      if (finalWaves) finalWaves.build();
      if (springs) springs.build();
    }
    function prepareTexts() {
      qa('#page-home .nv-split').forEach(splitWords);
      NV.renderCollection();
    }
    NV.build = function () {
      if (NV.active) return;
      NV.active = true;
      document.body.classList.add('nv-on-home');
      prepareTexts();
      sizeAll();
      buildScroll();
      if (hasGsap) ScrollTrigger.refresh();
      if (!hasGsap) qa('.nv-stat b').forEach((b) => { b.textContent = b.dataset.count; });
    };
    NV.destroy = function () {
      if (!NV.active) return;
      NV.active = false;
      document.body.classList.remove('nv-on-home', 'nv-nav-hidden');
      if (gctx) { gctx.revert(); gctx = null; }
      activeLayer = -1;
      qa('.nv-layer').forEach((el) => el.classList.remove('is-active', 'is-dim'));
      qa('.nv-cap').forEach((c) => c.classList.remove('is-on'));
      const hint = q('.nv-layer-hint'); if (hint) hint.classList.add('is-on');
    };
    NV.onPage = function (pageId) {
      NV.onOtherPage(pageId);
      if (pageId === 'home') {
        if (NV.active) return;
        setTimeout(() => { NV.build(); heroEnter(true); }, 30);
      } else NV.destroy();
    };
    NV.onLang = function () {
      if (!NV.active) { prepareTexts(); return; }
      NV.destroy(); NV.build();
    };

    // Barra de progreso de scroll del home
    const bar = q('#nv-progress i');
    function updateBar() {
      if (!NV.active || !bar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
      // Navbar: se esconde al bajar, aparece al subir
      const y = window.scrollY;
      if (y > lastY + 4 && y > 320) document.body.classList.add('nv-nav-hidden');
      else if (y < lastY - 4 || y < 120) document.body.classList.remove('nv-nav-hidden');
      lastY = y;
    }
    let lastY = 0;
    window.addEventListener('scroll', updateBar, { passive: true });

    // Re-medir canvases al cambiar el tamaño de la ventana
    let lastW = window.innerWidth, lastH = window.innerHeight, lastMobile = isMobile(), rT = null;
    window.addEventListener('resize', () => {
      clearTimeout(rT);
      rT = setTimeout(() => {
        const dw = Math.abs(window.innerWidth - lastW), dh = Math.abs(window.innerHeight - lastH);
        if (dw < 2 && dh < 120) return; // barra del navegador en el teléfono: ignorar
        lastW = window.innerWidth; lastH = window.innerHeight;
        if (!NV.active) return;
        if (isMobile() !== lastMobile) { lastMobile = isMobile(); NV.destroy(); NV.build(); return; }
        sizeAll();
        if (hasGsap) ScrollTrigger.refresh();
      }, 220);
    });

    // Animación de entrada del hero
    function heroEnter(quick) {
      if (hero) { if (quick) hero.assembleNow(); else hero.assemble(); }
      const items = qa('.nv-hero-eyebrow, .nv-hero-sub, .nv-hero-tagline, .nv-hero-actions > *');
      if (!hasGsap || reduce) { items.concat(qa('.nv-hero-photo img')).forEach((el) => { el.style.opacity = 1; }); return; }
      gsap.fromTo('.nv-hero-photo img', { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: quick ? 1.2 : 2.6, ease: 'power2.out', delay: quick ? 0 : 0.4 });
      gsap.fromTo(items, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.09, delay: quick ? 0.1 : 1.1 });
    }

    // Intro de carga
    function intro(done) {
      const el = q('#nv-intro');
      let seen = false;
      try { seen = sessionStorage.getItem('nv-intro') === '1'; sessionStorage.setItem('nv-intro', '1'); } catch (e) { /* modo privado */ }
      if (!el || !hasGsap || reduce || seen) { if (el) el.classList.add('nv-gone'); done(); return; }
      if (lenis) lenis.stop();
      const spans = qa('.nv-intro-word span');
      const num = q('#nv-intro-num');
      const c = { v: 0 };
      const dur = seen ? 0.7 : 1.9;
      gsap.set(spans, { y: 0, yPercent: 110 });
      gsap.timeline()
        .to(spans, { yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.06 })
        .to('.nv-intro-line i', { scaleX: 1, duration: dur, ease: 'power2.inOut' }, 0.2)
        .to(c, { v: 100, duration: dur, ease: 'power2.inOut', onUpdate: () => { num.textContent = String(Math.round(c.v)).padStart(3, '0'); } }, 0.2)
        .to(spans, { yPercent: -110, duration: 0.7, ease: 'expo.in', stagger: 0.03 })
        .add(() => done(), '-=0.2')
        .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut', onComplete: () => { el.classList.add('nv-gone'); if (lenis) lenis.start(); } }, '-=0.25');
    }

    // ---------- Arranque ----------
    function start() {
      const onHome = !!q('#page-home.active');
      if (onHome) { NV.build(); document.body.classList.add('nv-immersive'); }
      else { prepareTexts(); NV.onOtherPage(document.body.dataset.nvPage || ''); }
      intro(() => { if (onHome) heroEnter(false); });
      updateBar();
    }
    // Esperamos la tipografía del logo para dibujar "NUVELA" con la letra correcta.
    const fontReady = document.fonts && document.fonts.load
      ? Promise.race([document.fonts.load('500 100px "Cormorant Garamond"'), new Promise((r) => setTimeout(r, 1800))])
      : Promise.resolve();
    fontReady.then(start, start);
    // Cuando terminan de cargar todas las fotos, se vuelven a medir las secciones.
    window.addEventListener('load', () => { if (NV.active && hasGsap) ScrollTrigger.refresh(); });
  })();
  