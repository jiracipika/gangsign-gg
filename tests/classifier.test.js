import test from 'node:test';
import assert from 'node:assert/strict';
import { syntheticLandmarks } from '../js/synthetic.js';
import { handFeatures } from '../js/features.js';
import { SIGNS, byId, detectSign, DEMO, HOLD_FRAMES } from '../js/signs.js';
import { handSVG, lerpCfg } from '../js/hand-svg.js';

const OPEN = byId('open').final;

test('every demo spec resolves to its own sign (and nothing else)', () => {
  for (const [id, spec] of Object.entries(DEMO)) {
    const f = handFeatures(syntheticLandmarks(spec));
    assert.equal(detectSign(f), id, `${id} spec detected as something else`);
  }
});

test('detection is stable under small landmark jitter', () => {
  for (const [id, spec] of Object.entries(DEMO)) {
    for (let k = 0; k < 3; k++) {
      const lm = syntheticLandmarks(spec).map((p) => ({
        x: p.x + (Math.sin(k * 7 + p.x * 50) * 0.004),
        y: p.y + (Math.cos(k * 5 + p.y * 50) * 0.004),
        z: 0,
      }));
      assert.equal(detectSign(handFeatures(lm)), id, `${id} jittered pass ${k}`);
    }
  }
});

test('open hand is not misread as ok/pinch (classic classifier trap)', () => {
  const f = handFeatures(syntheticLandmarks({}));
  assert.ok(f.pinch > 0.38, 'open-hand pinch distance should be wide');
  assert.ok(f.cluster > 0.55, 'open-hand tips should not cluster');
});

test('every sign: steps render, checks run, final art draws', () => {
  for (const s of SIGNS) {
    assert.ok(s.steps.length >= 2, `${s.id} needs >= 2 steps`);
    assert.ok(s.final, `${s.id} needs final config`);
    assert.ok(s.stars >= 1 && s.stars <= 3, `${s.id} stars out of the 1-3 UI scale`);
    assert.match(handSVG(s.final), /^<svg/);
    for (const [t, text] of s.steps) {
      assert.equal(typeof t, 'number');
      assert.ok(text.length > 5, `${s.id} step text too short`);
      assert.match(handSVG(lerpCfg(OPEN, s.final, t)), /^<svg/);
    }
    const f = handFeatures(syntheticLandmarks(DEMO[s.id]));
    for (const [label, pass] of s.checks(f)) {
      assert.equal(typeof label, 'string');
      assert.equal(typeof pass, 'boolean');
    }
    assert.equal(s.checks(f).every(([, p]) => p), true, `${s.id} own demo spec must pass ALL its practice checks`);
  }
});

test('peace and crossed fingers stay distinct', () => {
  const peace = handFeatures(syntheticLandmarks(DEMO.peace));
  const crossed = handFeatures(syntheticLandmarks(DEMO.crossed));
  assert.ok(crossed.swapX > peace.swapX, 'crossing should push swapX up');
  assert.equal(detectSign(crossed), 'crossed');
  assert.equal(detectSign(peace), 'peace');
});

test('fazeup: thumbDown is the discriminator, and the flip guards its neighbors', () => {
  const f = handFeatures(syntheticLandmarks(DEMO.fazeup));
  assert.ok(f.thumbDown, 'inverted right-hand rule needs thumb DOWN');
  assert.ok(f.thumb, 'thumb must be extended');
  assert.ok(f.up.index, 'index stays up (the Y axis)');
  assert.equal(detectSign(f), 'fazeup');
  // same hand with the thumb back up must NOT certify (no drive-by FAZE UPs)
  const flipped = handFeatures(syntheticLandmarks({ ...DEMO.fazeup, thumb: 'out' }));
  assert.ok(!flipped.thumbDown);
  assert.notEqual(detectSign(flipped), 'fazeup');
  // tucked thumbs (fist, peace, rock, crossed) must never read as pointing down
  for (const id of ['fist', 'peace', 'rock', 'crossed']) {
    const f2 = handFeatures(syntheticLandmarks(DEMO[id]));
    assert.ok(!f2.thumbDown, `${id} tucked thumb misread as thumbDown`);
  }
});

test('hold window is a sane length', () => {
  assert.ok(HOLD_FRAMES >= 20 && HOLD_FRAMES <= 90);
});

test('handSVG tolerates extreme configs', () => {
  for (const cfg of [
    { fingers: [1, 1, 1, 1], thumb: 1, thumbOut: 0 },
    { fingers: [0, 0, 0, 0], thumb: 0, thumbOut: 1, thumbUp: true },
    { fingers: [2, -1, 0.5, 0], lean: [45, -45, 90, 0], spread: 1.5 }, // out-of-range junk
    { label: '<script>alert(1)</script>' }, // label is interpolated into SVG: must not crash
  ]) {
    assert.match(handSVG(cfg), /^<svg/);
  }
});
