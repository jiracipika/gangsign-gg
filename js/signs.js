// The Catalog: 13 certified hand shapes. Each entry carries:
//   final    — hand-svg config for the finished sign
//   steps    — [t, caption] pairs; t interpolates open-hand -> final for the step art
//   match(f) — boolean over the feature vector (scan mode, priority = array order)
//   checks(f)— [[label, pass]] live checklist (practice mode)
// Real-gesture, fake-gang. The ILY sign is genuine ASL and gets genuine respect.
// Art anatomy researched 2026-09-29 (see git history): thumb strap on clamped signs,
// V-spread peace, fused Vulcan pairs, shaka thumb/pinky collinear, pinch apex point.

export const HOLD_FRAMES = 40; // ~1.3s of steady shape at 30fps to earn certification

export const SIGNS = [
  {
    id: 'fazeup', name: 'FAZE UP', emoji: '🧲', gang: 'FaZe Up Worldwide — Charter Chapter',
    stars: 3, sus: 'scientifical',
    lore: 'The physics right-hand rule, inverted: index at 12 o\'clock, middle finger the horizontal crossbar at 9, thumb DOWN at 6. Points the direction of the magnetic field and the direction of the takeover.',
    final: { fingers: [0, -0.4, 1, 1], thumbAngle: 176, thumbCurl: 0.08, spread: 0, lean: [0, -30, 0, 0] },
    steps: [
      [0, 'Open palm. Today you learn physics the street way.'],
      [0.35, 'Fold the ring and pinky down. Index stays dead vertical — that is your 12 o\'clock.'],
      [0.65, 'Bend the middle finger out flat to the side. The horizontal crossbar.'],
      [1, 'Now the flip: thumb points at the FLOOR. Index sky, middle bar, thumb ground. FAZE UP. 🧲'],
    ],
    match: (f) => f.up.index && f.thumbDown && f.thumb && !f.up.ring && !f.up.pinky,
    checks: (f) => [
      ['Index up (the Y axis)', f.up.index],
      ['Ring + pinky folded', !f.up.ring && !f.up.pinky],
      ['Thumb extends', f.thumb],
      ['Thumb points DOWN (the flip)', f.thumbDown],
    ],
  },
  {
    id: 'open', name: 'The Open Palm', emoji: '✋', gang: 'Honest Citizens Local 1',
    stars: 1, sus: 'suspiciously polite',
    lore: 'The universal sign for "I have nothing in my hands." Zero street cred, zero jail time. Every legend starts here.',
    final: { fingers: [0, 0, 0, 0], thumbAngle: 50, thumbCurl: 0.05, spread: 0.35 },
    steps: [
      [0, 'Start relaxed. Fingers loose, wrist chill, dreams big.'],
      [0.5, 'All five fingers up: fingers together with hairline gaps, thumb splayed clear of the palm.'],
      [1, 'Hold it steady. Congratulations — you are officially unarmed.'],
    ],
    match: (f) => f.up.index && f.up.middle && f.up.ring && f.up.pinky,
    checks: (f) => [
      ['Index up', f.up.index], ['Middle up', f.up.middle],
      ['Ring up', f.up.ring], ['Pinky up', f.up.pinky],
    ],
  },
  {
    id: 'fist', name: 'The Foundation', emoji: '✊', gang: 'Everyone, eventually',
    stars: 1, sus: 'unprovoked',
    lore: 'Every sign is just a fist that made a decision. Master the baseline and the rest is finger diplomacy.',
    final: { fingers: [1, 1, 1, 1], thumbAngle: -65, thumbCurl: 0.45, spread: 0.1 },
    steps: [
      [0, 'Begin from The Open Palm. Stay calm. Breathe.'],
      [0.45, 'Curl all four fingers down into the palm, one row at a time.'],
      [0.8, 'Wrap the thumb diagonally ACROSS the folded fingers, tip tucked toward the pinky side.'],
      [1, 'That is The Foundation. All rivalries start and end here.'],
    ],
    match: (f) => !f.up.index && !f.up.middle && !f.up.ring && !f.up.pinky && f.thumbOut < 0.62 && f.cluster < 1.3,
    checks: (f) => [
      ['Index folded', !f.up.index], ['Middle folded', !f.up.middle],
      ['Ring folded', !f.up.ring], ['Pinky folded', !f.up.pinky],
      ['Thumb clamped close to the fist', f.thumbOut < 0.62],
    ],
  },
  {
    id: 'peace', name: 'The Deuce', emoji: '✌️', gang: 'Two Fingers United',
    stars: 1, sus: 'diplomatic immunity',
    lore: 'Two fingers raised and PARTED — the V is the whole gesture. Historically confusing at border crossings, beloved everywhere else.',
    final: { fingers: [0, 0, 1, 1], thumbAngle: -70, thumbCurl: 0.5, spread: 0.05, lean: [-15, 15, 0, 0] },
    steps: [
      [0, 'Open palm. Wrist loose, elbow doing absolutely nothing.'],
      [0.4, 'Fold the ring and pinky down; the thumb clamps across them.'],
      [0.75, 'Index and middle rise and PART into a clean V — the spread is the sign.'],
      [1, 'Slightly tilt forward. Congratulations, it is 1968 and you are hip.'],
    ],
    match: (f) => f.up.index && f.up.middle && !f.up.ring && !f.up.pinky && f.spreadIM > 0.35,
    checks: (f) => [
      ['Index up', f.up.index], ['Middle up', f.up.middle],
      ['Ring + pinky down', !f.up.ring && !f.up.pinky],
      ['Parted into a V', f.spreadIM > 0.35],
    ],
  },
  {
    id: 'rock', name: 'The Horns', emoji: '🤘', gang: 'Metal Militia of Maple Drive',
    stars: 2, sus: 'loud',
    lore: 'Wards off bad vibes, quiet parties, and mondays. Dio approved (look it up, kiddos).',
    final: { fingers: [0, 1, 1, 0], thumbAngle: -75, thumbCurl: 0.3, spread: 0.4, lean: [-6, 0, 0, 16] },
    steps: [
      [0, 'Open palm. Feel the power already? That is just warm-up.'],
      [0.4, 'Fold the middle and ring fingers down into the palm.'],
      [0.7, 'Thumb clamps ACROSS the folded pair like a strap — that strap is what makes it metal.'],
      [1, 'Index near vertical, pinky kicked out wide. The horns DIVERGE. 🤘'],
    ],
    match: (f) => f.up.index && f.up.pinky && !f.up.middle && !f.up.ring,
    checks: (f) => [
      ['Index up', f.up.index], ['Pinky up, kicked out', f.up.pinky],
      ['Middle + ring folded', !f.up.middle && !f.up.ring],
    ],
  },
  {
    id: 'shaka', name: 'The Shaka', emoji: '🤙', gang: 'Hang Loose Housing Assn.',
    stars: 2, sus: 'unbotherable',
    lore: 'Phone? No. Vibes? Yes. Origin: Hawaiian surf culture, destination: your group chat.',
    final: { fingers: [1, 1, 1, 0], thumbAngle: 68, thumbCurl: 0.05, spread: 0.12, lean: [0, 0, 0, 30] },
    steps: [
      [0, 'Open palm, fingers relaxed. Channel mild beach energy.'],
      [0.4, 'Fold the index, middle, and ring into a soft, loose fist.'],
      [0.75, 'Thumb swings out wide on one side, pinky kicks out the other — nearly one straight line.'],
      [1, 'Give it a little twist. Shaka. Everything is fine now. 🤙'],
    ],
    match: (f) => f.up.pinky && f.thumb && !f.up.index && !f.up.middle && !f.up.ring,
    checks: (f) => [
      ['Pinky up', f.up.pinky], ['Thumb out, free of the fist', f.thumb],
      ['Middle three folded', !f.up.index && !f.up.middle && !f.up.ring],
    ],
  },
  {
    id: 'thumbsup', name: 'The Permit', emoji: '👍', gang: 'Approval Committee',
    stars: 1, sus: 'you may pass',
    lore: 'The oldest sign in the book: thumbs up means "you are good". Caveat: Roman audiences may interpret this differently.',
    final: { fingers: [1, 1, 1, 1], thumbAngle: 2, thumbCurl: 0, thumbHigh: true, spread: 0.1 },
    steps: [
      [0, 'Make The Foundation. Solid fist. Good.'],
      [0.6, 'Keep everything folded. Do not release the fist.'],
      [1, 'Fire the thumb straight up from the fist\'s top corner, parallel to the forearm. 👍'],
    ],
    match: (f) => f.thumbUp && f.thumb && !f.up.index && !f.up.middle && !f.up.ring && !f.up.pinky,
    checks: (f) => [
      ['All four fingers folded', !f.up.index && !f.up.middle && !f.up.ring && !f.up.pinky],
      ['Thumb extends', f.thumb],
      ['Thumb points UP', f.thumbUp],
    ],
  },
  {
    id: 'ok', name: 'The Circle', emoji: '👌', gang: 'Circle Game Syndicate',
    stars: 2, sus: 'legally binding below the waist',
    lore: 'Thumb + index close a perfect ring with daylight through the middle. If someone looks at it while it sits below your waist, you are allowed one (1) friendly bop. Ancient internet law.',
    final: { fingers: [0.9, 0, 0, 0], thumbAngle: -55, thumbCurl: 0.62, spread: 0.3, lean: [0, 6, 12, 18] },
    steps: [
      [0, 'Open palm. Three fingers will remain loyal throughout.'],
      [0.4, 'Curl the index down at BOTH joints — it forms the top of the ring.'],
      [0.75, 'Bring the thumb around to meet it: tips touch, the circle CLOSES. Daylight in the hole.'],
      [1, 'Middle, ring, and pinky fan up and away. The Circle is complete. 👌'],
    ],
    match: (f) => f.pinch < 0.38 && !f.up.index && f.up.middle + f.up.ring + f.up.pinky >= 2,
    checks: (f) => [
      ['Thumb + index close the circle', f.pinch < 0.38],
      ['Index in the ring, not up', !f.up.index],
      ['Two of middle/ring/pinky fan up', f.up.middle + f.up.ring + f.up.pinky >= 2],
    ],
  },
  {
    id: 'pinch', name: 'The Pinch', emoji: '🤌', gang: 'Mamma Mia Mafia',
    stars: 3, sus: 'passionate',
    lore: 'Five fingertips. One apex. One question: "What do you WANT from me?" The most expressive unit of communication ever invented, per nonna.',
    final: { fingers: [0.32, 0.36, 0.4, 0.46], thumbAngle: -48, thumbCurl: 0.42, spread: 0.02, lean: [10, 3, -3, -10], wristTilt: -12 },
    steps: [
      [0, 'Open palm. Prepare for maximum expression.'],
      [0.35, 'Keep the fingers nearly straight and pressed together — shafts touching, no daylight.'],
      [0.7, 'Curl them just enough that all four tips converge to ONE apex point.'],
      [1, 'Thumb crosses in front and joins the apex. Tilt the wrist back. Speak with your whole soul. 🤌'],
    ],
    match: (f) => f.cluster < 0.55 && f.halfCurl.index && f.halfCurl.middle && f.halfCurl.ring,
    checks: (f) => [
      ['Fingertips bunched to one apex', f.cluster < 0.55],
      ['Index curved, not folded', f.halfCurl.index],
      ['Middle curved, not folded', f.halfCurl.middle],
      ['Ring curved, not folded', f.halfCurl.ring],
    ],
  },
  {
    id: 'spock', name: 'The Vulcan', emoji: '🖖', gang: 'Prosperity Gospel Trekkies',
    stars: 3, sus: 'logical',
    lore: 'Live long and prosper. The V sits between the MIDDLE and RING fingers — index+middle fused on one side, ring+pinky on the other. Physically easy, socially dangerous at parties.',
    final: { fingers: [0, 0, 0, 0], thumbAngle: 132, thumbCurl: 0.05, spread: 0.05, lean: [-9, -9, 9, 9] },
    steps: [
      [0, 'Open palm, fingers together. This is the calm before the split.'],
      [0.5, 'Weld index + middle into one pair, ring + pinky into the other.'],
      [0.8, 'Part the pairs. The gap is BETWEEN middle and ring — wider. WIDER.'],
      [1, 'Thumb droops loose, detached. Live long and prosper. 🖖'],
    ],
    match: (f) => f.up.index && f.up.middle && f.up.ring && f.up.pinky && f.thumb && f.spreadMR > 0.58,
    checks: (f) => [
      ['All four up', f.up.index && f.up.middle && f.up.ring && f.up.pinky],
      ['Big middle/ring gap', f.spreadMR > 0.58],
      ['Thumb out, detached', f.thumb],
    ],
  },
  {
    id: 'westside', name: 'The Dub', emoji: '🫱', gang: 'West (End of the) Side',
    stars: 2, sus: 'photo-ready',
    lore: 'Thumb + index + middle: three peaks, one W, for "We outside." Fingers side by side, thumb swung wide — the thumb gap is the widest gap. Mandatory in 100% of group photos since forever.',
    final: { fingers: [0, 0, 1, 1], thumbAngle: 55, thumbCurl: 0.08, spread: 0.1, lean: [-18, 14, 0, 0] },
    steps: [
      [0, 'Open palm. Ring and pinky are about to retire for the day.'],
      [0.4, 'Fold ring + pinky down, thumb stays free — no clamping on this one.'],
      [0.7, 'Thumb swings out low and wide, holding space from the index.'],
      [1, 'Three peaks: thumb, index, middle. That is a W. Photo time.'],
    ],
    match: (f) => f.thumbOut > 0.3 && f.up.index && f.up.middle && !f.up.ring && !f.up.pinky && f.spreadIM < 0.42 && f.swapX < 0.3,
    checks: (f) => [
      ['Thumb swung out of the pair', f.thumbOut > 0.3], ['Index up', f.up.index], ['Middle up', f.up.middle],
      ['Index & middle held together', f.spreadIM < 0.42],
      ['Ring + pinky down', !f.up.ring && !f.up.pinky],
    ],
  },
  {
    id: 'ily', name: 'The ILY', emoji: '🤟', gang: 'Certified Lovers Local 12',
    stars: 2, sus: 'wholesome',
    lore: 'Thumb, index, and pinky all extended at once: this one is REAL — it is "I love you" in American Sign Language. Not satire. Learn actual ASL; it is a superpower.',
    final: { fingers: [0, 1, 1, 0], thumbAngle: 72, thumbCurl: 0.05, spread: 0.15, lean: [0, 0, 0, 22] },
    steps: [
      [0, 'Open palm. This one means something, so do it with care.'],
      [0.4, 'Fold the middle and ring down — nothing covers them, no clamping.'],
      [0.75, 'Thumb extends out to the side, free and clear of the palm.'],
      [1, 'Index up, pinky out, thumb out. Three points. That is "I love you" in ASL. Mean it. 🤟'],
    ],
    match: (f) => f.thumb && f.up.index && f.up.pinky && !f.up.middle && !f.up.ring,
    checks: (f) => [
      ['Thumb out', f.thumb], ['Index up', f.up.index], ['Pinky up', f.up.pinky],
      ['Middle + ring down', !f.up.middle && !f.up.ring],
    ],
  },
  {
    id: 'crossed', name: 'The Alibi', emoji: '🤞', gang: 'Sneaky Beats Collective',
    stars: 3, sus: 'planning something',
    lore: 'Crossed fingers: the only way to lie with your hand and keep a clean conscience. (Fun fact: this is not how perjury works. Do not testify.)',
    final: { fingers: [0.15, 0.05, 1, 1], thumbAngle: -70, thumbCurl: 0.5, spread: 0.05, lean: [12, -12, 0, 0] },
    steps: [
      [0, 'Start from The Deuce — index and middle up, rest folded, thumb clamped.'],
      [0.5, 'Bring the two fingers together until the shafts touch.'],
      [0.8, 'Now cross them at the middle joints: index slides over, tips swap sides.'],
      [1, 'A narrow X with swapped tips. You are now technically incapable of lying. 🤞'],
    ],
    match: (f) => f.up.index && f.up.middle && !f.up.ring && !f.up.pinky && f.swapX > 0.15 && f.swapX < 0.6 && f.pipsX < 0.3,
    checks: (f) => [
      ['Index up', f.up.index], ['Middle up', f.up.middle],
      ['Tips crossed (index over middle)', f.swapX > 0.15],
      ['Fingers touching at the knuckles', f.pipsX < 0.3],
      ['Ring + pinky down', !f.up.ring && !f.up.pinky],
    ],
  },
];

// Scan-mode priority: quirky shapes first, generic ones last. fazeup leads on the strength
// of thumbDown (no other sign points a thumb at the floor). Every demo spec must
// resolve to its OWN sign in tests — ORDER changes will fail the suite if they break that.
export const ORDER = ['fazeup', 'pinch', 'ok', 'thumbsup', 'fist', 'spock', 'westside', 'ily', 'rock', 'shaka', 'crossed', 'peace', 'open'];

export function detectSign(f) {
  for (const id of ORDER) {
    const s = byId(id);
    try { if (s.match(f)) return id; } catch { /* a check blew up on a weird hand — try next */ }
  }
  return null;
}

const MAP = Object.fromEntries(SIGNS.map((s) => [s.id, s]));
export const byId = (id) => MAP[id];

// Camera-free specs: same data powers the Node tests and the ?demo mode.
export const DEMO = {
  fazeup: { index: 'up', middle: 'half', ring: 'fold', pinky: 'fold', thumb: 'down' },
  open: {},
  fist: { index: 'fold', middle: 'fold', ring: 'fold', pinky: 'fold', thumb: 'fold' },
  peace: { index: 'up', middle: 'up', ring: 'fold', pinky: 'fold', thumb: 'fold', spreadIM: 0.5 },
  rock: { index: 'up', middle: 'fold', ring: 'fold', pinky: 'up', thumb: 'fold' },
  shaka: { index: 'fold', middle: 'fold', ring: 'fold', pinky: 'up', thumb: 'out' },
  thumbsup: { index: 'fold', middle: 'fold', ring: 'fold', pinky: 'fold', thumb: 'up' },
  ok: { index: 'fold', middle: 'up', ring: 'up', pinky: 'up', thumb: 'out', pinchDist: 0.05 },
  pinch: { index: 'half', middle: 'half', ring: 'half', pinky: 'half', thumb: 'out', pinchDist: 0.03 },
  spock: { index: 'up', middle: 'up', ring: 'up', pinky: 'up', thumb: 'out', spreadMR: 0.62, spreadIM: 0.3 },
  westside: { index: 'up', middle: 'up', ring: 'fold', pinky: 'fold', thumb: 'out', spreadIM: 0.25 },
  ily: { index: 'up', middle: 'fold', ring: 'fold', pinky: 'up', thumb: 'out' },
  crossed: { index: 'up', middle: 'up', ring: 'fold', pinky: 'fold', thumb: 'fold', cross: true },
};
