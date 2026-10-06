// Real-hand regression floors, measured on actual HaGRID landmark samples.
//
// tests/fixtures/hagrid-real.json holds 8 real MediaPipe landmark samples per
// HaGRID class (extracted from the HaGRID classification dataset — see README
// "Dataset grounding"). Each class maps to the gang sign it SHOULD read as:
//
//   palm/stop/four -> open   fist -> fist       peace -> peace
//   ok -> ok                 like -> thumbsup   call -> shaka
//   two_up -> westside       rock -> rock
//
// dislike/mute have no catalog sign (null is correct for them). These floors
// pin the 2026-10-05 dataset-grounded threshold rework: the pre-rework
// classifier scored 70.6% on this data (westside was 0/60 on real W hands).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { handFeatures } from '../js/features.js';
import { detectSign } from '../js/signs.js';

const FIXTURES = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'hagrid-real.json'), 'utf8')
);

const EXPECT = {
  palm: 'open', stop: 'open', four: 'open',
  fist: 'fist',
  peace: 'peace',
  ok: 'ok',
  like: 'thumbsup',
  call: 'shaka',
  two_up: 'westside',
  rock: 'rock',
  dislike: null,
  mute: null,
};

// per-class floors (of 8 samples each) — measured 2026-10-05, small headroom
const FLOORS = {
  palm: 7, stop: 7, four: 7,
  fist: 6,
  peace: 7,
  ok: 7,
  like: 7,
  call: 7,
  two_up: 5,
  rock: 7,
  dislike: 6, // null is the right answer
  mute: 6,
};

test('real HaGRID hands classify at or above the dataset-grounded floors', () => {
  let hit = 0;
  let total = 0;
  const fails = [];
  for (const [cls, samples] of Object.entries(FIXTURES)) {
    let ok = 0;
    const got = {};
    for (const lm of samples) {
      const sign = detectSign(handFeatures(lm.map(([x, y, z]) => ({ x, y, z }))));
      const want = EXPECT[cls];
      if (sign === want) ok++;
      else got[sign ?? 'null'] = (got[sign ?? 'null'] || 0) + 1;
    }
    hit += ok;
    total += samples.length;
    if (ok < FLOORS[cls]) fails.push(`${cls}: ${ok}/${samples.length} (floor ${FLOORS[cls]}) -> ${JSON.stringify(got)}`);
  }
  assert.ok(
    fails.length === 0,
    `real-hand accuracy regressed below floors (${hit}/${total}):\n${fails.join('\n')}`
  );
});

test('overall real-hand accuracy stays above 85%', () => {
  let hit = 0;
  let total = 0;
  for (const [cls, samples] of Object.entries(FIXTURES)) {
    for (const lm of samples) {
      const sign = detectSign(handFeatures(lm.map(([x, y, z]) => ({ x, y, z }))));
      if (sign === EXPECT[cls]) hit++;
      total++;
    }
  }
  const pct = (100 * hit) / total;
  assert.ok(pct >= 85, `overall real-hand accuracy ${pct.toFixed(1)}% below the 85% floor (${hit}/${total})`);
});
