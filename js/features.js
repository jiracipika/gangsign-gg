// Pure geometry: MediaPipe hand landmarks -> feature vector used by the sign matchers.
// No DOM, no MediaPipe import here — this file runs in Node tests and in the browser.
// Landmark order (MediaPipe Hands): 0 wrist; 1-4 thumb (cmc, mcp, ip, tip);
// 5-8 index, 9-12 middle, 13-16 ring, 17-20 pinky (mcp, pip, dip, tip).
// Coordinates: normalized image space, y grows DOWNWARD. Raw (unmirrored) frames only.

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

function angleAt(a, b, c) {
  const v1x = a.x - b.x, v1y = a.y - b.y;
  const v2x = c.x - b.x, v2y = c.y - b.y;
  const den = Math.hypot(v1x, v1y) * Math.hypot(v2x, v2y) || 1e-9;
  return Math.acos(Math.max(-1, Math.min(1, (v1x * v2x + v1y * v2y) / den))) * 180 / Math.PI;
}

export function handFeatures(lm) {
  const size = Math.max(dist(lm[0], lm[9]), 1e-6); // palm length = normalizer
  const pipAngle = {
    index: angleAt(lm[5], lm[6], lm[8]),
    middle: angleAt(lm[9], lm[10], lm[12]),
    ring: angleAt(lm[13], lm[14], lm[16]),
    pinky: angleAt(lm[17], lm[18], lm[20]),
  };
  const reach = (t) => dist(lm[0], lm[t]) / size;
  // "up" = PIP nearly straight AND tip reaching beyond the PIP (kills hairpin folds)
  const up = {
    index: pipAngle.index > 146 && reach(8) > reach(6) * 1.08,
    middle: pipAngle.middle > 146 && reach(12) > reach(10) * 1.08,
    ring: pipAngle.ring > 146 && reach(16) > reach(14) * 1.08,
    pinky: pipAngle.pinky > 146 && reach(20) > reach(18) * 1.08,
  };
  // "halfCurl" = visibly curved but not folded into the palm (the Italian Pinch zone)
  const half = (a) => a > 115 && a <= 168;
  const halfCurl = {
    index: half(pipAngle.index),
    middle: half(pipAngle.middle),
    ring: half(pipAngle.ring),
    pinky: half(pipAngle.pinky),
  };
  const folded = {
    index: pipAngle.index < 110,
    middle: pipAngle.middle < 110,
    ring: pipAngle.ring < 110,
    pinky: pipAngle.pinky < 110,
  };
  const thumbAngle = angleAt(lm[2], lm[3], lm[4]);
  const thumb = thumbAngle > 140 && dist(lm[4], lm[17]) > dist(lm[3], lm[17]);
  // thumb "pointing up" = thumb tip clearly ABOVE the whole knuckle line (fists don't qualify)
  const knuckleTop = Math.min(lm[6].y, lm[10].y, lm[14].y, lm[18].y);
  const thumbUp = lm[4].y < knuckleTop - size * 0.15;

  const pinch = dist(lm[4], lm[8]) / size;   // thumb tip <-> index tip
  const pinchP = dist(lm[4], lm[12]) / size; // thumb tip <-> middle tip
  const spreadIM = dist(lm[8], lm[12]) / size;
  const spreadMR = dist(lm[12], lm[16]) / size;
  const spreadRP = dist(lm[16], lm[20]) / size;
  const tips = [lm[4], lm[8], lm[12], lm[16], lm[20]];
  let cluster = 0; // max pairwise tip distance incl. thumb: "are all fingertips bunched?"
  for (let i = 0; i < tips.length; i++)
    for (let j = i + 1; j < tips.length; j++)
      cluster = Math.max(cluster, dist(tips[i], tips[j]) / size);

  // Perpendicular (side-to-side) coordinate across the palm axis — mirror-safe magnitudes.
  const ax = lm[9].x - lm[0].x, ay = lm[9].y - lm[0].y;
  const alen = Math.hypot(ax, ay) || 1e-9;
  const px = (p) => (p.x - lm[0].x) * (-ay / alen) + (p.y - lm[0].y) * (ax / alen);
  const tipsX = Math.abs(px(lm[8]) - px(lm[12])) / size; // index<->middle tip gap (sideways)
  const pipsX = Math.abs(px(lm[6]) - px(lm[10])) / size; // same gap up at the PIPs
  const swapX = (px(lm[8]) - px(lm[12])) / size;         // >0 = index tip landed right of middle tip = crossed

  return {
    size, pipAngle, up, halfCurl, folded, thumb, thumbUp,
    pinch, pinchP, spreadIM, spreadMR, spreadRP, cluster,
    tipsX, pipsX, swapX,
  };
}
