// GANGSIGN.GG — camera in, verdicts out. Satire not included in the inference.
// MediaPipe is imported lazily inside loadModel(): if the CDN is unreachable the
// whole app still boots (catalog, practice, lectures, ?demo) — only live scan needs it.
import { handFeatures } from './features.js';
import { syntheticLandmarks } from './synthetic.js';
import { SIGNS, byId, detectSign, DEMO, HOLD_FRAMES } from './signs.js';
import { handSVG, lerpCfg } from './hand-svg.js';
import { LECTURES } from './lectures.js';

const $ = (id) => document.getElementById(id);
const MP_VERSION = '0.10.14'; // JS import and WASM fileset MUST be the same version

// ---------- persistent store ----------
const store = (() => {
  try { return JSON.parse(localStorage.getItem('gangsign-gg:v1')) || {}; } catch { return {}; }
})();
store.creds ||= {};
store.name ||= '';
const save = () => localStorage.setItem('gangsign-gg:v1', JSON.stringify(store));

const OPEN = byId('open').final;

// ---------- catalog + progress UI ----------
function starRow(n) { const k = Math.max(0, Math.min(3, n)); return '★'.repeat(k) + '☆'.repeat(3 - k); }

function renderCatalog() {
  $('catalog').innerHTML = SIGNS.map((s) => `
    <button class="card ${store.creds[s.id] ? 'card--earned' : ''}" data-sign="${s.id}">
      ${store.creds[s.id] ? '<span class="card__stamp">CERTIFIED ✓</span>' : ''}
      <div class="card__hand">${handSVG(s.final)}</div>
      <div class="card__name">${s.emoji} ${s.name}</div>
      <div class="card__gang">${s.gang}</div>
      <div class="card__meta"><span class="stars">${starRow(s.stars)}</span><span class="sus">${s.sus}</span></div>
    </button>`).join('');
  $('catalog').querySelectorAll('.card').forEach((el) =>
    el.addEventListener('click', () => openPractice(el.dataset.sign)));
}

function renderCreds() {
  const n = Object.keys(store.creds).length;
  $('credCount').textContent = `${n}/${SIGNS.length} certified`;
  $('progressChips').innerHTML = SIGNS.map((s) =>
    `<span class="chip ${store.creds[s.id] ? 'chip--on' : ''}" title="${s.name}">${s.emoji}</span>`).join('');
  $('streetName').value = store.name;
}

// ---------- lectures ----------
function renderLectures() {
  const grid = $('lectures');
  if (LECTURES.length) {
    grid.innerHTML = LECTURES.map((l) => `
      <div class="lecture">
        <iframe loading="lazy" src="https://www.youtube.com/embed/${l.id}" title="${l.title}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <p><strong>${l.title}</strong> — ${l.blurb}</p>
      </div>`).join('');
  } else {
    grid.innerHTML = '<p class="dim">Lectures loading from the field… (embeds pending video verification)</p>';
  }
}

// ---------- practice mode ----------
let practiceId = null;

function openPractice(id) {
  const s = byId(id);
  practiceId = id;
  $('practice').hidden = false;
  $('prTitle').textContent = `${s.emoji} ${s.name}`;
  $('prGang').innerHTML = `<strong>${s.gang}</strong> · difficulty ${starRow(s.stars)} · sus level: ${s.sus}`;
  $('prLore').textContent = s.lore;
  $('prSteps').innerHTML = s.steps.map(([t, text], i) => `
    <figure class="step">
      <div class="step__art">${handSVG(lerpCfg(OPEN, s.final, t))}</div>
      <figcaption><b>Step ${i + 1}.</b> ${text}</figcaption>
    </figure>`).join('');
  $('prChecks').innerHTML = '';
  resetHold();
  if (!camActive) startDemo(); // no camera yet? let people see the pipeline work
  $('practice').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

$('prClose').addEventListener('click', () => { $('practice').hidden = true; practiceId = null; });

function resetHold() {
  hold = 0;
  $('holdFill').style.width = '0%';
  $('holdText').textContent = 'hold the final shape…';
}

let hold = 0;
const HOLD_GOAL = new URLSearchParams(location.search).has('fast') ? 8 : HOLD_FRAMES;
function updatePractice(f) {
  const s = byId(practiceId);
  const checks = s.checks(f);
  $('prChecks').innerHTML = checks.map(([label, pass]) =>
    `<li class="${pass ? 'pass' : 'fail'}">${pass ? '✓' : '✗'} ${label}</li>`).join('');
  const all = checks.every(([, p]) => p);
  hold = all ? hold + 1 : Math.max(0, hold - 2);
  $('holdFill').style.width = `${Math.min(100, (hold / HOLD_GOAL) * 100)}%`;
  if (hold >= HOLD_GOAL) {
    if (!store.creds[s.id]) { certify(s.id); }
    $('holdText').textContent = 'CERTIFIED. Flash it with pride.';
  } else {
    $('holdText').textContent = all ? 'hold it…' : 'follow the checklist…';
  }
}

function certify(id) {
  store.creds[id] = new Date().toISOString().slice(0, 10);
  save(); renderCreds(); renderCatalog();
  confetti();
  const st = $('stamp');
  st.textContent = `${byId(id).name} — CERTIFIED`;
  st.classList.add('show');
  setTimeout(() => st.classList.remove('show'), 2600);
}

// ---------- scan mode ----------
let recent = [];
let shownId = null;

function updateScan(f, hasHand) {
  const counts = {};
  for (const id of recent) if (id) counts[id] = (counts[id] || 0) + 1;
  const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const card = $('detectCard');
  if (!hasHand) {
    if (recent.filter((x) => !x).length > 8) { shownId = null; card.innerHTML = '<span class="detect-hand">🖐</span> show me a hand'; }
    return;
  }
  if (best && best[1] >= 12 && best[0] !== shownId) {
    shownId = best[0];
    const s = byId(shownId);
    card.innerHTML = `
      <div class="detect-hand">${s.emoji}</div>
      <div class="detect-name">${s.name}</div>
      <div class="detect-gang">${s.gang}</div>
      <div class="detect-sus">sus level: ${s.sus}</div>
      <button class="btn btn--small" data-train="${s.id}">Train it →</button>`;
    card.querySelector('[data-train]').addEventListener('click', () => openPractice(s.id));
  }
}

// ---------- camera + MediaPipe ----------
const video = $('cam');
const overlay = $('overlay');
const octx = overlay.getContext('2d');
const CONN = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],
  [9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[0,17]];
let landmarker = null, gpuOk = true, camActive = false, demoOn = false;
let lastDetect = 0, lastVideoTime = -1, fails = 0;

const CAM_ERR = {
  NotAllowedError: 'Permission denied. Check the camera icon in the address bar, and macOS System Settings → Privacy & Security → Camera for this browser.',
  NotReadableError: 'Camera busy or unplugged. Close other apps using it and retry.',
  NotFoundError: 'No camera found on this device.',
  Insecure: 'Camera needs HTTPS or localhost — this page is on an insecure origin.',
  CDN: 'Could not reach the MediaPipe CDN. Check your connection and retry.',
  None: 'Camera unavailable on this browser.',
};

async function loadModel() {
  $('camMsgText').textContent = 'Loading the hand model…';
  let vision;
  try {
    vision = await import(`https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}`);
  } catch {
    throw Object.assign(new Error('Could not reach the MediaPipe CDN — check your connection and retry.'), { name: 'CDN' });
  }
  const { FilesetResolver, HandLandmarker } = vision;
  const fileset = await FilesetResolver.forVisionTasks(`https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}/wasm`);
  const make = (delegate) => HandLandmarker.createFromOptions(fileset, {
    baseOptions: {
      modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
      delegate,
    },
    numHands: 2,
    runningMode: 'VIDEO',
  });
  landmarker = await make(gpuOk ? 'GPU' : 'CPU'); // GPU can die mid-session; CPU is the lifeboat
}

async function startCamera() {
  try {
    stopDemo();
    if (!navigator.mediaDevices?.getUserMedia) throw Object.assign(new Error('insecure context'), { name: 'Insecure' });
    $('camMsgText').textContent = 'Waiting for permission…';
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: 640, height: 400 }, audio: false,
    });
    video.srcObject = stream;
    await video.play();
    camActive = true;
    $('camMsg').hidden = true;
    if (!landmarker) await loadModel();
    $('camMsgText').textContent = 'Tracking.';
  } catch (err) {
    const msg = CAM_ERR[err.name === 'Insecure' ? 'Insecure' : err.name] || `${err.name}: ${err.message}`;
    $('camMsgText').innerHTML = `<b>Camera says no:</b> ${msg}<br><br>You can still run the camera-free demo.`;
  }
}

async function rebuildOnCPU() {
  gpuOk = false;
  try { landmarker = await loadModel(); lastVideoTime = -1; } catch { /* keep old instance */ }
}

$('startBtn').addEventListener('click', startCamera);
$('demoBtn').addEventListener('click', () => startDemo(true));

// ---------- demo mode (camera-free, synthetic hands through the REAL pipeline) ----------
const DEMO_IDS = Object.keys(DEMO);
const DEMO_DWELL = new URLSearchParams(location.search).has('fast') ? 6000 : 2800;
let demoIdx = 0, demoAt = 0;

function startDemo(manual) {
  demoOn = true;
  $('demoBanner').hidden = false;
  $('camMsg').hidden = true;
  if (manual) $('camMsgText').textContent = 'Demo mode.';
}
function stopDemo() { demoOn = false; $('demoBanner').hidden = true; }

// ---------- main loop (rAF rescheduled FIRST so one throw can't kill it) ----------
function loop() {
  requestAnimationFrame(loop);
  const now = performance.now();
  if (demoOn) {
    if (now - demoAt > DEMO_DWELL) { demoAt = now; demoIdx = (demoIdx + 1) % DEMO_IDS.length; }
    const id = DEMO_IDS[demoIdx];
    const jit = (p) => ({ x: p.x + Math.sin(now / 400 + p.y * 40) * 0.004, y: p.y + Math.cos(now / 500 + p.x * 40) * 0.004, z: 0 });
    const lm = syntheticLandmarks(DEMO[id]).map(jit);
    drawSkeleton(lm);
    handleLandmarks(lm, `demo: ${id}`);
    return;
  }
  if (!landmarker || !camActive || video.readyState < 2) return;
  if (now - lastDetect < 30) return; // ~30fps cap: inference must not starve the UI
  lastDetect = now;
  if (video.currentTime === lastVideoTime) return; // frozen feed = no new work
  lastVideoTime = video.currentTime;
  let res;
  try {
    res = landmarker.detectForVideo(video, now); // timestamps strictly increase per instance
    fails = 0;
  } catch {
    if (++fails > 8 && gpuOk) rebuildOnCPU();
    return;
  }
  const lm = res?.landmarks?.[0];
  lastHandedness = res?.handednesses?.[0]?.[0]?.categoryName || 'Left';
  if (lm) drawSkeleton(lm);
  else clearSkeleton();
  handleLandmarks(lm, '');
}

function handleLandmarks(lm, note) {
  recent.push(lm ? detectSign(featOf(lm)) : null);
  if (recent.length > 18) recent.shift();
  if (!lm) {
    updateScan(null, false);
    if (practiceId) resetHold();
    return;
  }
  updateScan(featOf(lm), true);
  if (practiceId) updatePractice(featOf(lm));
}

function featOf(lm) {
  const f = handFeatures(lm);
  // MediaPipe labels assume mirrored input: a physical right hand reports "Left".
  // The crossing test is tuned on right-hand geometry, so re-sync the sign for others.
  if (lastHandedness !== 'Left') f.swapX = -f.swapX;
  return f;
}
let lastHandedness = 'Left';

function drawSkeleton(lm) {
  const w = overlay.width, h = overlay.height;
  octx.clearRect(0, 0, w, h);
  octx.shadowColor = '#22d3ee';
  octx.shadowBlur = 8;
  octx.strokeStyle = '#67e8f9';
  octx.lineWidth = 2.5;
  octx.beginPath(); // ONE path, ONE shadow pass — per-bone shadowing melts mobile GPUs
  for (const [a, b] of CONN) {
    octx.moveTo(lm[a].x * w, lm[a].y * h);
    octx.lineTo(lm[b].x * w, lm[b].y * h);
  }
  octx.stroke();
  octx.shadowBlur = 0;
  octx.fillStyle = '#f472b6';
  octx.beginPath();
  for (const p of lm) {
    octx.moveTo(p.x * w, p.y * h);
    octx.arc(p.x * w, p.y * h, 3, 0, Math.PI * 2);
  }
  octx.fill();
}
function clearSkeleton() { octx.clearRect(0, 0, overlay.width, overlay.height); }

// ghost-hand guard: dead/frozen feed must not leave a skeleton hanging
setInterval(() => {
  if (camActive && !demoOn && video.readyState < 2) { clearSkeleton(); recent = []; }
}, 1500);

// ---------- confetti ----------
function confetti() {
  const cv = document.createElement('canvas');
  cv.className = 'confetti';
  cv.width = innerWidth; cv.height = innerHeight;
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d');
  const colors = ['#fbbf24', '#ef4444', '#22d3ee', '#34d399', '#f472b6'];
  const parts = Array.from({ length: 140 }, () => ({
    x: innerWidth / 2 + (Math.random() - 0.5) * 240,
    y: innerHeight / 2,
    vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 13 - 4,
    s: 4 + Math.random() * 6, c: colors[Math.floor(Math.random() * colors.length)],
    r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
  }));
  const t0 = performance.now();
  (function tick(t) {
    ctx.clearRect(0, 0, cv.width, cv.height);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.35; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s); ctx.restore();
    }
    if (t - t0 < 2400) requestAnimationFrame(tick); else cv.remove();
  })(t0);
}

// ---------- wiring ----------
$('streetName').addEventListener('input', (e) => { store.name = e.target.value.trim(); save(); });
$('ticker').textContent = ('⚠ 100% SATIRE   •   NO GANGS WERE CONSULTED   •   THE ONLY TURF WE CLAIM IS THE COUCH   •   DO NOT ATTEMPT THE PINCH AT FAMILY DINNERS   •   PEACE SIGNS ONLY AFTER 9PM   •   ').repeat(3);
if (new URLSearchParams(location.search).has('demo')) startDemo();

renderCatalog();
renderCreds();
renderLectures();
requestAnimationFrame(loop);

// console/test hook: __gangsign.certify('rock'), .detect(spec) etc.
window.__gangsign = {
  certify, byId, detectSign, handFeatures, syntheticLandmarks, DEMO,
  store,
};
