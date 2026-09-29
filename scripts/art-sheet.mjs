// Dev tool: renders every sign's final + step art into big SVG contact sheets.
// Usage: node scripts/art-sheet.mjs  ->  writes /tmp/gangsign-art/finals.svg + steps-<id>.svg
import { mkdirSync, writeFileSync } from 'node:fs';
import { SIGNS, byId } from '../js/signs.js';
import { handSVG, lerpCfg } from '../js/hand-svg.js';

const OPEN = byId('open').final;
const DIR = '/tmp/gangsign-art';
mkdirSync(DIR, { recursive: true });

// one big sheet of finals: 4 columns, 130x150 cell
const cell = { w: 140, h: 165 };
const cols = 5;
const rows = Math.ceil(SIGNS.length / cols);
const parts = [`<rect width="${cols * cell.w}" height="${rows * cell.h}" fill="#0a0a0f"/>`];
SIGNS.forEach((s, i) => {
  const x = (i % cols) * cell.w, y = Math.floor(i / cols) * cell.h;
  const inner = handSVG(s.final).replace('<svg class="handsvg" viewBox="0 0 240 280"', `<svg x="${x + 10}" y="${y + 4}" width="120" height="140" viewBox="0 0 240 280"`);
  parts.push(inner);
  parts.push(`<text x="${x + 70}" y="${y + 158}" text-anchor="middle" font-size="12" fill="#fbbf24" font-family="Menlo,monospace">${s.emoji} ${s.id}</text>`);
});
writeFileSync(`${DIR}/finals.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="${cols * cell.w}" height="${rows * cell.h}">${parts.join('')}</svg>`);

// per-sign step sequences: steps + final, 4 cells wide
for (const s of SIGNS) {
  const cells = [...s.steps.map(([t]) => handSVG(lerpCfg(OPEN, s.final, t))), handSVG(s.final)];
  const ps = [`<rect width="${cells.length * 150 + 10}" height="175" fill="#0a0a0f"/>`];
  cells.forEach((svg, i) => {
    ps.push(svg.replace('<svg class="handsvg" viewBox="0 0 240 280"', `<svg x="${i * 150 + 5}" y="2" width="140" height="163" viewBox="0 0 240 280"`));
  });
  ps.push(`<text x="${cells.length * 150 / 2}" y="${175 - 8}" text-anchor="middle" font-size="12" fill="#fbbf24" font-family="Menlo,monospace">${s.emoji} ${s.id}: steps 1-${s.steps.length} then FINAL</text>`);
  writeFileSync(`${DIR}/steps-${s.id}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="${cells.length * 150 + 10}" height="175">${ps.join('')}</svg>`);
}
console.log('sheets written to', DIR);
