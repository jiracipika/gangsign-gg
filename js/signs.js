// The Catalog: 13 certified hand shapes. Each entry carries:
//   final    — hand-svg config for the finished sign
//   steps    — [t, caption] pairs; t interpolates open-hand -> final for the step art
//   match(f) — boolean over the feature vector (scan mode, priority = array order)
//   checks(f)— [[label, pass]] live checklist (practice mode)
// Real-gesture, fake-gang. The ILY sign is genuine ASL and gets genuine respect.

export const HOLD_FRAMES = 40; // ~1.3s of steady shape at 30fps to earn certification

export const SIGNS = [
  {
    id: 'fazeup', name: 'FAZE UP', emoji: '🧲', gang: 'FaZe Up Worldwide — Charter Chapter',
    stars: 3, sus: 'scientifical',
    lore: 'The physics right-hand rule, inverted: index up, middle cocked out perpendicular, thumb DOWN. Points the direction of the magnetic field and the direction of the takeover. Physics teachers see it and feel a disturbance they cannot name.',
    final: { fingers: [0, 0.55, 1, 1], thumb: 0.2, thumbOut: 0.7, thumbDown: true, spread: 0.45, lean: [0, 14, 0, 0] },
    steps: [
      [0, 'Open palm. Today you learn physics the street way.'],
      [0.35, 'Fold the ring and pinky down. Index stays tall — that is your Y axis.'],
      [0.65, 'Cock the middle finger out to the side. Perpendicular energy only.'],
      [1, 'Now the flip: thumb swings DOWN. Three axes, one crew. FAZE UP. 🧲'],
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
    final: { fingers: [0, 0, 0, 0], thumb: 0.1, thumbOut: 0.9, spread: 0.5 },
    steps: [
      [0, 'Start relaxed. Fingers loose, wrist chill, dreams big.'],
      [0.5, 'Stretch all five fingers wide, like hailing a very important taxi.'],
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
    final: { fingers: [1, 1, 1, 1], thumb: 0.95, thumbOut: 0.2, spread: 0.15 },
    steps: [
      [0, 'Begin from The Open Palm. Stay calm. Breathe.'],
      [0.45, 'Curl all four fingers down into the palm, one row at a time.'],
      [0.8, 'Wrap the thumb over the middle fingers. Tight knuckles, loose attitude.'],
      [1, 'That is The Foundation. All rivalries start and end here.'],
    ],
    match: (f) => !f.up.index && !f.up.middle && !f.up.ring && !f.up.pinky && !f.thumbUp && f.cluster < 0.8,
    checks: (f) => [
      ['Index folded', !f.up.index], ['Middle folded', !f.up.middle],
      ['Ring folded', !f.up.ring], ['Pinky folded', !f.up.pinky],
      ['Thumb wrapped, not up', !f.thumbUp],
    ],
  },
  {
    id: 'peace', name: 'The Deuce', emoji: '✌️', gang: 'Two Fingers United',
    stars: 1, sus: 'diplomatic immunity',
    lore: 'International sign for both "peace" and "two". Historically confusing at border crossings, beloved everywhere else.',
    final: { fingers: [0, 0, 1, 1], thumb: 0.8, thumbOut: 0.3, spread: 0.25 },
    steps: [
      [0, 'Open palm. Wrist loose, elbow doing absolutely nothing.'],
      [0.4, 'Fold the ring and pinky down; the thumb pins them in place.'],
      [0.75, 'Index and middle stay up, side by side like best friends.'],
      [1, 'Slightly tilt forward. Congratulations, it is 1968 and you are hip.'],
    ],
    match: (f) => f.up.index && f.up.middle && !f.up.ring && !f.up.pinky && f.spreadIM < 0.45,
    checks: (f) => [
      ['Index up', f.up.index], ['Middle up', f.up.middle],
      ['Ring + pinky down', !f.up.ring && !f.up.pinky],
      ['Fingers together', f.spreadIM < 0.45],
    ],
  },
  {
    id: 'rock', name: 'The Horns', emoji: '🤘', gang: 'Metal Militia of Maple Drive',
    stars: 2, sus: 'loud',
    lore: 'Wards off bad vibes, quiet parties, and mondays. Dio approved (look it up, kiddos).',
    final: { fingers: [0, 1, 1, 0], thumb: 0.3, thumbOut: 0.6, spread: 0.55 },
    steps: [
      [0, 'Open palm. Feel the power already? That is just warm-up.'],
      [0.4, 'Fold the middle and ring fingers down into the palm.'],
      [0.7, 'Thumb clamps across them. Optional, but it looks professional.'],
      [1, 'Index and pinky stay UP and proud. You are metal now. 🤘'],
    ],
    match: (f) => f.up.index && f.up.pinky && !f.up.middle && !f.up.ring,
    checks: (f) => [
      ['Index up', f.up.index], ['Pinky up', f.up.pinky],
      ['Middle + ring folded', !f.up.middle && !f.up.ring],
    ],
  },
  {
    id: 'shaka', name: 'The Shaka', emoji: '🤙', gang: 'Hang Loose Housing Assn.',
    stars: 2, sus: 'unbotherable',
    lore: 'Phone? No. Vibes? Yes. Origin: Hawaiian surf culture, destination: your group chat.',
    final: { fingers: [1, 1, 1, 0], thumb: 0.1, thumbOut: 1, spread: 0.3 },
    steps: [
      [0, 'Open palm, fingers relaxed. Channel mild beach energy.'],
      [0.4, 'Fold the index, middle, and ring fingers down.'],
      [0.75, 'Thumb swings out wide. Pinky stays tall.'],
      [1, 'Give it a little twist. Shaka. Everything is fine now. 🤙'],
    ],
    match: (f) => f.up.pinky && f.thumb && !f.up.index && !f.up.middle && !f.up.ring,
    checks: (f) => [
      ['Pinky up', f.up.pinky], ['Thumb out', f.thumb],
      ['Middle three folded', !f.up.index && !f.up.middle && !f.up.ring],
    ],
  },
  {
    id: 'thumbsup', name: 'The Permit', emoji: '👍', gang: 'Approval Committee',
    stars: 1, sus: 'you may pass',
    lore: 'The oldest sign in the book: thumbs up means "you are good". Caveat: Roman audiences may interpret this differently.',
    final: { fingers: [1, 1, 1, 1], thumb: 0, thumbOut: 1, thumbUp: true, spread: 0.15 },
    steps: [
      [0, 'Make The Foundation. Solid fist. Good.'],
      [0.6, 'Keep everything folded. Do not release the fist.'],
      [1, 'Fire the thumb straight up like a tiny flag of approval. 👍'],
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
    lore: 'Thumb + index make a perfect circle. If someone looks at it while it sits below your waist, you are allowed one (1) friendly bop. That is ancient internet law.',
    final: { fingers: [0.55, 0, 0, 0], thumb: 0.6, thumbOut: 0.35, spread: 0.35 },
    steps: [
      [0, 'Open palm. Three fingers will remain loyal throughout.'],
      [0.4, 'Curve the index finger down until its tip nearly meets the thumb tip.'],
      [0.75, 'Close the loop: thumb tip and index tip touching, forming a circle.'],
      [1, 'Middle, ring, and pinky stand tall. The Circle is complete. 👌'],
    ],
    match: (f) => f.pinch < 0.38 && !f.up.index && f.up.middle && f.up.ring && f.up.pinky,
    checks: (f) => [
      ['Thumb + index close the circle', f.pinch < 0.38],
      ['Middle up', f.up.middle], ['Ring up', f.up.ring], ['Pinky up', f.up.pinky],
    ],
  },
  {
    id: 'pinch', name: 'The Pinch', emoji: '🤌', gang: 'Mamma Mia Mafia',
    stars: 3, sus: 'passionate',
    lore: 'Five fingertips. One question: "What do you WANT from me?" The most expressive unit of communication ever invented, per nonna.',
    final: { fingers: [0.55, 0.6, 0.65, 0.7], thumb: 0.55, thumbOut: 0.45, spread: 0.12 },
    steps: [
      [0, 'Open palm. Prepare for maximum expression.'],
      [0.35, 'Relax the fingers — curved, not folded. Like holding an invisible egg.'],
      [0.7, 'Bring every fingertip together into a tight bunch, pointing up.'],
      [1, 'Thumb joins the huddle. Hold it near your chin and speak with your whole soul. 🤌'],
    ],
    match: (f) => f.cluster < 0.55 && f.halfCurl.index && f.halfCurl.middle && f.halfCurl.ring,
    checks: (f) => [
      ['Fingertips bunched together', f.cluster < 0.55],
      ['Index curved, not folded', f.halfCurl.index],
      ['Middle curved, not folded', f.halfCurl.middle],
      ['Ring curved, not folded', f.halfCurl.ring],
    ],
  },
  {
    id: 'spock', name: 'The Vulcan', emoji: '🖖', gang: 'Prosperity Gospel Trekkies',
    stars: 3, sus: 'logical',
    lore: 'Live long and prosper. Requires dividing the middle and ring fingers — physically easy, socially dangerous at parties.',
    final: { fingers: [0, 0, 0, 0], thumb: 0.1, thumbOut: 1, spread: 1 },
    steps: [
      [0, 'Open palm, fingers together. This is the calm before the split.'],
      [0.5, 'Split index + middle to one side, ring + pinky to the other.'],
      [0.8, 'Widen the gap between the middle and ring fingers. Wider. WIDER.'],
      [1, 'Thumb out. Live long and prosper. 🖖'],
    ],
    match: (f) => f.up.index && f.up.middle && f.up.ring && f.up.pinky && f.thumb && f.spreadMR > 0.42,
    checks: (f) => [
      ['All four up', f.up.index && f.up.middle && f.up.ring && f.up.pinky],
      ['Big middle/ring gap', f.spreadMR > 0.42],
      ['Thumb out', f.thumb],
    ],
  },
  {
    id: 'westside', name: 'The Dub', emoji: '🫱', gang: 'West (End of the) Side',
    stars: 2, sus: 'photo-ready',
    lore: 'Thumb + index + middle spread into a big W, for "We outside." Mandatory in 100% of group photos since forever.',
    final: { fingers: [0, 0, 1, 1], thumb: 0.1, thumbOut: 1, spread: 0.8, lean: [-14, 12, 0, 0] },
    steps: [
      [0, 'Open palm. Ring and pinky are about to retire for the day.'],
      [0.4, 'Fold ring + pinky down, thumb clamps them.'],
      [0.7, 'Thumb swings back out wide.'],
      [1, 'Index and middle spread into a big W. Photo time. W.'],
    ],
    match: (f) => f.thumb && f.up.index && f.up.middle && !f.up.ring && !f.up.pinky && f.spreadIM > 0.34,
    checks: (f) => [
      ['Thumb out', f.thumb], ['Index up', f.up.index], ['Middle up', f.up.middle],
      ['Index & middle spread into a W', f.spreadIM > 0.34],
      ['Ring + pinky down', !f.up.ring && !f.up.pinky],
    ],
  },
  {
    id: 'ily', name: 'The ILY', emoji: '🤟', gang: 'Certified Lovers Local 12',
    stars: 2, sus: 'wholesome',
    lore: 'Thumb, index, and pinky: this one is REAL — it is "I love you" in American Sign Language. Not satire. Learn actual ASL; it is a superpower.',
    final: { fingers: [0, 1, 1, 0], thumb: 0.1, thumbOut: 1, spread: 0.6 },
    steps: [
      [0, 'Open palm. This one means something, so do it with care.'],
      [0.4, 'Fold the middle and ring fingers down.'],
      [0.75, 'Thumb swings out and stays there.'],
      [1, 'Index and pinky up. That is "I love you" in ASL. Mean it. 🤟'],
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
    final: { fingers: [0, 0, 1, 1], thumb: 0.8, thumbOut: 0.3, spread: 0.05, lean: [16, -16, 0, 0] },
    steps: [
      [0, 'Start from The Deuce — index and middle up, rest folded.'],
      [0.5, 'Bring the two fingers together until they touch.'],
      [0.8, 'Now swap their positions: index leans over the middle.'],
      [1, 'Tips crossed. You are now technically incapable of lying. 🤞'],
    ],
    match: (f) => f.up.index && f.up.middle && !f.up.ring && !f.up.pinky && f.swapX > 0.04 && f.pipsX > 0.2,
    checks: (f) => [
      ['Index up', f.up.index], ['Middle up', f.up.middle],
      ['Tips crossed (index over middle)', f.swapX > 0.04],
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
  peace: { index: 'up', middle: 'up', ring: 'fold', pinky: 'fold', thumb: 'fold', spreadIM: 0.18 },
  rock: { index: 'up', middle: 'fold', ring: 'fold', pinky: 'up', thumb: 'fold' },
  shaka: { index: 'fold', middle: 'fold', ring: 'fold', pinky: 'up', thumb: 'out' },
  thumbsup: { index: 'fold', middle: 'fold', ring: 'fold', pinky: 'fold', thumb: 'up' },
  ok: { index: 'fold', middle: 'up', ring: 'up', pinky: 'up', thumb: 'out', pinchDist: 0.05 },
  pinch: { index: 'half', middle: 'half', ring: 'half', pinky: 'half', thumb: 'out', pinchDist: 0.03 },
  spock: { index: 'up', middle: 'up', ring: 'up', pinky: 'up', thumb: 'out', spreadMR: 0.62, spreadIM: 0.3 },
  westside: { index: 'up', middle: 'up', ring: 'fold', pinky: 'fold', thumb: 'out', spreadIM: 0.5 },
  ily: { index: 'up', middle: 'fold', ring: 'fold', pinky: 'up', thumb: 'out' },
  crossed: { index: 'up', middle: 'up', ring: 'fold', pinky: 'fold', thumb: 'fold', cross: true },
};
