# How to teach GANGSIGN.GG a new sign

Every sign is just data. Two files, one test run.

## 1. Add the sign to `js/signs.js`

Append to `SIGNS`:

```js
{
  id: 'mysign',                    // unique kebab-case id
  name: 'The Thing',               // display name
  emoji: '🫰',
  gang: 'Finger Guns United',      // FAKE gang name — the sillier the better
  stars: 2,                        // difficulty 1-3
  sus: 'unhinged',                 // "sus level" joke
  lore: 'One or two sentences of fake history.',
  final: { fingers: [0, 0, 1, 1], thumb: 0.5, thumbOut: 0.6, spread: 0.3 },
  //                 ^ index, middle, ring, pinky curl 0(straight)..1(folded)
  steps: [                         // 2-4 steps: [t, caption]; t = how far open→final
    [0,   'Start from the open palm…'],
    [0.5, 'Fold the ring and pinky…'],
    [1,   'Thumb out. That is The Thing.'],
  ],
  match: (f) => f.up.index && f.up.middle && !f.up.ring && !f.up.pinky,
  //       ^ recognition rule over the feature vector — see below
  checks: (f) => [
    ['Index up', f.up.index],
    ['Ring + pinky down', !f.up.ring && !f.up.pinky],
  ],
  // ^ live checklist shown while training; keep it == match conditions
},
```

## 2. Add a camera-free spec to `DEMO` (same file)

```js
mysign: { index: 'up', middle: 'up', ring: 'fold', pinky: 'fold', thumb: 'out' },
```

Options per finger: `'up' | 'fold' | 'half'`; thumb: `'out' | 'fold' | 'half' | 'up' | 'down'`;
plus `spreadIM/spreadMR/spreadRP` (tip gaps), `pinchDist` (thumb-index tip distance),
`cross` (swap index/middle tips).

## 3. Prove it: `npm test`

The suite demands that:

- your spec detects as **your sign and nothing else** (`detectSign` walks `ORDER`
  top-down — if an earlier sign steals it, either sharpen `match` or move your id
  earlier in `ORDER`),
- detection survives small landmark jitter,
- your own `checks` all pass on your demo spec.

## 4. Feature cheat sheet (`js/features.js`)

| Field | Meaning |
| --- | --- |
| `up.index` … `up.pinky` | finger straight + tip beyond the PIP |
| `folded.*` | PIP folded past 110° |
| `halfCurl.*` | curved 115–168° (Pinch zone) |
| `thumb` | thumb extended (angle + distance from palm) |
| `thumbUp` | thumb tip clearly above the knuckle line |
| `thumbDown` | thumb tip clearly below the MCP line (inverted right-hand rule) |
| `pinch` | thumb-tip ↔ index-tip distance / palm size |
| `cluster` | max pairwise distance across all 5 tips |
| `spreadIM/MR/RP` | sideways tip gaps |
| `tipsX`, `pipsX`, `swapX` | crossing geometry along the palm-perpendicular axis |

Tuning tips: thresholds were fitted against the synthetic rig (and will want a real-hand
pass eventually) — if a sign fights its neighbor in `ORDER`, the cheapest fix is usually
a more specific condition (pinch distance, spread, thumb state), not a global threshold
change.
