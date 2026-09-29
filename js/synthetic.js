// Builds a plausible 21-landmark hand from a compact spec. Used by the Node tests AND by
// the site's camera-free ?demo mode, so the whole classifier pipeline is verifiable
// without a webcam. Same coordinate frame MediaPipe gives: normalized, y down, raw.
//
// spec: {
//   index/middle/ring/pinky: 'up' | 'fold' | 'half'   (half = curled toward thumb)
//   thumb: 'out' | 'fold' | 'half' | 'up'
//   spreadIM/spreadMR/spreadRP: sideways tip gaps in SIZE units (palm length)
//   pinchDist: force thumb-tip<->index-tip gap (IMAGE units, ~0.05 = touching)
//   cross: swap index/middle tips (crossed fingers)
// }

const S = 0.265; // palm length (wrist -> middle MCP) in image units
const K = { index: 0.44, middle: 0.50, ring: 0.555, pinky: 0.61 }; // knuckle x
const KY = { index: 0.60, middle: 0.585, ring: 0.60, pinky: 0.63 };
const LEN = { index: 0.27, middle: 0.31, ring: 0.28, pinky: 0.21 };
const BASE_GAP = { IM: 0.226, MR: 0.208, RP: 0.208 }; // knuckle gaps in SIZE units

export function syntheticLandmarks(spec = {}) {
  const s = {
    index: 'up', middle: 'up', ring: 'up', pinky: 'up', thumb: 'out',
    spreadIM: 0.24, spreadMR: 0.22, spreadRP: 0.22,
    pinchDist: null, cross: false, ...spec,
  };
  const lm = new Array(21);
  lm[0] = { x: 0.5, y: 0.85, z: 0 }; // wrist
  // per-pair spread deltas (size units -> image units), shared between the pair's fingers
  const dIM = (s.spreadIM - BASE_GAP.IM) * S / 2;
  const dMR = (s.spreadMR - BASE_GAP.MR) * S / 2;
  const dRP = (s.spreadRP - BASE_GAP.RP) * S / 2;
  const sh = { index: -dIM, middle: dIM - dMR, ring: dMR - dRP, pinky: dRP };
  const F = { index: [5, 6, 7, 8], middle: [9, 10, 11, 12], ring: [13, 14, 15, 16], pinky: [17, 18, 19, 20] };
  for (const name of Object.keys(F)) {
    const [mcp, pip, dip, tip] = F[name];
    const kx = K[name], ky = KY[name], len = LEN[name], t = sh[name];
    lm[mcp] = { x: kx, y: ky, z: 0 };
    if (s[name] === 'up') {
      lm[pip] = { x: kx + t * 0.45, y: ky - len * 0.45, z: 0 };
      lm[dip] = { x: kx + t * 0.72, y: ky - len * 0.72, z: 0 };
      lm[tip] = { x: kx + t, y: ky - len, z: 0 };
    } else if (s[name] === 'fold') {
      lm[pip] = { x: kx, y: ky - 0.055, z: 0 };
      lm[dip] = { x: kx, y: ky + 0.01, z: 0 };
      lm[tip] = { x: kx, y: ky + 0.045, z: 0 };
    } else { // 'half': PIP stays tall, tip curls up+inward toward the pinch huddle
      lm[pip] = { x: kx + t * 0.4, y: ky - len * 0.45, z: 0 };
      const target = { index: [0.385, 0.37], middle: [0.405, 0.36], ring: [0.425, 0.38], pinky: [0.445, 0.40] }[name];
      lm[dip] = { x: lm[pip].x + (target[0] - lm[pip].x) * 0.55, y: lm[pip].y + (target[1] - lm[pip].y) * 0.55, z: 0 };
      lm[tip] = { x: target[0], y: target[1], z: 0 };
    }
  }
  if (s.cross) { // index/middle tips trade places
    lm[8] = { x: K.middle + 0.02, y: lm[8].y, z: 0 };
    lm[12] = { x: K.index - 0.02, y: lm[12].y, z: 0 };
  }
  if (s.thumb === 'up') {
    lm[1] = { x: 0.44, y: 0.62, z: 0 }; lm[2] = { x: 0.43, y: 0.50, z: 0 };
    lm[3] = { x: 0.425, y: 0.40, z: 0 }; lm[4] = { x: 0.42, y: 0.32, z: 0 };
  } else if (s.thumb === 'fold') {
    lm[1] = { x: 0.43, y: 0.70, z: 0 }; lm[2] = { x: 0.44, y: 0.645, z: 0 };
    lm[3] = { x: 0.475, y: 0.635, z: 0 }; lm[4] = { x: 0.50, y: 0.63, z: 0 };
  } else if (s.thumb === 'half') {
    lm[1] = { x: 0.43, y: 0.70, z: 0 }; lm[2] = { x: 0.41, y: 0.64, z: 0 };
    lm[3] = { x: 0.40, y: 0.585, z: 0 }; lm[4] = { x: 0.41, y: 0.54, z: 0 };
  } else { // 'out': splayed away from the palm
    lm[1] = { x: 0.43, y: 0.70, z: 0 }; lm[2] = { x: 0.395, y: 0.655, z: 0 };
    lm[3] = { x: 0.365, y: 0.615, z: 0 }; lm[4] = { x: 0.335, y: 0.575, z: 0 };
  }
  if (s.pinchDist != null) {
    lm[4] = { x: lm[8].x - s.pinchDist, y: lm[8].y, z: 0 };
    lm[7] = { x: (lm[6].x + lm[4].x) / 2, y: (lm[6].y + lm[4].y) / 2, z: 0 };
  }
  return lm;
}
