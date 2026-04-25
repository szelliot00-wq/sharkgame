// SpriteGenerator — all sprites drawn with Canvas 2D bezier curves
// Shark is anatomically accurate: short snout, two EQUAL dorsals, heterocercal tail, green eyes

// Helper: create or update a canvas texture with multiple frames
function makeSheet(scene, key, frameW, frameH, numFrames, drawFn) {
  if (scene.textures.exists(key)) return;
  const tex = scene.textures.createCanvas(key, frameW * numFrames, frameH);
  const ctx = tex.getContext();
  for (let i = 0; i < numFrames; i++) {
    ctx.save();
    ctx.translate(i * frameW, 0);
    drawFn(ctx, i, frameW, frameH);
    ctx.restore();
  }
  tex.refresh();
  for (let i = 0; i < numFrames; i++) {
    tex.add(i, 0, i * frameW, 0, frameW, frameH);
  }
}

// ─── LEMON SHARK — 56×28px, 4 frames ────────────────────────────────────────
// Head faces RIGHT. Tail on LEFT. Body undulates each frame.
// Key lemon shark features: blunt rounded snout, TWO nearly equal dorsal fins,
// large pectoral fins, heterocercal tail, yellow-brown dorsal, pale belly,
// emerald green eyes, 5 gill slits.
function drawShark(ctx, frame, w, h) {
  // Per-frame body wave: tail swings up/down, body bends
  const tSwing  = [0, 4, 0, -4][frame];   // tail Y offset
  const bCurve  = [0, 2, 0, -2][frame];   // body mid-point curve

  const cy = 15; // body centreline Y

  // ── Body fill (dorsal side) ──────────────────────────────────────────────
  const bodyGrad = ctx.createLinearGradient(0, 4, 0, h);
  bodyGrad.addColorStop(0.0, '#7a6818');   // dark dorsal top
  bodyGrad.addColorStop(0.25,'#b89828');   // mid-dorsal
  bodyGrad.addColorStop(0.55,'#d4b030');   // lemon-yellow flank
  bodyGrad.addColorStop(0.75,'#e8d890');   // pale transition
  bodyGrad.addColorStop(1.0, '#f0eacc');   // cream belly
  ctx.fillStyle = bodyGrad;

  ctx.beginPath();
  // Upper body (dorsal) — tail-left to head-right
  ctx.moveTo(7, cy + tSwing * 0.4);           // tail root top
  ctx.bezierCurveTo(
    16, cy - 4 + bCurve,                      // upper back sweeps up
    32, cy - 5,                                // widest dorsal point
    42, cy - 4);                               // shoulder
  ctx.bezierCurveTo(48, cy - 4, 52, cy - 3, 54, cy - 1); // neck to snout top
  ctx.bezierCurveTo(55.5, cy, 55.5, cy + 2, 54, cy + 3); // snout tip (short, rounded)
  // Lower body (ventral) — head back to tail
  ctx.bezierCurveTo(52, cy + 4, 48, cy + 5, 42, cy + 5); // jaw/belly shoulder
  ctx.bezierCurveTo(32, cy + 5, 16, cy + 4 - bCurve, 7, cy - tSwing * 0.4); // belly back
  ctx.closePath();
  ctx.fill();

  // ── Belly highlight (pale cream) ────────────────────────────────────────
  const bellyGrad = ctx.createLinearGradient(0, cy + 1, 0, cy + 6);
  bellyGrad.addColorStop(0, 'rgba(255,250,220,0.7)');
  bellyGrad.addColorStop(1, 'rgba(255,250,220,0)');
  ctx.fillStyle = bellyGrad;
  ctx.beginPath();
  ctx.moveTo(15, cy + 2);
  ctx.bezierCurveTo(28, cy + 2.5, 40, cy + 3.5, 50, cy + 3);
  ctx.bezierCurveTo(50, cy + 5, 40, cy + 5, 28, cy + 5);
  ctx.bezierCurveTo(20, cy + 5, 13, cy + 4, 10, cy + 3);
  ctx.closePath();
  ctx.fill();

  // ── Dorsal shading (makes body feel 3D) ─────────────────────────────────
  const shadGrad = ctx.createLinearGradient(0, 7, 0, cy);
  shadGrad.addColorStop(0, 'rgba(0,0,0,0.28)');
  shadGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = shadGrad;
  ctx.beginPath();
  ctx.moveTo(7, cy + tSwing * 0.4);
  ctx.bezierCurveTo(16, cy - 4 + bCurve, 32, cy - 5, 42, cy - 4);
  ctx.bezierCurveTo(48, cy - 4, 52, cy - 3, 54, cy - 1);
  ctx.bezierCurveTo(52, cy + 2, 46, cy + 3, 36, cy + 3);
  ctx.bezierCurveTo(24, cy + 3, 12, cy + 3, 7, cy + tSwing * 0.4);
  ctx.fill();

  // ── CAUDAL (TAIL) FIN — heterocercal: upper lobe MUCH larger ────────────
  const tf = tSwing;
  const finCol = '#9a7e18';

  // Upper lobe (large)
  ctx.fillStyle = finCol;
  ctx.beginPath();
  ctx.moveTo(8, cy + tf * 0.3);
  ctx.bezierCurveTo(5, cy - 2 + tf, 2, cy - 8 + tf, 1, cy - 11 + tf);
  ctx.bezierCurveTo(2, cy - 12 + tf, 4, cy - 11 + tf, 5, cy - 8 + tf);
  ctx.bezierCurveTo(6, cy - 4 + tf * 0.7, 7, cy - 1 + tf * 0.4, 8, cy + tf * 0.3);
  ctx.fill();

  // Lower lobe (smaller)
  ctx.beginPath();
  ctx.moveTo(8, cy - tf * 0.3);
  ctx.bezierCurveTo(5, cy + 2 - tf * 0.5, 3, cy + 6 - tf, 3, cy + 8 - tf);
  ctx.bezierCurveTo(4, cy + 9 - tf, 6, cy + 7 - tf, 7, cy + 5 - tf * 0.5);
  ctx.bezierCurveTo(8, cy + 3 - tf * 0.3, 8, cy + 1, 8, cy - tf * 0.3);
  ctx.fill();

  // Caudal notch
  ctx.fillStyle = 'rgba(2,11,24,0.6)';
  ctx.beginPath();
  ctx.ellipse(3.5, cy + tf * 0.05, 1.2, 2, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // ── FIRST DORSAL FIN (tall, positioned above pectoral region) ────────────
  // This is the classic shark fin silhouette
  ctx.fillStyle = finCol;
  ctx.beginPath();
  ctx.moveTo(30, cy - 4);                     // leading base on body
  ctx.bezierCurveTo(31, cy - 9, 35, cy - 14, 38, cy - 14); // sweep up to tip
  ctx.bezierCurveTo(40, cy - 14, 42, cy - 11, 44, cy - 5); // trailing edge curves back
  ctx.bezierCurveTo(41, cy - 4.5, 36, cy - 4, 30, cy - 4);
  ctx.fill();
  // Leading edge darkening
  ctx.strokeStyle = '#7a6010';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(30, cy - 4);
  ctx.bezierCurveTo(31, cy - 9, 35, cy - 14, 38, cy - 14);
  ctx.stroke();

  // ── SECOND DORSAL FIN (nearly same height — lemon shark's hallmark!) ─────
  ctx.fillStyle = finCol;
  ctx.beginPath();
  ctx.moveTo(14, cy - 3);                     // leading base
  ctx.bezierCurveTo(15, cy - 8, 18, cy - 13, 21, cy - 13); // similar height to first!
  ctx.bezierCurveTo(23, cy - 13, 25, cy - 10, 26, cy - 4); // trailing
  ctx.bezierCurveTo(23, cy - 3.5, 18, cy - 3, 14, cy - 3);
  ctx.fill();
  ctx.strokeStyle = '#7a6010';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(14, cy - 3);
  ctx.bezierCurveTo(15, cy - 8, 18, cy - 13, 21, cy - 13);
  ctx.stroke();

  // ── PECTORAL FIN (large, broad, swept back) ───────────────────────────────
  ctx.fillStyle = finCol;
  ctx.beginPath();
  ctx.moveTo(38, cy + 2);                     // root on body
  ctx.bezierCurveTo(40, cy + 5, 44, cy + 9, 43, cy + 12); // sweeping leading edge
  ctx.bezierCurveTo(40, cy + 13, 35, cy + 10, 33, cy + 6); // outer tip area
  ctx.bezierCurveTo(34, cy + 4, 36, cy + 2.5, 38, cy + 2);
  ctx.fill();
  ctx.strokeStyle = '#7a6010';
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(38, cy + 2);
  ctx.bezierCurveTo(40, cy + 5, 44, cy + 9, 43, cy + 12);
  ctx.stroke();

  // ── PELVIC FIN (small, below second dorsal) ────────────────────────────
  ctx.fillStyle = finCol;
  ctx.beginPath();
  ctx.moveTo(20, cy + 3);
  ctx.bezierCurveTo(19, cy + 6, 17, cy + 9, 16, cy + 10);
  ctx.bezierCurveTo(14, cy + 10, 13, cy + 8, 14, cy + 5);
  ctx.bezierCurveTo(16, cy + 4, 18, cy + 3, 20, cy + 3);
  ctx.fill();

  // ── ANAL FIN (small, below/behind second dorsal) ──────────────────────
  ctx.fillStyle = finCol;
  ctx.beginPath();
  ctx.moveTo(10, cy + 3.5);
  ctx.lineTo(9, cy + 7);
  ctx.lineTo(7, cy + 7);
  ctx.bezierCurveTo(7, cy + 5, 8, cy + 3.5, 10, cy + 3.5);
  ctx.fill();

  // ── FIVE GILL SLITS ────────────────────────────────────────────────────
  ctx.strokeStyle = 'rgba(80,60,10,0.65)';
  ctx.lineWidth = 0.7;
  for (let g = 0; g < 5; g++) {
    const gx = 45 - g * 2.2;
    ctx.beginPath();
    ctx.moveTo(gx, cy - 2.5);
    ctx.quadraticCurveTo(gx - 0.5, cy + 0.5, gx, cy + 3.5);
    ctx.stroke();
  }

  // ── LATERAL LINE ─────────────────────────────────────────────────────────
  ctx.strokeStyle = 'rgba(220,190,80,0.45)';
  ctx.lineWidth = 0.6;
  ctx.setLineDash([2, 2]);
  ctx.beginPath();
  ctx.moveTo(9, cy + 0.5);
  ctx.bezierCurveTo(22, cy + 0.5, 36, cy, 50, cy - 0.5);
  ctx.stroke();
  ctx.setLineDash([]);

  // ── EMERALD GREEN EYE (lemon sharks have distinctive green eyes!) ────────
  // Outer ring
  ctx.fillStyle = '#1a3a10';
  ctx.beginPath();
  ctx.ellipse(50, cy - 3.5, 2.8, 2.2, -0.15, 0, Math.PI * 2);
  ctx.fill();
  // Iris
  ctx.fillStyle = '#2a7a20';
  ctx.beginPath();
  ctx.ellipse(50, cy - 3.5, 2.1, 1.6, -0.15, 0, Math.PI * 2);
  ctx.fill();
  // Pupil
  ctx.fillStyle = '#0a1a06';
  ctx.beginPath();
  ctx.ellipse(49.8, cy - 3.5, 1.1, 0.9, 0, 0, Math.PI * 2);
  ctx.fill();
  // Specular highlight
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.beginPath();
  ctx.ellipse(50.6, cy - 4.1, 0.6, 0.45, -0.4, 0, Math.PI * 2);
  ctx.fill();

  // ── MOUTH (curved, slightly open — benign expression) ────────────────────
  ctx.strokeStyle = 'rgba(80,60,10,0.7)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(55, cy + 1);
  ctx.bezierCurveTo(54, cy + 3, 51.5, cy + 3.5, 49.5, cy + 3);
  ctx.stroke();
  // Nostril (paired nostrils on snout)
  ctx.fillStyle = 'rgba(60,45,8,0.8)';
  ctx.beginPath();
  ctx.ellipse(53, cy - 1.5, 0.9, 0.5, -0.4, 0, Math.PI * 2);
  ctx.fill();

  // ── Body outline for crispness ─────────────────────────────────────────
  ctx.strokeStyle = 'rgba(80,60,10,0.3)';
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(7, cy + tSwing * 0.4);
  ctx.bezierCurveTo(16, cy - 4 + bCurve, 32, cy - 5, 42, cy - 4);
  ctx.bezierCurveTo(48, cy - 4, 52, cy - 3, 54, cy - 1);
  ctx.bezierCurveTo(55.5, cy, 55.5, cy + 2, 54, cy + 3);
  ctx.bezierCurveTo(52, cy + 4, 48, cy + 5, 42, cy + 5);
  ctx.bezierCurveTo(32, cy + 5, 16, cy + 4 - bCurve, 7, cy - tSwing * 0.4);
  ctx.stroke();
}

// ─── SHARK HIT — white silhouette flash ─────────────────────────────────────
function drawSharkHit(ctx, frame, w, h) {
  const cy = 15;
  ctx.fillStyle = 'rgba(248,249,250,0.95)';
  ctx.beginPath();
  ctx.moveTo(7, cy);
  ctx.bezierCurveTo(16, cy - 4, 32, cy - 5, 42, cy - 4);
  ctx.bezierCurveTo(48, cy - 4, 52, cy - 3, 54, cy - 1);
  ctx.bezierCurveTo(55.5, cy, 55.5, cy + 2, 54, cy + 3);
  ctx.bezierCurveTo(52, cy + 4, 48, cy + 5, 42, cy + 5);
  ctx.bezierCurveTo(32, cy + 5, 16, cy + 4, 7, cy);
  ctx.fill();
  // Tail
  ctx.beginPath();
  ctx.moveTo(8, cy); ctx.bezierCurveTo(4, cy - 4, 1, cy - 8, 1, cy - 11);
  ctx.bezierCurveTo(3, cy - 10, 5, cy - 6, 8, cy); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(8, cy); ctx.bezierCurveTo(4, cy + 3, 3, cy + 6, 3, cy + 8);
  ctx.bezierCurveTo(5, cy + 8, 7, cy + 5, 8, cy); ctx.fill();
}

// ─── SHARK PUP — 28×14px, 2 frames — miniature lemon shark ─────────────────
function drawPup(ctx, frame, w, h) {
  const cy = 7;
  const tw = frame === 0 ? 0 : 3;
  const bc = frame === 0 ? 0 : 1.5;

  const bodyGrad = ctx.createLinearGradient(0, 2, 0, h);
  bodyGrad.addColorStop(0, '#8a7018');
  bodyGrad.addColorStop(0.5, '#c4a028');
  bodyGrad.addColorStop(1, '#e8d890');
  ctx.fillStyle = bodyGrad;

  ctx.beginPath();
  ctx.moveTo(4, cy + tw * 0.3);
  ctx.bezierCurveTo(8, cy - 2 + bc, 16, cy - 2.5, 22, cy - 2);
  ctx.bezierCurveTo(25, cy - 2, 27, cy - 1.5, 27.5, cy - 0.5);
  ctx.bezierCurveTo(28, cy, 28, cy + 1, 27.5, cy + 1.5);
  ctx.bezierCurveTo(25, cy + 2.5, 22, cy + 2.5, 16, cy + 2.5);
  ctx.bezierCurveTo(8, cy + 2.5, 4, cy + 2 - bc, 4, cy - tw * 0.3);
  ctx.fill();

  // Belly
  ctx.fillStyle = 'rgba(240,235,200,0.6)';
  ctx.beginPath();
  ctx.ellipse(18, cy + 1, 6, 1.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // First dorsal (tall)
  ctx.fillStyle = '#8a7018';
  ctx.beginPath();
  ctx.moveTo(15, cy - 2);
  ctx.bezierCurveTo(16, cy - 5, 18, cy - 7.5, 19.5, cy - 7.5);
  ctx.bezierCurveTo(21, cy - 7.5, 22, cy - 5.5, 22.5, cy - 2.5);
  ctx.bezierCurveTo(20, cy - 2, 17, cy - 2, 15, cy - 2);
  ctx.fill();
  // Second dorsal (nearly same size!)
  ctx.beginPath();
  ctx.moveTo(7, cy - 1.5);
  ctx.bezierCurveTo(8, cy - 4, 10, cy - 7, 11.5, cy - 7);
  ctx.bezierCurveTo(13, cy - 7, 14, cy - 4.5, 14, cy - 2);
  ctx.bezierCurveTo(12, cy - 1.8, 9, cy - 1.6, 7, cy - 1.5);
  ctx.fill();

  // Pectoral fin
  ctx.beginPath();
  ctx.moveTo(20, cy + 1.5);
  ctx.bezierCurveTo(21, cy + 3, 23, cy + 5, 22, cy + 6.5);
  ctx.bezierCurveTo(20, cy + 6.5, 17, cy + 4.5, 17, cy + 2.5);
  ctx.bezierCurveTo(18, cy + 2, 19, cy + 1.5, 20, cy + 1.5);
  ctx.fill();

  // Tail — heterocercal
  ctx.beginPath();
  ctx.moveTo(4, cy + tw * 0.3);
  ctx.bezierCurveTo(2, cy - 1 + tw, 0.5, cy - 5 + tw, 0.5, cy - 6 + tw);
  ctx.bezierCurveTo(1, cy - 6.5 + tw, 2, cy - 5 + tw, 3, cy - 2 + tw * 0.5);
  ctx.bezierCurveTo(3.5, cy, 4, cy + tw * 0.15, 4, cy + tw * 0.3);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(4, cy - tw * 0.3);
  ctx.bezierCurveTo(2, cy + 1 - tw * 0.5, 1, cy + 3 - tw, 1, cy + 4.5 - tw);
  ctx.bezierCurveTo(2, cy + 5 - tw, 3, cy + 3.5 - tw * 0.5, 4, cy + 2 - tw * 0.2);
  ctx.bezierCurveTo(4, cy + 1, 4, cy - tw * 0.15, 4, cy - tw * 0.3);
  ctx.fill();

  // Green eye
  ctx.fillStyle = '#1a3a10';
  ctx.beginPath();
  ctx.ellipse(25, cy - 1.5, 1.5, 1.1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2a7a20';
  ctx.beginPath();
  ctx.ellipse(25, cy - 1.5, 1, 0.8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0a1a06';
  ctx.beginPath();
  ctx.arc(25, cy - 1.5, 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.beginPath();
  ctx.arc(25.3, cy - 1.8, 0.3, 0, Math.PI * 2);
  ctx.fill();
}

// ─── SMALL FISH (mullet) — 10×7px, 2 frames ─────────────────────────────────
function drawFish(ctx, frame, w, h) {
  const tf = frame === 0 ? 0 : 0.8;
  // Body
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#8ab4c8');
  g.addColorStop(0.5, '#c0dce8');
  g.addColorStop(1, '#e8f4f8');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(9, 3.5);
  ctx.bezierCurveTo(8, 2, 5, 1.5, 3, 2);
  ctx.bezierCurveTo(1, 2.5, 1, 4.5, 3, 5);
  ctx.bezierCurveTo(5, 5.5, 8, 5, 9, 3.5);
  ctx.fill();
  // Silver side stripe
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.beginPath();
  ctx.ellipse(5.5, 3.2, 2.5, 0.7, 0, 0, Math.PI * 2);
  ctx.fill();
  // Tail
  ctx.fillStyle = '#6a9ab0';
  ctx.beginPath();
  ctx.moveTo(2, 3.5 + tf);
  ctx.lineTo(0, 1.5 + tf); ctx.lineTo(0.5, 3.5 + tf);
  ctx.lineTo(0, 5.5 + tf); ctx.closePath();
  ctx.fill();
  // Eye
  ctx.fillStyle = '#0a1a25';
  ctx.beginPath(); ctx.arc(8, 2.8, 0.9, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.beginPath(); ctx.arc(8.3, 2.5, 0.3, 0, Math.PI * 2); ctx.fill();
}

// ─── SNAPPER — 10×7px, 2 frames ─────────────────────────────────────────────
function drawSnapper(ctx, frame, w, h) {
  const tf = frame === 0 ? 0 : 0.8;
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#c84820');
  g.addColorStop(0.5, '#e87040');
  g.addColorStop(1, '#f09060');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(9, 3.5);
  ctx.bezierCurveTo(8, 1.8, 5, 1.2, 3, 1.8);
  ctx.bezierCurveTo(1, 2.4, 1, 4.6, 3, 5.2);
  ctx.bezierCurveTo(5, 5.8, 8, 5.2, 9, 3.5);
  ctx.fill();
  // Yellow stripe
  ctx.strokeStyle = '#f0d020';
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(3, 3.5); ctx.bezierCurveTo(5, 3.3, 7, 3.4, 8.5, 3.5);
  ctx.stroke();
  // Tail
  ctx.fillStyle = '#a83010';
  ctx.beginPath();
  ctx.moveTo(2, 3.5 + tf); ctx.lineTo(0, 1.5 + tf);
  ctx.lineTo(0.5, 3.5 + tf); ctx.lineTo(0, 5.5 + tf); ctx.closePath();
  ctx.fill();
  // Eye
  ctx.fillStyle = '#200800';
  ctx.beginPath(); ctx.arc(8, 2.8, 0.9, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.beginPath(); ctx.arc(8.3, 2.5, 0.3, 0, Math.PI * 2); ctx.fill();
}

// ─── JELLYFISH — 12×14px, 2 frames ──────────────────────────────────────────
function drawJellyfish(ctx, frame, w, h) {
  const pulse = frame === 0 ? 1.0 : 0.82;
  const cx = 6, cy = 5;

  // Outer bell
  ctx.fillStyle = 'rgba(180,140,255,0.6)';
  ctx.beginPath();
  ctx.ellipse(cx, cy, 5.5 * pulse, 5 * pulse, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  // Inner bell highlight
  ctx.fillStyle = 'rgba(220,200,255,0.5)';
  ctx.beginPath();
  ctx.ellipse(cx - 1, cy - 0.5, 3.5 * pulse, 3 * pulse, -0.2, Math.PI, Math.PI * 2);
  ctx.fill();
  // Bell rim
  ctx.strokeStyle = 'rgba(200,160,255,0.8)';
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 5.5 * pulse, 5 * pulse, 0, Math.PI, Math.PI * 2);
  ctx.stroke();
  // Oral arms (thick inner tentacles)
  ctx.strokeStyle = 'rgba(160,110,240,0.7)';
  ctx.lineWidth = 0.9;
  for (let i = -1; i <= 1; i++) {
    const tx = cx + i * 1.8 * pulse;
    const wig = (frame === 0 ? 0.8 : -0.8) * (i || 0.5);
    ctx.beginPath();
    ctx.moveTo(tx, cy + 1);
    ctx.bezierCurveTo(tx + wig, cy + 4, tx - wig * 0.5, cy + 7, tx + wig * 0.3, cy + 9);
    ctx.stroke();
  }
  // Fine tentacles
  ctx.strokeStyle = 'rgba(200,170,255,0.45)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 6; i++) {
    const tx = 1 + i * 2;
    const wig = (i % 2 === 0 ? 1 : -1) * (frame === 0 ? 0.8 : -0.8);
    ctx.beginPath();
    ctx.moveTo(tx, cy + 0.5);
    ctx.bezierCurveTo(tx + wig, cy + 4, tx - wig, cy + 8, tx, cy + 10);
    ctx.stroke();
  }
}

// ─── FISHING NET — 28×64px, 1 frame ─────────────────────────────────────────
function drawNet(ctx, frame, w, h) {
  // Main netting
  ctx.strokeStyle = 'rgba(160,140,100,0.7)';
  ctx.lineWidth = 0.8;
  const spacing = 4;
  for (let x = 0; x <= w; x += spacing) {
    ctx.beginPath(); ctx.moveTo(x, 4); ctx.lineTo(x, h - 4); ctx.stroke();
  }
  for (let y = 4; y <= h - 4; y += spacing) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
  // Float line (top rope)
  ctx.strokeStyle = '#8B7355';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0, 3); ctx.lineTo(w, 3); ctx.stroke();
  // Sinker line (bottom rope)
  ctx.beginPath(); ctx.moveTo(0, h - 3); ctx.lineTo(w, h - 3); ctx.stroke();
  // Floats — orange buoys
  for (let x = 3; x < w; x += 8) {
    const fg = ctx.createRadialGradient(x, 2.5, 0.5, x, 2.5, 2.5);
    fg.addColorStop(0, '#ff8040');
    fg.addColorStop(1, '#c04010');
    ctx.fillStyle = fg;
    ctx.beginPath(); ctx.ellipse(x, 2.5, 2.5, 1.8, 0, 0, Math.PI * 2); ctx.fill();
  }
  // Lead sinkers — grey oblongs
  ctx.fillStyle = '#666';
  for (let x = 3; x < w; x += 8) {
    ctx.fillRect(x - 1.5, h - 4, 3, 3);
  }
}

// ─── LONGLINING HOOK — 10×16px, 2 frames ─────────────────────────────────────
function drawHook(ctx, frame, w, h) {
  const dx = frame === 0 ? 0 : 1.2;
  const dy = frame === 0 ? 0 : 0.5;
  // Drop line from surface
  ctx.strokeStyle = '#bbb';
  ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(5 + dx, 0); ctx.lineTo(5 + dx, 4 + dy); ctx.stroke();
  // Hook body — metallic sheen
  const hg = ctx.createLinearGradient(2, 4, 8, 16);
  hg.addColorStop(0, '#ddd');
  hg.addColorStop(0.5, '#999');
  hg.addColorStop(1, '#bbb');
  ctx.strokeStyle = hg;
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  // Shank
  ctx.beginPath(); ctx.moveTo(5 + dx, 4 + dy); ctx.lineTo(5 + dx, 10 + dy); ctx.stroke();
  // Bend
  ctx.beginPath();
  ctx.arc(3 + dx, 10 + dy, 2, -Math.PI / 2, Math.PI * 0.7);
  ctx.stroke();
  // Point
  ctx.beginPath(); ctx.moveTo(4.3 + dx, 12.3 + dy); ctx.lineTo(5.5 + dx, 10.5 + dy); ctx.stroke();
  // Barb
  ctx.lineWidth = 0.9;
  ctx.beginPath(); ctx.moveTo(5.5 + dx, 10.5 + dy); ctx.lineTo(4 + dx, 9.2 + dy); ctx.stroke();
  // Eye (top of hook)
  ctx.strokeStyle = '#999';
  ctx.lineWidth = 0.9;
  ctx.beginPath(); ctx.ellipse(5 + dx, 1.2 + dy, 1.2, 1, 0, 0, Math.PI * 2); ctx.stroke();
  // Glint
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(6 + dx, 6 + dy); ctx.lineTo(6 + dx, 9 + dy); ctx.stroke();
}

// ─── BOAT PROPELLER — 24×24px, 4 frames ─────────────────────────────────────
function drawPropeller(ctx, frame, w, h) {
  const angle = (frame / 4) * Math.PI * 2;
  ctx.save();
  ctx.translate(12, 12);
  ctx.rotate(angle);
  // Hub
  const hg = ctx.createRadialGradient(0, 0, 1, 0, 0, 3.5);
  hg.addColorStop(0, '#aaa');
  hg.addColorStop(1, '#555');
  ctx.fillStyle = hg;
  ctx.beginPath(); ctx.arc(0, 0, 3.5, 0, Math.PI * 2); ctx.fill();
  // Bolts
  ctx.fillStyle = '#333';
  for (let i = 0; i < 3; i++) {
    const bx = Math.cos((i / 3) * Math.PI * 2) * 2.2;
    const by = Math.sin((i / 3) * Math.PI * 2) * 2.2;
    ctx.beginPath(); ctx.arc(bx, by, 0.6, 0, Math.PI * 2); ctx.fill();
  }
  // 3 blades — each has a subtle gradient and curved shape
  for (let b = 0; b < 3; b++) {
    ctx.save();
    ctx.rotate((b / 3) * Math.PI * 2);
    const bg = ctx.createLinearGradient(-2.5, -3, 2.5, -10);
    bg.addColorStop(0, '#888');
    bg.addColorStop(0.5, '#aaa');
    bg.addColorStop(1, '#777');
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.moveTo(-1, -3);
    ctx.bezierCurveTo(-3, -5, -3.5, -9, -2, -10);
    ctx.bezierCurveTo(0, -10.5, 3, -8, 3, -5);
    ctx.bezierCurveTo(3, -3, 1.5, -3, -1, -3);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(-1, -4); ctx.bezierCurveTo(-2, -6, -2.5, -8, -1.5, -9); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

// ─── BUBBLE PARTICLE — 4×4px, 3 frames ──────────────────────────────────────
function drawBubble(ctx, frame, w, h) {
  const sizes = [1.8, 1.4, 1.0];
  const r = sizes[frame];
  // Outer ring
  ctx.strokeStyle = 'rgba(126,200,227,0.7)';
  ctx.lineWidth = 0.6;
  ctx.beginPath(); ctx.arc(2, 2, r, 0, Math.PI * 2); ctx.stroke();
  // Inner fill (faint)
  ctx.fillStyle = 'rgba(200,240,255,0.12)';
  ctx.fill();
  // Glint
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.beginPath(); ctx.arc(2.5, 1.5, r * 0.3, 0, Math.PI * 2); ctx.fill();
}

// ─── BACKGROUND LAYERS — Bimini mangrove waters ───────────────────────────────

function drawBgDeep(ctx, frame, w, h) {
  // Bimini deep: rich indigo-blue gradient
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0.0, '#020b18');
  g.addColorStop(0.5, '#04142a');
  g.addColorStop(1.0, '#061f3a');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Distant reef formations at bottom
  ctx.fillStyle = 'rgba(4,20,42,0.85)';
  const reefs = [
    { x:20,  h:28 }, { x:55,  h:18 }, { x:90,  h:35 }, { x:130, h:22 },
    { x:170, h:30 }, { x:210, h:16 }, { x:250, h:28 }, { x:290, h:38 },
    { x:330, h:20 }, { x:370, h:25 }, { x:410, h:32 }, { x:450, h:18 },
  ];
  reefs.forEach(r => {
    ctx.beginPath();
    ctx.moveTo(r.x - 18, h);
    ctx.bezierCurveTo(r.x - 10, h - r.h * 0.6, r.x, h - r.h, r.x + 5, h - r.h);
    ctx.bezierCurveTo(r.x + 12, h - r.h, r.x + 20, h - r.h * 0.5, r.x + 28, h);
    ctx.closePath();
    ctx.fill();
  });

  // Very faint distant light rays from surface
  ctx.strokeStyle = 'rgba(126,200,227,0.04)';
  ctx.lineWidth = 8;
  for (let i = 0; i < 5; i++) {
    const lx = 60 + i * 100;
    ctx.beginPath();
    ctx.moveTo(lx, 0);
    ctx.lineTo(lx + 30, h);
    ctx.stroke();
  }
}

function drawBgMid(ctx, frame, w, h) {
  ctx.clearRect(0, 0, w, h);

  // Fan corals (branching silhouettes)
  ctx.strokeStyle = 'rgba(14,66,114,0.6)';
  const fans = [30, 100, 180, 260, 350, 430];
  fans.forEach((fx, i) => {
    const fy = h - 20 - (i * 13) % 30;
    const fh = 40 + (i * 17) % 30;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx, fy - fh * 0.4); ctx.stroke();
    // branches
    ctx.lineWidth = 1;
    for (let b = 0; b < 5; b++) {
      const by = fy - fh * (0.2 + b * 0.15);
      const dir = b % 2 === 0 ? 1 : -1;
      ctx.beginPath(); ctx.moveTo(fx, by);
      ctx.bezierCurveTo(fx + dir * 8, by - 5, fx + dir * 14, by - 8, fx + dir * 18, by - 6);
      ctx.stroke();
    }
    // Tip
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(fx, fy - fh * 0.8);
    ctx.bezierCurveTo(fx + 6, fy - fh, fx + 10, fy - fh, fx + 8, fy - fh * 0.95);
    ctx.stroke();
    ctx.beginPath(); ctx.moveTo(fx, fy - fh * 0.8);
    ctx.bezierCurveTo(fx - 6, fy - fh, fx - 10, fy - fh, fx - 8, fy - fh * 0.95);
    ctx.stroke();
  });

  // Sea-grass patches on bottom
  ctx.strokeStyle = 'rgba(20,80,40,0.5)';
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 40; i++) {
    const gx = (i * 13 + 5) % w;
    const gy = h - 8;
    const wg = (i % 3 === 0 ? 1 : -1);
    ctx.beginPath(); ctx.moveTo(gx, gy);
    ctx.bezierCurveTo(gx + wg * 3, gy - 8, gx + wg * 5, gy - 14, gx + wg * 4, gy - 18);
    ctx.stroke();
  }

  // Mid-water fish silhouettes
  ctx.fillStyle = 'rgba(8,36,68,0.55)';
  const fishes = [{x:80,y:60},{x:160,y:90},{x:240,y:55},{x:320,y:80},{x:420,y:65}];
  fishes.forEach(f => {
    ctx.beginPath(); ctx.ellipse(f.x, f.y, 7, 2.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(f.x - 7, f.y);
    ctx.lineTo(f.x - 11, f.y - 3); ctx.lineTo(f.x - 9, f.y); ctx.lineTo(f.x - 11, f.y + 3);
    ctx.closePath(); ctx.fill();
  });
}

function drawBgMangrove(ctx, frame, w, h) {
  ctx.clearRect(0, 0, w, h);

  // Sandy bottom — bright Bahamian white sand
  const sandG = ctx.createLinearGradient(0, h - 30, 0, h);
  sandG.addColorStop(0, '#d4c870');
  sandG.addColorStop(0.4, '#e8dc90');
  sandG.addColorStop(1, '#f0e8a8');
  ctx.fillStyle = sandG;
  ctx.fillRect(0, h - 30, w, 30);
  // Sand ripples
  ctx.strokeStyle = 'rgba(180,160,60,0.3)';
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 8; i++) {
    const sy = h - 24 + i * 3;
    ctx.beginPath();
    for (let x = 0; x < w; x += 2) {
      const yOff = Math.sin((x + i * 30) * 0.06) * 1.5;
      if (x === 0) ctx.moveTo(x, sy + yOff);
      else ctx.lineTo(x, sy + yOff);
    }
    ctx.stroke();
  }

  // Mangrove roots — organic, branching prop roots
  const roots = [
    {x:25, depth:65}, {x:70, depth:50}, {x:110, depth:72}, {x:160, depth:45},
    {x:200, depth:60}, {x:250, depth:80}, {x:295, depth:55}, {x:340, depth:65},
    {x:385, depth:48}, {x:430, depth:70}, {x:470, depth:58},
  ];

  roots.forEach(root => {
    const mainCol = '#4a2a0e';
    // Main trunk
    ctx.fillStyle = mainCol;
    ctx.fillRect(root.x - 3, 0, 6, root.depth);
    // Bark texture lines
    ctx.strokeStyle = 'rgba(30,15,5,0.4)';
    ctx.lineWidth = 0.5;
    for (let d = 8; d < root.depth; d += 12) {
      ctx.beginPath(); ctx.moveTo(root.x - 3, d); ctx.lineTo(root.x + 3, d + 3); ctx.stroke();
    }
    // Prop roots (arching down from trunk)
    ctx.fillStyle = '#5a3518';
    const propRoots = [-14, -6, 6, 14];
    propRoots.forEach((offset, pi) => {
      const archH = root.depth + 15 + pi * 4;
      const archX = root.x + offset;
      ctx.save();
      ctx.strokeStyle = '#5a3518';
      ctx.lineWidth = 2.5 - pi * 0.3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(root.x + (offset > 0 ? 2 : -2), root.depth * 0.6);
      ctx.bezierCurveTo(
        archX * 0.7 + root.x * 0.3, root.depth * 0.8,
        archX, archH * 0.85,
        archX, archH
      );
      ctx.stroke();
      // Root tip fans out
      for (let r = -1; r <= 1; r++) {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(archX, archH);
        ctx.lineTo(archX + r * 5, archH + 8);
        ctx.stroke();
      }
      ctx.restore();
    });
    // Leaves at top
    ctx.fillStyle = '#2d6020';
    for (let li = -2; li <= 2; li++) {
      ctx.beginPath();
      ctx.ellipse(root.x + li * 7, -5, 6, 4, li * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Dappled light patches on sand (filtered through mangrove canopy)
  ctx.fillStyle = 'rgba(255,245,180,0.12)';
  for (let i = 0; i < 8; i++) {
    const lx = (i * 67 + 15) % (w - 30);
    ctx.beginPath();
    ctx.ellipse(lx + 15, h - 18, 12 + (i * 7) % 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawBgSurface(ctx, frame, w, h) {
  ctx.clearRect(0, 0, w, h);
  const surfH = h * 0.2;

  // Bahamian turquoise surface water
  const sg = ctx.createLinearGradient(0, 0, 0, surfH);
  sg.addColorStop(0.0, 'rgba(0,180,216,0.45)');
  sg.addColorStop(0.5, 'rgba(0,150,200,0.25)');
  sg.addColorStop(1.0, 'rgba(0,120,180,0.05)');
  ctx.fillStyle = sg;
  ctx.fillRect(0, 0, w, surfH);

  // Caustic light network — interconnected irregular loops
  ctx.strokeStyle = 'rgba(144,224,239,0.25)';
  ctx.lineWidth = 0.9;
  const caustics = [
    {x:30,  y:10, rx:14, ry:4, rot: 0.2},
    {x:90,  y:6,  rx:10, ry:3, rot:-0.3},
    {x:140, y:12, rx:16, ry:5, rot: 0.1},
    {x:200, y:7,  rx:12, ry:4, rot: 0.4},
    {x:255, y:11, rx:18, ry:5, rot:-0.2},
    {x:310, y:5,  rx:10, ry:3, rot: 0.3},
    {x:360, y:13, rx:14, ry:4, rot:-0.1},
    {x:415, y:8,  rx:11, ry:3, rot: 0.2},
    {x:460, y:10, rx:15, ry:4, rot:-0.3},
    // smaller fill-ins
    {x:60,  y:15, rx:7,  ry:2, rot: 0.1},
    {x:120, y:4,  rx:6,  ry:2, rot:-0.2},
    {x:180, y:16, rx:8,  ry:2, rot: 0.3},
    {x:230, y:3,  rx:7,  ry:2, rot: 0.0},
    {x:285, y:16, rx:9,  ry:2, rot:-0.1},
    {x:335, y:4,  rx:6,  ry:2, rot: 0.2},
    {x:390, y:14, rx:8,  ry:2, rot: 0.1},
    {x:440, y:5,  rx:7,  ry:2, rot:-0.2},
  ];
  caustics.forEach(c => {
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rot);
    ctx.beginPath(); ctx.ellipse(0, 0, c.rx, c.ry, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  });

  // Bright caustic fills (the actual light patches)
  ctx.fillStyle = 'rgba(180,240,255,0.1)';
  caustics.slice(0, 9).forEach(c => {
    ctx.save();
    ctx.translate(c.x, c.y); ctx.rotate(c.rot);
    ctx.beginPath(); ctx.ellipse(0, 0, c.rx - 3, c.ry - 1, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  });

  // Water surface line at top (rippling)
  const wg = ctx.createLinearGradient(0, 0, w, 0);
  wg.addColorStop(0, 'rgba(0,200,230,0.5)');
  wg.addColorStop(0.5, 'rgba(144,224,239,0.6)');
  wg.addColorStop(1, 'rgba(0,200,230,0.5)');
  ctx.strokeStyle = wg;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 3) {
    const y = Math.sin(x * 0.08) * 1.2 + Math.sin(x * 0.13) * 0.8;
    if (x === 0) ctx.moveTo(x, y + 1.5);
    else ctx.lineTo(x, y + 1.5);
  }
  ctx.stroke();
}

// ─── LIFE ICON — shark fin silhouette, 14×12px ───────────────────────────────
function drawLifeIcon(ctx, frame, w, h) {
  // Fin shape
  ctx.fillStyle = '#52b788';
  ctx.beginPath();
  ctx.moveTo(7, 0);
  ctx.bezierCurveTo(7.5, 0, 11, 3, 12, 8);
  ctx.lineTo(2, 8);
  ctx.bezierCurveTo(3, 3, 6.5, 0, 7, 0);
  ctx.closePath();
  ctx.fill();
  // Fin highlight
  ctx.fillStyle = 'rgba(100,220,160,0.4)';
  ctx.beginPath();
  ctx.moveTo(7, 1);
  ctx.bezierCurveTo(7.3, 1, 9, 3.5, 9.5, 7);
  ctx.lineTo(6, 7);
  ctx.bezierCurveTo(6.2, 3.5, 6.8, 1, 7, 1);
  ctx.closePath();
  ctx.fill();
  // Body stub
  const bg2 = ctx.createLinearGradient(0, 8, 0, 12);
  bg2.addColorStop(0, '#d4b030');
  bg2.addColorStop(1, '#b89828');
  ctx.fillStyle = bg2;
  ctx.beginPath();
  ctx.ellipse(7, 10, 5.5, 2.2, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawLifeIconGrey(ctx, frame, w, h) {
  ctx.fillStyle = '#2a2a2a';
  ctx.beginPath();
  ctx.moveTo(7, 0);
  ctx.bezierCurveTo(7.5, 0, 11, 3, 12, 8);
  ctx.lineTo(2, 8);
  ctx.bezierCurveTo(3, 3, 6.5, 0, 7, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.ellipse(7, 10, 5.5, 2.2, 0, 0, Math.PI * 2);
  ctx.fill();
}

// ─── BULL SHARK — 44×22px, 2 frames ─────────────────────────────────────────
// Stocky, grey-brown, broad rounded snout. Second dorsal much smaller than
// first — easy way to tell it apart from the lemon shark.
function drawBullShark(ctx, frame, w, h) {
  const cy = 12;
  const tw = frame === 0 ? 0 : 3;

  // Body — stockier and more uniform than lemon shark
  const bg = ctx.createLinearGradient(0, 3, 0, h);
  bg.addColorStop(0.0, '#3a3a3a');  // dark grey dorsal
  bg.addColorStop(0.35,'#646464'); // mid grey
  bg.addColorStop(0.65,'#888');    // lighter flank
  bg.addColorStop(1.0, '#c8c8c0'); // pale belly
  ctx.fillStyle = bg;

  ctx.beginPath();
  ctx.moveTo(6, cy + tw * 0.35);
  ctx.bezierCurveTo(14, cy - 4.5, 26, cy - 5, 34, cy - 4.5);
  ctx.bezierCurveTo(40, cy - 4, 43, cy - 2, 43.5, cy); // blunter nose than lemon
  ctx.bezierCurveTo(43.5, cy + 1, 43, cy + 2.5, 41, cy + 3.5);
  ctx.bezierCurveTo(35, cy + 5, 26, cy + 5, 14, cy + 4.5);
  ctx.bezierCurveTo(8, cy + 4, 6, cy + 3, 6, cy - tw * 0.35);
  ctx.closePath();
  ctx.fill();

  // Belly pale patch
  ctx.fillStyle = 'rgba(210,210,200,0.5)';
  ctx.beginPath();
  ctx.moveTo(15, cy + 1.5);
  ctx.bezierCurveTo(26, cy + 2, 36, cy + 2.5, 40, cy + 2);
  ctx.bezierCurveTo(40, cy + 4, 36, cy + 5, 26, cy + 5);
  ctx.bezierCurveTo(16, cy + 5, 12, cy + 4, 10, cy + 3);
  ctx.closePath();
  ctx.fill();

  // Shading
  const sh = ctx.createLinearGradient(0, 5, 0, cy);
  sh.addColorStop(0, 'rgba(0,0,0,0.3)');
  sh.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = sh;
  ctx.beginPath();
  ctx.moveTo(6, cy); ctx.bezierCurveTo(14, cy-4.5, 26, cy-5, 34, cy-4.5);
  ctx.bezierCurveTo(40, cy-4, 43, cy-2, 43.5, cy);
  ctx.bezierCurveTo(40, cy+1.5, 34, cy+2, 26, cy+2);
  ctx.bezierCurveTo(14, cy+2, 6, cy+1.5, 6, cy);
  ctx.fill();

  // Tail — heterocercal
  const fc = '#505050';
  ctx.fillStyle = fc;
  ctx.beginPath();
  ctx.moveTo(7, cy + tw * 0.3);
  ctx.bezierCurveTo(4, cy - 2 + tw, 1.5, cy - 7 + tw, 1, cy - 9 + tw);
  ctx.bezierCurveTo(2, cy - 10 + tw, 4, cy - 8 + tw, 5, cy - 5 + tw * 0.6);
  ctx.bezierCurveTo(6, cy - 2 + tw * 0.4, 7, cy, 7, cy + tw * 0.3);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(7, cy - tw * 0.3);
  ctx.bezierCurveTo(4, cy + 2 - tw * 0.5, 2.5, cy + 5 - tw, 2.5, cy + 7 - tw);
  ctx.bezierCurveTo(3.5, cy + 8 - tw, 5, cy + 6 - tw * 0.5, 6.5, cy + 4);
  ctx.bezierCurveTo(7, cy + 2, 7, cy, 7, cy - tw * 0.3);
  ctx.fill();

  // FIRST dorsal fin — tall, angular
  ctx.fillStyle = fc;
  ctx.beginPath();
  ctx.moveTo(24, cy - 4.5);
  ctx.bezierCurveTo(25, cy - 8, 28, cy - 12, 30, cy - 12);
  ctx.bezierCurveTo(32, cy - 12, 34, cy - 9, 35, cy - 5);
  ctx.bezierCurveTo(32, cy - 4.8, 28, cy - 4.6, 24, cy - 4.5);
  ctx.fill();
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(24, cy - 4.5); ctx.bezierCurveTo(25, cy - 8, 28, cy - 12, 30, cy - 12);
  ctx.stroke();

  // SECOND dorsal fin — noticeably SMALLER (key bull shark feature)
  ctx.fillStyle = fc;
  ctx.beginPath();
  ctx.moveTo(11, cy - 3.5);
  ctx.bezierCurveTo(11.5, cy - 6, 13, cy - 8, 14.5, cy - 8);
  ctx.bezierCurveTo(16, cy - 8, 17, cy - 6, 17.5, cy - 4);
  ctx.bezierCurveTo(15, cy - 3.7, 13, cy - 3.6, 11, cy - 3.5);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(11, cy - 3.5); ctx.bezierCurveTo(11.5, cy - 6, 13, cy - 8, 14.5, cy - 8);
  ctx.stroke();

  // Pectoral fin — shorter, broader
  ctx.fillStyle = fc;
  ctx.beginPath();
  ctx.moveTo(31, cy + 2);
  ctx.bezierCurveTo(33, cy + 5, 35, cy + 8, 34, cy + 10);
  ctx.bezierCurveTo(31, cy + 10.5, 28, cy + 8, 27, cy + 5);
  ctx.bezierCurveTo(28, cy + 3, 30, cy + 2, 31, cy + 2);
  ctx.fill();

  // Pelvic fin
  ctx.beginPath();
  ctx.moveTo(15, cy + 3);
  ctx.bezierCurveTo(14, cy + 5.5, 12, cy + 7.5, 11, cy + 8);
  ctx.bezierCurveTo(9.5, cy + 7.5, 10, cy + 5, 11, cy + 3.5);
  ctx.bezierCurveTo(12.5, cy + 3, 14, cy + 3, 15, cy + 3);
  ctx.fill();

  // 5 Gill slits
  ctx.strokeStyle = 'rgba(40,40,40,0.6)';
  ctx.lineWidth = 0.6;
  for (let g = 0; g < 5; g++) {
    const gx = 36 - g * 1.8;
    ctx.beginPath(); ctx.moveTo(gx, cy - 2.5); ctx.lineTo(gx - 0.5, cy + 2); ctx.stroke();
  }

  // Lateral line
  ctx.strokeStyle = 'rgba(120,120,100,0.4)';
  ctx.lineWidth = 0.5;
  ctx.setLineDash([2, 2]);
  ctx.beginPath(); ctx.moveTo(8, cy); ctx.bezierCurveTo(18, cy, 32, cy - 0.5, 40, cy - 1); ctx.stroke();
  ctx.setLineDash([]);

  // Eye — dark, no green (bull sharks have small dark eyes)
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath(); ctx.ellipse(40, cy - 2.5, 2, 1.6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.beginPath(); ctx.arc(40.8, cy - 3.2, 0.5, 0, Math.PI * 2); ctx.fill();

  // Snout — broad, rounded
  ctx.strokeStyle = 'rgba(40,40,40,0.5)';
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(43.5, cy + 1); ctx.bezierCurveTo(42, cy + 2.5, 40, cy + 2.8, 38.5, cy + 2.5);
  ctx.stroke();

  // Body outline
  ctx.strokeStyle = 'rgba(40,40,40,0.25)';
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(6, cy + tw * 0.35);
  ctx.bezierCurveTo(14, cy - 4.5, 26, cy - 5, 34, cy - 4.5);
  ctx.bezierCurveTo(40, cy - 4, 43, cy - 2, 43.5, cy);
  ctx.bezierCurveTo(43, cy + 2.5, 35, cy + 5, 14, cy + 4.5);
  ctx.bezierCurveTo(8, cy + 4, 6, cy + 3, 6, cy - tw * 0.35);
  ctx.stroke();
}

// ─── TIGER SHARK — 52×24px, 2 frames ─────────────────────────────────────────
// Blunt broad snout, dark vertical body stripes (faded in adults), greenish-grey.
function drawTigerShark(ctx, frame, w, h) {
  const cy = 13;
  const tw = frame === 0 ? 0 : 3.5;

  // Body gradient — bluish-grey-green
  const bg = ctx.createLinearGradient(0, 3, 0, h);
  bg.addColorStop(0.0, '#2a3830');
  bg.addColorStop(0.3, '#485a50');
  bg.addColorStop(0.6, '#6a8070');
  bg.addColorStop(1.0, '#c8d4c0');
  ctx.fillStyle = bg;

  ctx.beginPath();
  ctx.moveTo(6, cy + tw * 0.3);
  ctx.bezierCurveTo(14, cy - 5, 28, cy - 5.5, 40, cy - 5);
  ctx.bezierCurveTo(47, cy - 4, 51, cy - 2, 51.5, cy);
  ctx.bezierCurveTo(51.5, cy + 1.5, 50, cy + 3, 47, cy + 4);
  ctx.bezierCurveTo(40, cy + 5.5, 28, cy + 5.5, 14, cy + 4.5);
  ctx.bezierCurveTo(8, cy + 4, 6, cy + 2.5, 6, cy - tw * 0.3);
  ctx.closePath();
  ctx.fill();

  // Belly pale
  ctx.fillStyle = 'rgba(210,220,200,0.45)';
  ctx.beginPath();
  ctx.moveTo(16, cy + 1.5);
  ctx.bezierCurveTo(30, cy + 2, 42, cy + 3, 47, cy + 2.5);
  ctx.bezierCurveTo(47, cy + 5, 42, cy + 5.5, 30, cy + 5.5);
  ctx.bezierCurveTo(18, cy + 5.5, 13, cy + 4.5, 11, cy + 3.5);
  ctx.closePath();
  ctx.fill();

  // Dorsal shading
  const sh = ctx.createLinearGradient(0, 5, 0, cy);
  sh.addColorStop(0, 'rgba(0,0,0,0.32)');
  sh.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = sh;
  ctx.beginPath();
  ctx.moveTo(6, cy); ctx.bezierCurveTo(14, cy-5, 28, cy-5.5, 40, cy-5);
  ctx.bezierCurveTo(47, cy-4, 51, cy-2, 51.5, cy);
  ctx.bezierCurveTo(47, cy+2, 40, cy+2.5, 28, cy+2.5);
  ctx.bezierCurveTo(14, cy+2.5, 6, cy+2, 6, cy);
  ctx.fill();

  // TIGER STRIPES — faded vertical dark bands (the key visual feature)
  ctx.fillStyle = 'rgba(30,45,35,0.28)';
  const stripeXs = [14, 20, 26, 32, 38];
  stripeXs.forEach(sx => {
    ctx.beginPath();
    ctx.ellipse(sx, cy - 0.5, 2.5, 5, 0.15, 0, Math.PI * 2);
    ctx.fill();
  });

  // Tail — long upper lobe (tiger shark hallmark)
  const fc = '#384840';
  ctx.fillStyle = fc;
  // Upper lobe — distinctively long and narrow
  ctx.beginPath();
  ctx.moveTo(7, cy + tw * 0.35);
  ctx.bezierCurveTo(4.5, cy - 2 + tw, 2, cy - 9 + tw, 1, cy - 13 + tw);
  ctx.bezierCurveTo(2, cy - 14 + tw, 3.5, cy - 12 + tw, 5, cy - 8 + tw * 0.7);
  ctx.bezierCurveTo(6, cy - 4 + tw * 0.4, 7, cy - 1, 7, cy + tw * 0.35);
  ctx.fill();
  // Lower lobe
  ctx.beginPath();
  ctx.moveTo(7, cy - tw * 0.35);
  ctx.bezierCurveTo(4.5, cy + 2 - tw * 0.5, 3, cy + 5.5 - tw, 3, cy + 7 - tw);
  ctx.bezierCurveTo(4, cy + 8 - tw, 5.5, cy + 6 - tw * 0.5, 6.5, cy + 4);
  ctx.bezierCurveTo(7, cy + 2, 7, cy, 7, cy - tw * 0.35);
  ctx.fill();
  // Notch in upper lobe trailing edge
  ctx.fillStyle = 'rgba(2,11,24,0.5)';
  ctx.beginPath(); ctx.ellipse(3, cy + tw * 0.1, 1, 1.5, 0.3, 0, Math.PI * 2); ctx.fill();

  // FIRST dorsal fin — moderate, swept back
  ctx.fillStyle = fc;
  ctx.beginPath();
  ctx.moveTo(30, cy - 5);
  ctx.bezierCurveTo(31, cy - 9, 34, cy - 13, 36.5, cy - 13);
  ctx.bezierCurveTo(38.5, cy - 13, 40, cy - 10, 41.5, cy - 5.5);
  ctx.bezierCurveTo(38, cy - 5.2, 34, cy - 5, 30, cy - 5);
  ctx.fill();
  ctx.strokeStyle = '#253028';
  ctx.lineWidth = 0.7;
  ctx.beginPath(); ctx.moveTo(30, cy-5); ctx.bezierCurveTo(31, cy-9, 34, cy-13, 36.5, cy-13); ctx.stroke();

  // SECOND dorsal fin — small
  ctx.fillStyle = fc;
  ctx.beginPath();
  ctx.moveTo(11, cy - 3.5);
  ctx.bezierCurveTo(11.5, cy - 6.5, 13.5, cy - 8.5, 15, cy - 8.5);
  ctx.bezierCurveTo(16.5, cy - 8.5, 17.5, cy - 6.5, 18, cy - 4);
  ctx.bezierCurveTo(16, cy - 3.7, 13, cy - 3.6, 11, cy - 3.5);
  ctx.fill();
  ctx.beginPath(); ctx.moveTo(11, cy-3.5); ctx.bezierCurveTo(11.5, cy-6.5, 13.5, cy-8.5, 15, cy-8.5); ctx.stroke();

  // Pectoral fin
  ctx.fillStyle = fc;
  ctx.beginPath();
  ctx.moveTo(40, cy + 2);
  ctx.bezierCurveTo(42, cy + 5.5, 44, cy + 10, 42.5, cy + 12);
  ctx.bezierCurveTo(39.5, cy + 12.5, 36.5, cy + 9.5, 35.5, cy + 6);
  ctx.bezierCurveTo(37, cy + 3.5, 38.5, cy + 2, 40, cy + 2);
  ctx.fill();

  // Pelvic fin
  ctx.beginPath();
  ctx.moveTo(18, cy + 3.5);
  ctx.bezierCurveTo(17, cy + 6, 15, cy + 8.5, 14, cy + 9);
  ctx.bezierCurveTo(12.5, cy + 8.5, 13, cy + 6, 14, cy + 4);
  ctx.bezierCurveTo(15.5, cy + 3.5, 17, cy + 3.5, 18, cy + 3.5);
  ctx.fill();

  // 5 Gill slits
  ctx.strokeStyle = 'rgba(30,45,35,0.55)';
  ctx.lineWidth = 0.6;
  for (let g = 0; g < 5; g++) {
    const gx = 43 - g * 2;
    ctx.beginPath(); ctx.moveTo(gx, cy - 2.5); ctx.lineTo(gx - 0.5, cy + 3); ctx.stroke();
  }

  // Lateral line
  ctx.strokeStyle = 'rgba(100,130,110,0.35)';
  ctx.lineWidth = 0.5;
  ctx.setLineDash([2, 2]);
  ctx.beginPath(); ctx.moveTo(8, cy); ctx.bezierCurveTo(22, cy, 38, cy - 0.5, 48, cy - 1); ctx.stroke();
  ctx.setLineDash([]);

  // Eye — golden-green (tiger sharks have distinctive eyes)
  ctx.fillStyle = '#2a3020';
  ctx.beginPath(); ctx.ellipse(48.5, cy - 3, 2.2, 1.8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#5a7040';
  ctx.beginPath(); ctx.ellipse(48.5, cy - 3, 1.5, 1.2, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#151a10';
  ctx.beginPath(); ctx.ellipse(48.3, cy - 3, 0.8, 0.7, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.beginPath(); ctx.arc(49, cy - 3.6, 0.5, 0, Math.PI * 2); ctx.fill();

  // Broad blunt snout
  ctx.strokeStyle = 'rgba(30,45,35,0.5)';
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(51.5, cy + 1); ctx.bezierCurveTo(50, cy + 2.5, 47.5, cy + 3.5, 46, cy + 3);
  ctx.stroke();

  // Body outline
  ctx.strokeStyle = 'rgba(30,45,35,0.25)';
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(6, cy + tw * 0.3);
  ctx.bezierCurveTo(14, cy-5, 28, cy-5.5, 40, cy-5);
  ctx.bezierCurveTo(47, cy-4, 51, cy-2, 51.5, cy);
  ctx.bezierCurveTo(50, cy+3, 40, cy+5.5, 14, cy+4.5);
  ctx.bezierCurveTo(8, cy+4, 6, cy+2.5, 6, cy-tw*0.3);
  ctx.stroke();
}

// ─── GREAT HAMMERHEAD — 60×30px, 2 frames ────────────────────────────────────
// Instantly recognisable: wide flat cephalofoil (hammer head), very tall
// sickle-shaped first dorsal fin, olive-grey. The cephalofoil extends ~10px
// above and below the body centreline at the snout.
function drawHammerhead(ctx, frame, w, h) {
  const cy = 16;  // body centreline — lower to leave room for tall dorsal above
  const tw = frame === 0 ? 0 : 4;

  // Body
  const bg = ctx.createLinearGradient(0, 4, 0, h);
  bg.addColorStop(0.0, '#2a2e20');
  bg.addColorStop(0.3, '#4a5238');
  bg.addColorStop(0.6, '#707860');
  bg.addColorStop(1.0, '#c4c8b0');
  ctx.fillStyle = bg;

  ctx.beginPath();
  ctx.moveTo(7, cy + tw * 0.3);
  ctx.bezierCurveTo(16, cy - 5, 30, cy - 5.5, 44, cy - 5);
  ctx.bezierCurveTo(52, cy - 4, 56, cy - 2, 57, cy);    // neck narrows to hammer joint
  ctx.bezierCurveTo(57, cy + 2, 55, cy + 3.5, 52, cy + 4.5);
  ctx.bezierCurveTo(44, cy + 5.5, 30, cy + 5.5, 16, cy + 5);
  ctx.bezierCurveTo(9, cy + 4.5, 7, cy + 3, 7, cy - tw * 0.3);
  ctx.closePath();
  ctx.fill();

  // Belly
  ctx.fillStyle = 'rgba(200,205,185,0.4)';
  ctx.beginPath();
  ctx.moveTo(18, cy + 1.5);
  ctx.bezierCurveTo(32, cy + 2.5, 46, cy + 3.5, 52, cy + 3);
  ctx.bezierCurveTo(52, cy + 5.5, 46, cy + 5.5, 32, cy + 5.5);
  ctx.bezierCurveTo(20, cy + 5.5, 14, cy + 4.5, 12, cy + 3.5);
  ctx.closePath();
  ctx.fill();

  // Dorsal shading
  const sh = ctx.createLinearGradient(0, 6, 0, cy);
  sh.addColorStop(0, 'rgba(0,0,0,0.3)');
  sh.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = sh;
  ctx.beginPath();
  ctx.moveTo(7, cy); ctx.bezierCurveTo(16, cy-5, 30, cy-5.5, 44, cy-5);
  ctx.bezierCurveTo(52, cy-4, 56, cy-2, 57, cy);
  ctx.bezierCurveTo(52, cy+2, 44, cy+3, 30, cy+3);
  ctx.bezierCurveTo(16, cy+3, 7, cy+2, 7, cy);
  ctx.fill();

  // ── CEPHALOFOIL (THE HAMMER) — the defining feature ─────────────────────
  // The hammer extends well above and below the body at x≈54–59
  const hCol = '#505840';
  const hg = ctx.createLinearGradient(54, 4, 54, 28);
  hg.addColorStop(0, '#384030');
  hg.addColorStop(0.4, '#606850');
  hg.addColorStop(0.6, '#808870');
  hg.addColorStop(1, '#b0b8a0');
  ctx.fillStyle = hg;
  ctx.beginPath();
  // Left wing top
  ctx.moveTo(57, cy - 1);
  ctx.bezierCurveTo(57.5, cy - 4, 58, cy - 9, 58.5, cy - 11); // top wing tip
  ctx.bezierCurveTo(59, cy - 11.5, 59.5, cy - 10, 59.5, cy - 8);
  ctx.bezierCurveTo(59.5, cy - 4, 59, cy - 1, 58, cy + 0.5);  // sweep back to body junction
  // Right wing bottom
  ctx.bezierCurveTo(59, cy + 2, 59.5, cy + 5, 59.5, cy + 7);
  ctx.bezierCurveTo(59.5, cy + 9, 59, cy + 10, 58.5, cy + 10); // bottom wing tip
  ctx.bezierCurveTo(58, cy + 9, 57.5, cy + 4, 57, cy + 1);
  ctx.closePath();
  ctx.fill();
  // Nostril indent on hammer (hammerheads have nostrils on leading edge of cephalofoil)
  ctx.fillStyle = 'rgba(30,35,20,0.6)';
  ctx.beginPath(); ctx.ellipse(59, cy - 6, 0.8, 0.5, 0.3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(59, cy + 5, 0.8, 0.5, -0.3, 0, Math.PI * 2); ctx.fill();
  // Hammer outline for definition
  ctx.strokeStyle = 'rgba(30,35,20,0.4)';
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(57, cy); ctx.bezierCurveTo(57.5, cy - 5, 58, cy - 10, 58.5, cy - 11);
  ctx.bezierCurveTo(59.5, cy - 10, 59.5, cy - 5, 57, cy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(57, cy); ctx.bezierCurveTo(57.5, cy + 5, 58, cy + 9, 58.5, cy + 10);
  ctx.bezierCurveTo(59.5, cy + 9, 59.5, cy + 4, 57, cy);
  ctx.stroke();

  // ── VERY TALL FIRST DORSAL FIN (sickle-shaped — great hammerhead signature) ─
  const fc = '#404830';
  ctx.fillStyle = fc;
  ctx.beginPath();
  ctx.moveTo(33, cy - 5);          // front base
  ctx.bezierCurveTo(34, cy - 10, 37, cy - 19, 40, cy - 21); // rises steeply
  ctx.bezierCurveTo(42, cy - 22, 44, cy - 21, 46, cy - 16); // tip curves back (sickle)
  ctx.bezierCurveTo(47, cy - 12, 48, cy - 7, 48, cy - 5.5); // sweeps down trailing edge
  ctx.bezierCurveTo(44, cy - 5.2, 38, cy - 5, 33, cy - 5);
  ctx.fill();
  ctx.strokeStyle = '#2a3020';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(33, cy - 5); ctx.bezierCurveTo(34, cy - 10, 37, cy - 19, 40, cy - 21);
  ctx.bezierCurveTo(42, cy - 22, 44, cy - 21, 46, cy - 16);
  ctx.stroke();

  // Second dorsal fin — small
  ctx.fillStyle = fc;
  ctx.beginPath();
  ctx.moveTo(13, cy - 3.5);
  ctx.bezierCurveTo(13.5, cy - 6.5, 15.5, cy - 8.5, 17, cy - 8.5);
  ctx.bezierCurveTo(18.5, cy - 8.5, 19.5, cy - 6.5, 20, cy - 4);
  ctx.bezierCurveTo(18, cy - 3.7, 15, cy - 3.6, 13, cy - 3.5);
  ctx.fill();
  ctx.strokeStyle = '#2a3020';
  ctx.lineWidth = 0.6;
  ctx.beginPath(); ctx.moveTo(13, cy-3.5); ctx.bezierCurveTo(13.5, cy-6.5, 15.5, cy-8.5, 17, cy-8.5); ctx.stroke();

  // Pectoral fin
  ctx.fillStyle = fc;
  ctx.beginPath();
  ctx.moveTo(44, cy + 2);
  ctx.bezierCurveTo(46.5, cy + 5.5, 48, cy + 10.5, 46.5, cy + 13);
  ctx.bezierCurveTo(43.5, cy + 13.5, 40, cy + 10, 39, cy + 6.5);
  ctx.bezierCurveTo(40, cy + 4, 42, cy + 2, 44, cy + 2);
  ctx.fill();

  // Tail — heterocercal, very long upper lobe
  ctx.fillStyle = fc;
  ctx.beginPath();
  ctx.moveTo(8, cy + tw * 0.35);
  ctx.bezierCurveTo(5, cy - 2 + tw, 2, cy - 9 + tw, 1, cy - 13 + tw);
  ctx.bezierCurveTo(2, cy - 14 + tw, 3.5, cy - 12 + tw, 5, cy - 8 + tw * 0.6);
  ctx.bezierCurveTo(6.5, cy - 4 + tw * 0.35, 7.5, cy - 1, 8, cy + tw * 0.35);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(8, cy - tw * 0.35);
  ctx.bezierCurveTo(5, cy + 2 - tw * 0.5, 3.5, cy + 5.5 - tw, 3.5, cy + 7 - tw);
  ctx.bezierCurveTo(4.5, cy + 8 - tw, 6, cy + 6 - tw * 0.5, 7, cy + 4);
  ctx.bezierCurveTo(7.5, cy + 2, 8, cy, 8, cy - tw * 0.35);
  ctx.fill();

  // 5 Gill slits
  ctx.strokeStyle = 'rgba(35,40,25,0.55)';
  ctx.lineWidth = 0.65;
  for (let g = 0; g < 5; g++) {
    const gx = 49 - g * 2;
    ctx.beginPath(); ctx.moveTo(gx, cy - 3); ctx.lineTo(gx - 0.5, cy + 2.5); ctx.stroke();
  }

  // Lateral line
  ctx.strokeStyle = 'rgba(90,100,75,0.35)';
  ctx.lineWidth = 0.5;
  ctx.setLineDash([2, 2]);
  ctx.beginPath(); ctx.moveTo(9, cy); ctx.bezierCurveTo(24, cy, 40, cy - 0.5, 54, cy - 1); ctx.stroke();
  ctx.setLineDash([]);

  // Eye — on the outer edge of the hammer wing (unique to hammerheads!)
  // In a side view the eye sits near the wing tip (~y=cy-7 range)
  ctx.fillStyle = '#101810';
  ctx.beginPath(); ctx.ellipse(58.5, cy - 8, 1.5, 1.2, 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#203018';
  ctx.beginPath(); ctx.ellipse(58.5, cy - 8, 1, 0.8, 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.beginPath(); ctx.arc(59, cy - 8.5, 0.4, 0, Math.PI * 2); ctx.fill();
  // Second eye on bottom wing
  ctx.fillStyle = '#101810';
  ctx.beginPath(); ctx.ellipse(58.5, cy + 7, 1.5, 1.2, -0.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.beginPath(); ctx.arc(59, cy + 6.5, 0.4, 0, Math.PI * 2); ctx.fill();

  // Body outline
  ctx.strokeStyle = 'rgba(35,40,25,0.25)';
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(7, cy + tw * 0.3);
  ctx.bezierCurveTo(16, cy-5, 30, cy-5.5, 44, cy-5);
  ctx.bezierCurveTo(52, cy-4, 56, cy-2, 57, cy);
  ctx.bezierCurveTo(55, cy+3.5, 44, cy+5.5, 16, cy+5);
  ctx.bezierCurveTo(9, cy+4.5, 7, cy+3, 7, cy-tw*0.3);
  ctx.stroke();
}

// ─── SCUBA DIVER — 30×14px, 2 frames (horizontal swimmer, faces LEFT) ────────
// Frame 0: fins together. Frame 1: fins split (flutter kick).
function drawScubaDiver(ctx, frame, w, h) {
  const cy = h / 2; // 7

  // Air tank (on their back = top side of horizontal body)
  const tg = ctx.createLinearGradient(8, 1, 8, 5);
  tg.addColorStop(0, '#c0c0c0'); tg.addColorStop(1, '#707070');
  ctx.fillStyle = tg;
  ctx.beginPath(); ctx.roundRect(9, 1.5, 11, 3.5, 1); ctx.fill();
  ctx.strokeStyle = '#555'; ctx.lineWidth = 0.5;
  ctx.strokeRect(9, 1.5, 11, 3.5);
  // Valve
  ctx.fillStyle = '#888';
  ctx.beginPath(); ctx.arc(10.5, 1.5, 1, Math.PI, 0); ctx.fill();

  // Wetsuit body
  const bg = ctx.createLinearGradient(0, cy - 3, 0, cy + 3);
  bg.addColorStop(0, '#1a2060'); bg.addColorStop(0.5, '#2a30a0'); bg.addColorStop(1, '#1a2060');
  ctx.fillStyle = bg;
  ctx.beginPath(); ctx.roundRect(6, cy - 3.5, 18, 7, 2.5); ctx.fill();
  // Yellow stripe
  ctx.fillStyle = '#f5c800';
  ctx.fillRect(10, cy - 0.5, 10, 1.5);
  // Shoulder highlight
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.beginPath(); ctx.roundRect(6, cy - 3.5, 18, 3.5, [2.5, 2.5, 0, 0]); ctx.fill();

  // Head + mask
  ctx.fillStyle = '#c8a078';
  ctx.beginPath(); ctx.ellipse(4, cy, 3.8, 4, 0, 0, Math.PI * 2); ctx.fill();
  // Mask glass (tinted blue)
  ctx.fillStyle = 'rgba(60,160,230,0.45)';
  ctx.strokeStyle = '#222'; ctx.lineWidth = 0.9;
  ctx.beginPath(); ctx.roundRect(1.5, cy - 2.5, 5.5, 5, 1.2); ctx.fill(); ctx.stroke();
  // Regulator mouthpiece
  ctx.fillStyle = '#444';
  ctx.beginPath(); ctx.roundRect(-0.5, cy + 1.5, 3, 2, 0.5); ctx.fill();

  // Regulator hose to tank
  ctx.strokeStyle = '#333'; ctx.lineWidth = 0.7;
  ctx.beginPath(); ctx.moveTo(2.5, cy + 2); ctx.quadraticCurveTo(7, cy - 4, 10, 2.5); ctx.stroke();

  // Fins (orange-yellow, right side = trailing)
  ctx.fillStyle = '#ff8800';
  if (frame === 0) {
    // Fins together, symmetric
    ctx.beginPath();
    ctx.moveTo(23, cy - 1.5);
    ctx.bezierCurveTo(26, cy - 1.5, 30, cy - 2.5, 30, cy - 0.5);
    ctx.bezierCurveTo(30, cy + 0.5, 26, cy + 0.5, 23, cy - 0.5); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(23, cy + 1.5);
    ctx.bezierCurveTo(26, cy + 1.5, 30, cy + 2.5, 30, cy + 0.5);
    ctx.bezierCurveTo(30, cy - 0.5, 26, cy - 0.5, 23, cy + 0.5); ctx.fill();
  } else {
    // Fins split (flutter kick)
    ctx.beginPath();
    ctx.moveTo(23, cy - 2.5);
    ctx.bezierCurveTo(26, cy - 3.5, 30, cy - 5.5, 30, cy - 3.5);
    ctx.bezierCurveTo(30, cy - 1.5, 26, cy - 1.5, 23, cy - 0.5); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(23, cy + 2.5);
    ctx.bezierCurveTo(26, cy + 3.5, 30, cy + 5.5, 30, cy + 3.5);
    ctx.bezierCurveTo(30, cy + 1.5, 26, cy + 1.5, 23, cy + 0.5); ctx.fill();
  }

  // Air bubbles rising from regulator
  ctx.strokeStyle = 'rgba(150,220,255,0.7)'; ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.arc(2, cy - 5 - frame * 0.5, 1.3, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(4.5, cy - 8 + frame * 0.5, 0.8, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(1.5, cy - 10, 0.6, 0, Math.PI * 2); ctx.stroke();
}

// ─── WHALE SHARK — 70×32px, 2 frames — smiling gentle giant ─────────────────
// Head faces RIGHT (same convention as other shark sprites). Will NOT be flipped.
function drawWhaleShark(ctx, frame, w, h) {
  const cy = 17; // centreline Y
  const tSwing = frame === 0 ? 0 : 4;

  // Body — blue-grey with cream belly
  const bodyGrad = ctx.createLinearGradient(0, 2, 0, h);
  bodyGrad.addColorStop(0.0, '#1e3a5f');
  bodyGrad.addColorStop(0.35, '#2e5a8a');
  bodyGrad.addColorStop(0.65, '#4a7aaa');
  bodyGrad.addColorStop(1.0, '#e8f5f0');
  ctx.fillStyle = bodyGrad;

  ctx.beginPath();
  ctx.moveTo(7, cy + tSwing * 0.3);
  ctx.bezierCurveTo(22, cy - 8, 42, cy - 13, 58, cy - 12);
  ctx.bezierCurveTo(64, cy - 11, 68, cy - 8, 69, cy - 4);
  ctx.bezierCurveTo(70, cy - 1, 70, cy + 2, 69, cy + 6);
  // Wide flat jaw
  ctx.bezierCurveTo(68, cy + 11, 63, cy + 14, 57, cy + 14);
  ctx.bezierCurveTo(40, cy + 14, 22, cy + 11, 8, cy + 7);
  ctx.bezierCurveTo(7, cy + 5, 7, cy + 3, 7, cy - tSwing * 0.3);
  ctx.closePath();
  ctx.fill();

  // Belly highlight
  const bellyGrad = ctx.createLinearGradient(0, cy + 6, 0, cy + 14);
  bellyGrad.addColorStop(0, 'rgba(255,255,255,0)');
  bellyGrad.addColorStop(1, 'rgba(235,255,248,0.8)');
  ctx.fillStyle = bellyGrad;
  ctx.beginPath();
  ctx.moveTo(20, cy + 8);
  ctx.bezierCurveTo(40, cy + 13, 56, cy + 14, 66, cy + 10);
  ctx.bezierCurveTo(63, cy + 15, 48, cy + 16, 30, cy + 15);
  ctx.bezierCurveTo(20, cy + 14, 13, cy + 12, 20, cy + 8);
  ctx.fill();

  // White spots — characteristic whale shark pattern
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  [
    {x:54,y:cy-9,r:2.8},{x:45,y:cy-11,r:2.2},{x:36,y:cy-10,r:2.5},
    {x:27,y:cy-9, r:2}, {x:18,y:cy-7, r:1.8},{x:60,y:cy-4, r:2},
    {x:50,y:cy-2, r:1.8},{x:41,y:cy-3,r:2.2},{x:32,y:cy-2, r:1.8},
    {x:22,y:cy-1, r:1.5},{x:13,y:cy-4,r:1.5},{x:62,y:cy-8, r:1.5},
    {x:56,y:cy+4, r:1.5},{x:47,y:cy+5,r:1.2},{x:38,y:cy+6, r:1.5},
    {x:29,y:cy+6, r:1.2},
  ].forEach(s => {
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
  });

  // Caudal fin
  const fc = '#1e3a5f';
  ctx.fillStyle = fc;
  ctx.beginPath(); // upper lobe
  ctx.moveTo(8, cy + tSwing * 0.2);
  ctx.bezierCurveTo(5, cy - 3 + tSwing, 2, cy - 9 + tSwing, 1, cy - 13 + tSwing);
  ctx.bezierCurveTo(3, cy - 14 + tSwing, 6, cy - 11 + tSwing, 7, cy - 5 + tSwing * 0.5);
  ctx.bezierCurveTo(8, cy - 2 + tSwing * 0.3, 8, cy, 8, cy + tSwing * 0.2); ctx.fill();
  ctx.beginPath(); // lower lobe
  ctx.moveTo(8, cy - tSwing * 0.2);
  ctx.bezierCurveTo(5, cy + 3 - tSwing * 0.5, 2, cy + 8 - tSwing, 1, cy + 11 - tSwing);
  ctx.bezierCurveTo(3, cy + 12 - tSwing, 6, cy + 9 - tSwing, 7, cy + 4 - tSwing * 0.3);
  ctx.bezierCurveTo(8, cy + 2, 8, cy, 8, cy - tSwing * 0.2); ctx.fill();

  // Dorsal fin
  ctx.fillStyle = fc;
  ctx.beginPath();
  ctx.moveTo(29, cy - 10);
  ctx.bezierCurveTo(30, cy - 17, 36, cy - 22, 40, cy - 22);
  ctx.bezierCurveTo(44, cy - 22, 47, cy - 16, 49, cy - 11);
  ctx.bezierCurveTo(43, cy - 10, 36, cy - 10, 29, cy - 10); ctx.fill();

  // Pectoral fin (huge)
  ctx.fillStyle = fc;
  ctx.beginPath();
  ctx.moveTo(50, cy + 2);
  ctx.bezierCurveTo(52, cy + 8, 56, cy + 18, 53, cy + 22);
  ctx.bezierCurveTo(48, cy + 22, 43, cy + 14, 42, cy + 8);
  ctx.bezierCurveTo(44, cy + 4, 48, cy + 2, 50, cy + 2); ctx.fill();

  // Gill slits (5, large)
  ctx.strokeStyle = 'rgba(10,30,60,0.5)'; ctx.lineWidth = 1;
  for (let g = 0; g < 5; g++) {
    const gx = 56 - g * 3.5;
    ctx.beginPath(); ctx.moveTo(gx, cy - 5); ctx.quadraticCurveTo(gx - 0.5, cy, gx, cy + 6); ctx.stroke();
  }

  // BIG SMILE — whale shark's most charming feature
  // A wide upward curve on the broad terminal mouth
  ctx.strokeStyle = '#0a1a30'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(68.5, cy + 3);
  ctx.quadraticCurveTo(71, cy + 9, 68, cy + 13);
  ctx.stroke();
  // Teeth hint (dotted line inside mouth)
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 0.6;
  ctx.setLineDash([1, 2]);
  ctx.beginPath();
  ctx.moveTo(67.5, cy + 5);
  ctx.quadraticCurveTo(70, cy + 9.5, 67, cy + 12);
  ctx.stroke();
  ctx.setLineDash([]);

  // Eye (warm, friendly)
  ctx.fillStyle = '#0a2040';
  ctx.beginPath(); ctx.arc(65, cy - 1, 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(40,110,70,0.7)';
  ctx.beginPath(); ctx.arc(65, cy - 0.5, 1.8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath(); ctx.arc(66, cy - 2, 1.1, 0, Math.PI * 2); ctx.fill();

  // Happy "cheek" crinkle under eye
  ctx.strokeStyle = 'rgba(10,30,60,0.35)'; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.arc(63.5, cy + 5, 4, -0.5, 0.3); ctx.stroke();
}

// ─── MAIN ENTRY ───────────────────────────────────────────────────────────────
export function generateAllSprites(scene) {
  makeSheet(scene, 'shark',       56, 28, 4, drawShark);
  makeSheet(scene, 'shark-hit',   56, 28, 1, drawSharkHit);
  makeSheet(scene, 'pup',         28, 14, 2, drawPup);
  makeSheet(scene, 'fish',        10,  7, 2, drawFish);
  makeSheet(scene, 'snapper',     10,  7, 2, drawSnapper);
  makeSheet(scene, 'jellyfish',   12, 14, 2, drawJellyfish);
  makeSheet(scene, 'net',         28, 64, 1, drawNet);
  makeSheet(scene, 'hook',        10, 16, 2, drawHook);
  makeSheet(scene, 'propeller',   24, 24, 4, drawPropeller);
  makeSheet(scene, 'bubble',       4,  4, 3, drawBubble);
  makeSheet(scene, 'bg-deep',    480,270, 1, drawBgDeep);
  makeSheet(scene, 'bg-mid',     480,270, 1, drawBgMid);
  makeSheet(scene, 'bg-mangrove',480,270, 1, drawBgMangrove);
  makeSheet(scene, 'bg-surface', 480,270, 1, drawBgSurface);
  makeSheet(scene, 'bull-shark',  44, 22, 2, drawBullShark);
  makeSheet(scene, 'tiger-shark', 52, 24, 2, drawTigerShark);
  makeSheet(scene, 'hammerhead',  60, 30, 2, drawHammerhead);
  makeSheet(scene, 'life-icon',   14, 12, 1, drawLifeIcon);
  makeSheet(scene, 'life-grey',   14, 12, 1, drawLifeIconGrey);
  makeSheet(scene, 'scuba-diver', 30, 14, 2, drawScubaDiver);
  makeSheet(scene, 'whale-shark', 70, 32, 2, drawWhaleShark);
}
