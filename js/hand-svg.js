// Cartoon hand renderer: config -> SVG string. Pure (no DOM) so tests can smoke it.
// Config: {
//   fingers: [index, middle, ring, pinky] curl -1..1 (positive curls toward the pinky
//            side, negative toward the thumb side; |1| = fully folded into the palm)
//   thumbAngle: 0 = straight up along the fingers, 90 = out to the thumb side (viewer
//            left), 180 = straight down; NEGATIVE angles cross inward over the fingers
//   thumbCurl: 0..1 (the "clamped across the folded fingers" strap)
//   thumbHigh: true = thumb sprouts from the fist's top corner (thumbs-up, OK ring)
//   spread: 0..1 global fan, lean: per-finger extra degrees, wristTilt: whole-hand rotation
//   cuff: gang color, label: caption
// }
// Legacy fields still honored: thumbOut 0..1 -> thumbAngle 15+70*t, thumbUp -> high base,
// thumbDown -> angle 176.

export function thumbSpec(c = {}) {
  let angle = c.thumbAngle, curl = c.thumbCurl ?? c.thumb ?? 0.15;
  if (c.thumbUp) { angle = c.thumbAngle ?? 3; curl = c.thumbCurl ?? 0; }
  else if (c.thumbDown) { angle = c.thumbAngle ?? 176; }
  else if (angle == null) angle = 15 + 70 * (c.thumbOut ?? 0.8);
  return { angle, curl, high: c.thumbHigh ?? !!c.thumbUp };
}

export function handSVG(cfg = {}) {
  const c = {
    fingers: [0, 0, 0, 0], thumb: 0.15, thumbOut: 0.8,
    spread: 0.35, lean: [0, 0, 0, 0], cuff: '#e11d48', label: null, ...cfg,
  };
  const TS = thumbSpec(c);
  const SKIN = '#f2c193', LINE = '#33231a';
  const out = [];
  const P = (n) => n.toFixed(1);

  const chain = (x, y, a0, lens, bends) => {
    const pts = [[x, y]];
    let a = a0;
    for (let i = 0; i < lens.length; i++) {
      a += bends[i];
      const r = (a * Math.PI) / 180;
      x += Math.cos(r) * lens[i];
      y += Math.sin(r) * lens[i];
      pts.push([x, y]);
    }
    return pts;
  };
  const seg = (pts, widths) => {
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, y1] = pts[i], [x2, y2] = pts[i + 1], w = widths[i];
      out.push(`<line x1="${P(x1)}" y1="${P(y1)}" x2="${P(x2)}" y2="${P(y2)}" stroke="${LINE}" stroke-width="${w + 4}" stroke-linecap="round"/>`);
      out.push(`<line x1="${P(x1)}" y1="${P(y1)}" x2="${P(x2)}" y2="${P(y2)}" stroke="${SKIN}" stroke-width="${w}" stroke-linecap="round"/>`);
    }
  };

  // palm first — fingers and thumb draw OVER it, so folded fingers read as stacked
  // panels instead of vanishing behind the palm
  out.push(`<path d="M86 128 Q86 118 98 117 L158 121 Q172 122 172 136 L174 184 Q174 208 150 210 L108 210 Q86 208 86 188 Z" fill="${SKIN}" stroke="${LINE}" stroke-width="4"/>`);

  // four fingers (drawn over the palm, thumb goes over them)
  const K = [[88, 138], [116, 130], [142, 134], [166, 146]];
  const LEN = [[46, 26, 17], [54, 29, 19], [48, 26, 17], [36, 21, 14]];
  const BASE = [-9, -2, 5, 14];
  for (let i = 0; i < 4; i++) {
    const a0 = -90 + BASE[i] + (c.spread - 0.35) * 30 * ((i - 1.5) / 1.5) + c.lean[i];
    // fold curve totals 270° so a fully curled finger's tip tucks back INTO the palm
    // (stacked-panel look) instead of escaping past the palm's pinky edge
    const bend = [c.fingers[i] * 95, c.fingers[i] * 105, c.fingers[i] * 70];
    seg(chain(K[i][0], K[i][1], a0, LEN[i], bend), [16, 13.5, 11.5]);
  }

  // thumb over everything (except the cuff)
  const tb = TS.high ? [95, 150] : [89, 171];
  seg(chain(tb[0], tb[1], -90 - TS.angle, [40, 27, 20], [TS.curl * 55, TS.curl * 80, TS.curl * 50]), [18, 15.5, 13]);

  // cuff
  out.push(`<rect x="106" y="206" width="56" height="32" rx="9" fill="${c.cuff}" stroke="${LINE}" stroke-width="4"/>`);

  const body = out.join('');
  const tilted = c.wristTilt ? `<g transform="rotate(${c.wristTilt} 130 170)">${body}</g>` : body;
  const label = c.label
    ? `<text x="120" y="266" text-anchor="middle" font-size="15" font-weight="700" fill="#9a97ad" font-family="inherit">${c.label}</text>`
    : '';
  return `<svg class="handsvg" viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" role="img">${tilted}${label}</svg>`;
}

export function lerpCfg(a, b, t) {
  const L = (x, y) => x + (y - x) * t;
  const ta = thumbSpec(a), tb = thumbSpec(b);
  const bl = b.lean || [0, 0, 0, 0], al = a.lean || [0, 0, 0, 0];
  return {
    fingers: a.fingers.map((v, i) => L(v, b.fingers[i])),
    thumbAngle: L(ta.angle, tb.angle),
    thumbCurl: L(ta.curl, tb.curl),
    thumbHigh: !!tb.high && t > 0.5,
    spread: L(a.spread ?? 0.35, b.spread ?? 0.35),
    lean: al.map((v, i) => L(v, bl[i])),
    wristTilt: L(a.wristTilt ?? 0, b.wristTilt ?? 0),
    cuff: b.cuff || a.cuff,
  };
}
