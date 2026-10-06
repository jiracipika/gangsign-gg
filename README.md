# GANGSIGN.GG 🤘

**Get street certified.** A webcam-judged hand-sign academy — the comedy cousin of
[HandStrument](https://handstrument-two.vercel.app). Point your camera at your hand,
pick a sign, follow the steps, and hold the shape until the tracker certifies you.

**100% satire.** The signs are universally known *gestures* (peace, rock horns, shaka,
OK circle, Vulcan salute, the Italian pinch, crossed fingers, ASL "I love you"…) wearing
fake-gang costumes. Zero real gangs were consulted. The ILY sign is real American Sign
Language and gets real respect.

## Run it

```bash
npm start        # serves on http://localhost:8369 (camera needs localhost/HTTPS)
npm test         # classifier + real-data suites (node --test)

## Dataset grounding (2026-10-05)

The sign thresholds are no longer eyeballed. 1,080 real MediaPipe landmark
samples (60 per class) were extracted from the HaGRID gesture dataset
(https://github.com/hukenovs/hagrid — fist, palm, peace, rock, ok, like,
dislike, call, two_up, ...) with the same hand_landmarker model the site runs,
and every matcher was re-fit against the real distributions:

- two_up -> westside was 0/60 on real W hands (the old spreadIM > 0.34 gate
  rejects how Ws are actually held — fingers TOGETHER, 0.23±0.11 palm units);
  now gated on thumb reach + together-ness + no tip-cross, 78% recall.
- real fists kept failing the old Y-based thumbUp proxy; the gate is now the
  orientation-free thumbOut reach, and the cluster limit was raised to the
  real max-tip-span of fists (1.3, was 0.8).
- crossed fingers: swapX now bounded (0.15-0.6) plus a touching-knuckles gate
  (pipsX < 0.3), so spread peace Vs (pipsX >= 0.33 on real hands) stop
  misreading as crossed.
- spock's middle/ring gap raised to 0.58 (real open palms reach 0.55).
- ok needs two-of-three fan fingers up (real tilted oks rarely register all
  three).

Measured with the exact shipping classifier over the 720 scored samples:
**94.3%** top-1 (was 70.6% pre-rework). tests/fixtures/hagrid-real.json keeps
8 real samples per class (seeded shuffle) and tests/real-data.test.js pins
per-class floors + an 85% overall floor so regressions fail CI.
```

Open http://localhost:8369 → **Enable camera** → click any catalog card to train it.
No camera? Hit **Run camera-free demo** (or open `/?demo`) — synthetic hands cycle
through the real recognition pipeline.

## How it works

- **Tracking**: MediaPipe Hand Landmarker (tasks-vision, 21 landmarks, runs locally in
  your browser — no video ever leaves the device). WASM + model pinned to the same
  version; GPU delegate with automatic CPU fallback if WebGL dies mid-session.
- **Classifier**: pure geometry in `js/features.js` (per-finger PIP angles, tip reach,
  pinch distances, tip clustering, a perpendicular-axis crossing test) matched against
  per-sign rules in `js/signs.js`. Order matters: quirky shapes before generic ones.
- **Teaching**: each sign has step captions + step art drawn by `js/hand-svg.js`, a tiny
  forward-kinematics cartoon hand that interpolates open → final shape.
- **Credentials**: hold the final shape ~1.3s → confetti + CERTIFIED stamp, persisted in
  localStorage.

## Teach it a new sign

See [docs/ADD-A-SIGN.md](docs/ADD-A-SIGN.md). Short version: add one object to `SIGNS`
in `js/signs.js` (finger states + steps + lore) and one spec to `DEMO`, then
`npm test` — the suite proves the new sign is detectable and doesn't collide with
the existing lineup.
