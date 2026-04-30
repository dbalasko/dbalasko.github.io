// Scientific ambient background — three layers:
//   1. Engineering grid (fine + bold) with axis ticks
//   2. Slow drifting iso-contour curves (CFD pressure-like)
//   3. Two breathing radial pulses underneath
// All very subtle, no fast motion. Respects prefers-reduced-motion.

(function () {
  const canvas = document.getElementById('streamlines');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W = 0, H = 0;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    W = canvas.clientWidth = window.innerWidth;
    H = canvas.clientHeight = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  function tokens() {
    const cs = getComputedStyle(document.documentElement);
    return {
      pulse1: cs.getPropertyValue('--pulse-ink').trim() || 'rgba(120,170,230,0.10)',
      pulse2: cs.getPropertyValue('--pulse-ink-2').trim() || 'rgba(200,140,180,0.07)',
      grid: cs.getPropertyValue('--grid-ink').trim() || 'rgba(244,242,237,0.045)',
      gridBold: cs.getPropertyValue('--grid-ink-bold').trim() || 'rgba(244,242,237,0.09)',
      contour: cs.getPropertyValue('--contour-ink').trim() || 'rgba(180,210,235,0.10)',
    };
  }

  // ===== Iso-contour generator =====
  // Each contour is a smooth curve driven by sum-of-sines, drifting slowly.
  const contours = Array.from({ length: 6 }, (_, i) => ({
    yBase: 0.12 + i * 0.16,                  // vertical position (frac of H)
    amp: 60 + Math.random() * 80,            // amplitude px
    freq1: 0.0028 + Math.random() * 0.0012,
    freq2: 0.0011 + Math.random() * 0.0009,
    phase: Math.random() * Math.PI * 2,
    drift: 0.18 + Math.random() * 0.25,      // px per frame horizontal drift
    width: 0.6 + Math.random() * 0.5,
  }));

  let t = 0;
  function frame() {
    t += reduced ? 0 : 1;
    ctx.clearRect(0, 0, W, H);
    const k = tokens();

    // ===== Layer 1: breathing pulses =====
    const tt = t * 0.004;
    const p1 = 0.5 + Math.sin(tt) * 0.5;
    const r1 = Math.max(W, H) * (0.55 + p1 * 0.15);
    const g1 = ctx.createRadialGradient(W * 0.25, H * 0.35, 0, W * 0.25, H * 0.35, r1);
    g1.addColorStop(0, k.pulse1);
    g1.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = 0.6 + p1 * 0.4;
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, W, H);

    const p2 = 0.5 + Math.sin(tt * 0.7 + 2.1) * 0.5;
    const r2 = Math.max(W, H) * (0.5 + p2 * 0.18);
    const g2 = ctx.createRadialGradient(W * 0.78, H * 0.72, 0, W * 0.78, H * 0.72, r2);
    g2.addColorStop(0, k.pulse2);
    g2.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = 0.5 + p2 * 0.4;
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;

    // ===== Layer 2: engineering grid =====
    const minor = 32;        // fine grid spacing
    const majorEvery = 4;    // every 4th line is bold (= 128px)
    ctx.lineWidth = 1;

    // fine vertical lines
    ctx.strokeStyle = k.grid;
    ctx.beginPath();
    for (let x = 0; x <= W; x += minor) {
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, H);
    }
    for (let y = 0; y <= H; y += minor) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(W, y + 0.5);
    }
    ctx.stroke();

    // bold lines + tick marks
    ctx.strokeStyle = k.gridBold;
    ctx.beginPath();
    for (let x = 0, i = 0; x <= W; x += minor, i++) {
      if (i % majorEvery === 0) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, H);
      }
    }
    for (let y = 0, i = 0; y <= H; y += minor, i++) {
      if (i % majorEvery === 0) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(W, y + 0.5);
      }
    }
    ctx.stroke();

    // ===== Layer 3: drifting iso-contours =====
    ctx.strokeStyle = k.contour;
    for (const c of contours) {
      ctx.lineWidth = c.width;
      ctx.beginPath();
      const y0 = H * c.yBase;
      const drift = t * c.drift * 0.03;
      const STEP = 6;
      let first = true;
      for (let x = -20; x <= W + 20; x += STEP) {
        // two-frequency sine + slow phase drift => continuous flowing iso-line
        const y =
          y0 +
          Math.sin(x * c.freq1 + drift + c.phase) * c.amp +
          Math.sin(x * c.freq2 - drift * 0.6 + c.phase * 1.7) * c.amp * 0.4;
        if (first) { ctx.moveTo(x, y); first = false; }
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // ===== Crosshair / origin mark (top-left, very faint) =====
    ctx.strokeStyle = k.gridBold;
    ctx.lineWidth = 1;
    const ox = 64, oy = 64;
    ctx.beginPath();
    ctx.moveTo(ox - 12, oy + 0.5); ctx.lineTo(ox + 12, oy + 0.5);
    ctx.moveTo(ox + 0.5, oy - 12); ctx.lineTo(ox + 0.5, oy + 12);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(ox + 0.5, oy + 0.5, 3, 0, Math.PI * 2);
    ctx.stroke();

    requestAnimationFrame(frame);
  }
  frame();
})();
