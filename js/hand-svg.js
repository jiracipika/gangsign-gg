// Cartoon hand renderer: config -> SVG string. Pure (no DOM) so tests can smoke it.
// Config: {
//   fingers: [index, middle, ring, pinky] curl 0..1
//   thumb: curl 0..1, thumbOut: 0 tucked .. 1 splayed, thumbUp: thumbs-up pose
//   spread: 0..1 splay, lean: per-finger extra degrees, cuff: gang color, label: caption
// }

export function handSVG(cfg = {}) {
  const c = {
    fingers: [0, 0, 0, 0], thumb: 0.15, thumbOut: 0.8, thumbUp: false,
    spread: 0.35, lean: [0, 0, 0, 0], cuff: '#e11d48', label: null, ...cfg,
  };
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

  // four fingers (drawn first, palm overlaps their bases)
  const K = [[88, 138], [116, 130], [142, 134], [166, 146]];
  const LEN = [[46, 26, 17], [54, 29, 19], [48, 26, 17], [36, 21, 14]];
  const BASE = [-9, -2, 5, 14];
  for (let i = 0; i < 4; i++) {
    const a0 = -90 + BASE[i] + (c.spread - 0.35) * 30 * ((i - 1.5) / 1.5) + c.lean[i];
    const bend = [c.fingers[i] * 70, c.fingers[i] * 85, c.fingers[i] * 60];
    seg(chain(K[i][0], K[i][1], a0, LEN[i], bend), [16, 13.5, 11.5]);
  }

  // palm
  out.push(`<path d="M86 128 Q86 118 98 117 L158 121 Q172 122 172 136 L174 184 Q174 208 150 210 L108 210 Q86 208 86 188 Z" fill="${SKIN}" stroke="${LINE}" stroke-width="4"/>`);

  // thumb (in front of the palm)
  if (c.thumbUp) {
    seg(chain(94, 152, -98, [40, 27, 20], [6, 2, 0]), [18, 15.5, 13]);
  } else {
    const a0 = -90 - (15 + 45 * c.thumbOut);
    seg(chain(86, 178, a0, [40, 27, 20], [12 + c.thumb * 30, c.thumb * 80, c.thumb * 55]), [18, 15.5, 13]);
  }

  // cuff
  out.push(`<rect x="106" y="206" width="56" height="32" rx="9" fill="${c.cuff}" stroke="${LINE}" stroke-width="4"/>`);

  const label = c.label
    ? `<text x="120" y="266" text-anchor="middle" font-size="15" font-weight="700" fill="#9a97ad" font-family="inherit">${c.label}</text>`
    : '';
  return `<svg class="handsvg" viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" role="img">${out.join('')}${label}</svg>`;
}

export function lerpCfg(a, b, t) {
  const L = (x, y) => x + (y - x) * t;
  const bl = b.lean || [0, 0, 0, 0], al = a.lean || [0, 0, 0, 0];
  return {
    fingers: a.fingers.map((v, i) => L(v, b.fingers[i])),
    thumb: L(a.thumb ?? 0.15, b.thumb ?? 0.15),
    thumbOut: L(a.thumbOut ?? 0.8, b.thumbOut ?? 0.8),
    spread: L(a.spread ?? 0.35, b.spread ?? 0.35),
    thumbUp: !!b.thumbUp && t > 0.5,
    lean: al.map((v, i) => L(v, bl[i])),
    cuff: b.cuff || a.cuff,
  };
}
