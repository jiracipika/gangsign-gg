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
npm test         # 7-check classifier suite (node --test)
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
