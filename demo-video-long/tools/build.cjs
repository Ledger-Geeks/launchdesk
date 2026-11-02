// Builds index.html + compositions/*.html from the voice layout and transcript.
// Run from the project root after tools/layout.cjs and `npx hyperframes transcribe assets/voiceover.wav`.
// ponytail: scenes are generated, so hand edits in Studio are overwritten by a rebuild; edit this file instead.
const fs = require('fs');
const L = require('../assets/vo/layout.json');
const T = require('../assets/transcript.json');
const lines = fs.readFileSync('assets/vo/lines.txt', 'utf8').split(/\r?\n/).filter(Boolean);
fs.mkdirSync('compositions', { recursive: true });

// ---- align script words to transcript timings (ASR misspells; the script is the truth) ----
const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const asr = (Array.isArray(T) ? T : T.words).map(w => ({ n: norm(w.text), start: w.start, end: w.end }));
const script = [];
lines.forEach((text, li) => text.split(/\s+/).forEach(w => script.push({ text: w, n: norm(w), line: li + 1 })));
// LCS alignment on normalized tokens
const A = script.length, B = asr.length, dp = Array.from({ length: A + 1 }, () => new Int16Array(B + 1));
for (let i = A - 1; i >= 0; i--) for (let j = B - 1; j >= 0; j--)
  dp[i][j] = script[i].n === asr[j].n ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
for (let i = 0, j = 0; i < A && j < B;) {
  if (script[i].n === asr[j].n) { script[i].start = asr[j].start; script[i].end = asr[j].end; i++; j++; }
  else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++;
}
// unmatched words: interpolate inside their line's span
for (let i = 0; i < A; i++) if (script[i].start == null) {
  let p = i - 1; while (p >= 0 && script[p].start == null) p--;
  let q = i + 1; while (q < A && script[q].start == null) q++;
  const a = p >= 0 ? script[p].end : L.lines[script[i].line];
  const b = q < A ? script[q].start : a + 0.4;
  const k = q - p; script[i].start = a + (b - a) * (i - p - 0.5) / k; script[i].end = a + (b - a) * (i - p + 0.5) / k;
}
// time of a script word (first match at/after `nth`) inside a line
const at = (line, word, nth = 1) => {
  const hits = script.filter(w => w.line === line && w.n === norm(word));
  if (!hits[nth - 1]) throw new Error(`no "${word}" in line ${line}`);
  return +hits[nth - 1].start.toFixed(2);
};
const S = Object.fromEntries(L.scenes.map(s => [s.id, s]));
const loc = (id, t) => +(t - S[id].start).toFixed(2);

// ---- shared bits ----
const CURSOR = (id, start, dur) => `<svg id="${id}" class="cursor clip" data-start="${start}" data-duration="${dur}" viewBox="0 0 24 30"><path d="M2 2 L2 24 L8 18.5 L12 27.5 L15.5 26 L11.5 17 L19.5 17 Z" fill="#121212" stroke="#ffffff" stroke-width="1.6" stroke-linejoin="round" /></svg>`;
const BASE_CSS = `
    #root { position: absolute; inset: 0; background: #ededE6; overflow: hidden; color: #121212; }
    .cam { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; transform-origin: 0 0; }
    .cam img { position: absolute; left: 0; top: 0; width: 1920px; }
    .cursor { position: absolute; left: 0; top: 0; width: 56px; height: 70px; z-index: 5; }
    .ring { position: absolute; width: 80px; height: 80px; margin: -40px 0 0 -40px; border: 6px solid #121212; border-radius: 50%; z-index: 4; }
    .wipe { position: absolute; inset: 0; background: #ffd60a; z-index: 6; }`;
const scene = (id, css, body, js) => {
  fs.writeFileSync(`compositions/${id}.html`, `<template>
  <style>${BASE_CSS}${css}
  </style>
  <div id="root" data-composition-id="${id}" data-width="1920" data-height="1080">
${body}
  </div>
  <script>
    const tl = gsap.timeline({ paused: true });
    const frame = (fx, fy, s, h) => ({ x: 960 - fx * s, y: Math.min(0, Math.max(1080 - h * s, 540 - fy * s)), scale: s });
${js}
    window.__timelines["${id}"] = tl;
  </script>
</template>
`);
};
const H = { '01-landing': 4991, '04-pitch': 1756, '05-market': 1710, '06-product': 1624, '07-roadmap': 1808, '08-tech-stack': 1931, '09-financials': 1543, '10-go-to-market': 1641, '11-landing-page': 1320 };
const TAB_X = { pitch: 397, market: 492, product: 597, roadmap: 709, tech: 830, finance: 953, gtm: 1086, land: 1228 };
const sfx = []; // [id, file, globalStart, dur, vol]

// ---- intro ----
{
  const id = 'intro', d = S[id].duration;
  const tHold = at(1, 'holds'), tBefore = at(1, 'before'), tLD = at(2, 'LaunchDesk'), tTwo = at(2, 'two-sentence'), tFull = at(2, 'complete');
  scene(id, `
    #in-lines, #in-q { position: absolute; left: 220px; top: 250px; font-family: "Archivo Black", sans-serif; }
    .big { font-size: 150px; line-height: 1.04; letter-spacing: -0.03em; white-space: nowrap; }
    .w { display: inline-block; }
    .hl { position: relative; display: inline-block; padding: 0 18px; }
    .hl-bg { position: absolute; inset: 8px 0 0 0; background: #ffd60a; transform-origin: left center; }
    .hl-tx { position: relative; }
    #in-sub { margin-top: 40px; font-family: "Inter", sans-serif; font-weight: 700; font-size: 52px; color: #3a3a3a; }
    #in-lock { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    #in-brand { display: flex; align-items: center; gap: 44px; }
    #in-logo { width: 200px; height: 200px; }
    #in-word { font-family: "Archivo Black", sans-serif; font-size: 140px; letter-spacing: -0.04em; text-transform: uppercase; }
    #in-tag { margin-top: 56px; display: flex; gap: 28px; font-family: "Archivo Black", sans-serif; font-size: 56px; }
    #in-tag span { padding: 10px 22px; border: 3px solid #121212; box-shadow: 6px 6px 0 #121212; background: #fff; }
    #in-tag2 { background: #ffd60a !important; }
    #in-wipe { transform-origin: left center; }`, `
    <div id="in-lines" class="clip" data-start="0" data-duration="3.6">
      <div class="big"><span class="w">Every startup idea</span></div>
      <div class="big"><span class="w" id="in-w1">sounds</span> <span class="w hl" id="in-w2"><span class="hl-bg" id="in-m1"></span><span class="hl-tx">great</span></span></div>
      <div class="big"><span class="w" id="in-w3">in your head.</span></div>
    </div>
    <div id="in-q" class="clip" data-start="${(tHold - 0.4).toFixed(2)}" data-duration="${(tLD - tHold + 0.2).toFixed(2)}">
      <div class="big">Does it <span class="hl" id="in-q2"><span class="hl-bg" id="in-m2"></span><span class="hl-tx">hold up?</span></span></div>
      <div id="in-sub">Before you spend months building it.</div>
    </div>
    <div id="in-lock" class="clip" data-start="${(tLD - 0.1).toFixed(2)}" data-duration="${(d - tLD + 0.1).toFixed(2)}">
      <div id="in-brand">
        <svg id="in-logo" viewBox="0 0 36 36"><rect id="in-shadow" x="6" y="6" width="28" height="28" fill="#121212" /><g id="in-tile"><rect x="2" y="2" width="28" height="28" fill="#FFD60A" stroke="#121212" stroke-width="3" /><path d="M16 7 L24 15.5 H19.5 V25 H12.5 V15.5 H8 Z" fill="#121212" /></g></svg>
        <div id="in-word">LaunchDesk</div>
      </div>
      <div id="in-tag"><span id="in-tag1">Two sentences in.</span><span id="in-tag2">A full brief out.</span></div>
    </div>
    <div id="in-wipe" class="wipe clip" data-start="${(d - 0.4).toFixed(2)}" data-duration="0.4"></div>`, `
    tl.fromTo("#in-lines", { scale: 1.08 }, { scale: 1, duration: 0.22, ease: "power2.out" }, 0);
    [["#in-w1", ${at(1, 'sounds')}], ["#in-w2", ${at(1, 'great')}], ["#in-w3", ${at(1, 'in')}]].forEach(([s, t]) => tl.fromTo(s, { opacity: 0, y: 60, rotation: 3 }, { opacity: 1, y: 0, rotation: 0, duration: 0.32, ease: "back.out(2.2)" }, t - 0.06));
    tl.fromTo("#in-m1", { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: "power3.out" }, ${at(1, 'great') + 0.1});
    tl.to("#in-lines", { y: -140, opacity: 0, duration: 0.22, ease: "power3.in" }, 3.3);
    tl.fromTo("#in-q", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.35, ease: "back.out(2)" }, ${(tHold - 0.4).toFixed(2)});
    tl.fromTo("#in-m2", { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: "power3.out" }, ${tHold});
    tl.fromTo("#in-sub", { opacity: 0 }, { opacity: 1, duration: 0.4 }, ${tBefore});
    tl.to("#in-q", { y: -140, opacity: 0, duration: 0.22, ease: "power3.in" }, ${(tLD - 0.25).toFixed(2)});
    tl.fromTo("#in-tile", { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "bounce.out" }, ${tLD - 0.08});
    tl.fromTo("#in-shadow", { opacity: 0 }, { opacity: 1, duration: 0.1 }, ${tLD + 0.14});
    tl.fromTo("#in-word", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.5, ease: "power3.out" }, ${tLD + 0.14});
    tl.fromTo("#in-tag1", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.35, ease: "back.out(2)" }, ${tTwo});
    tl.fromTo("#in-tag2", { opacity: 0, y: 30, rotation: 0 }, { opacity: 1, y: 0, rotation: -2, duration: 0.35, ease: "back.out(2)" }, ${tFull});
    tl.fromTo("#in-lock", { scale: 1 }, { scale: 1.04, duration: ${(d - tLD).toFixed(2)}, ease: "none" }, ${tLD});
    tl.fromTo("#in-wipe", { scaleX: 0 }, { scaleX: 1, duration: 0.36, ease: "power3.inOut" }, ${(d - 0.4).toFixed(2)});`);
  sfx.push(['sfx-logo-1', 'impact-bass-1.mp3', tLD, 1.2, 0.3], ['sfx-wipe-1', 'whoosh-short.mp3', S[id].start + d - 0.45, 0.57, 0.4]);
}

// ---- home page tour (real landing page, one tall screenshot) ----
{
  const id = 'home', d = S[id].duration, h = H['01-landing'];
  const l = t => loc(id, t);
  // selector boxes in page coordinates: [x, y, w, h, time]
  const stats = [[352, 1082, 403, 123, at(3, 'Eight')], [785, 1082, 375, 123, at(3, 'Zero')], [1185, 1082, 383, 123, at(3, 'landing')]];
  const steps = [[352, 1475, 598, 225, at(4, 'describe')], [662, 1725, 598, 225, at(4, 'analyses')], [972, 1975, 596, 225, at(4, 'read')]];
  const bento = [[352, 2588, 598, 192, at(5, 'Pitch')], [972, 2588, 288, 192, at(5, 'market')], [1280, 2588, 288, 192, at(5, 'product')],
    [352, 2808, 288, 192, at(5, 'roadmap')], [662, 2808, 288, 192, at(5, 'tech')], [972, 2808, 596, 192, at(5, 'financials')],
    [352, 3028, 598, 197, at(5, 'go-to-market')], [972, 3028, 596, 197, at(5, 'landing')]];
  const sel = (arr, color, pre) => arr.map(([x, y, w, hh, t], i) => `      <div id="${pre}${i}" class="sel clip" data-start="${(l(t) - 0.05).toFixed(2)}" data-duration="${(i < arr.length - 1 ? arr[i + 1][4] - t : Math.min(2.2, d - l(t) + 0.05)).toFixed(2)}" style="left:${x - 16}px;top:${y - 16}px;width:${w + 32}px;height:${hh + 32}px;border-color:${color}"></div>`).join('\n');
  const selJs = (arr, pre) => arr.map(([, , , , t], i) => `    tl.fromTo("#${pre}${i}", { scale: 1.12, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.22, ease: "back.out(2)" }, ${(l(t) - 0.05).toFixed(2)});`).join('\n');
  scene(id, `
    .sel { position: absolute; border: 8px solid #121212; outline: 7px solid #ffd60a; transform-origin: center; }
    #hm-wipe { transform-origin: right center; }`, `
    <div id="hm-cam" class="cam">
      <img id="hm-img" class="clip" data-start="0" data-duration="${d}" src="assets/shots/01-landing-full.png" alt="" />
${sel(stats, '#ffd60a', 'hm-st')}
${sel(steps, '#121212', 'hm-sp')}
${sel(bento, '#121212', 'hm-bn')}
    </div>
    <div id="hm-wipe" class="wipe clip" data-start="0" data-duration="0.4"></div>`, `
    tl.fromTo("#hm-wipe", { scaleX: 1 }, { scaleX: 0, duration: 0.38, ease: "power3.inOut" }, 0);
    tl.fromTo("#hm-cam", { ...frame(960, 540, 1.06, ${h}) }, { ...frame(960, 540, 1, ${h}), duration: 1.4, ease: "power2.out" }, 0);
    tl.to("#hm-cam", { ...frame(960, 1143, 1.2, ${h}), duration: 0.9, ease: "power3.inOut" }, ${l(at(3, 'Eight')) - 0.9});
    tl.to("#hm-cam", { ...frame(960, 1860, 0.9, ${h}), duration: 0.9, ease: "power3.inOut" }, ${l(at(4, 'It')) - 0.2});
    tl.to("#hm-cam", { ...frame(960, 2880, 0.9, ${h}), duration: 0.9, ease: "power3.inOut" }, ${l(at(5, 'Every')) - 0.2});
${selJs(stats, 'hm-st')}
${selJs(steps, 'hm-sp')}
${selJs(bento, 'hm-bn')}
    // scroll back to the top: the next scene starts on this page's hero
    tl.to("#hm-cam", { ...frame(960, 540, 1, ${h}), duration: 0.7, ease: "power3.inOut" }, ${(d - 0.75).toFixed(2)});`);
  sfx.push(['sfx-scroll-1', 'whoosh-short.mp3', S[id].start + d - 0.75, 0.57, 0.3]);
}

// ---- input: pick the example, start the brief ----
{
  const id = 'input', d = S[id].duration;
  const l = t => loc(id, t);
  const tChip = l(at(6, "We'll")) + 0.1, tStart = l(at(7, 'brief'));
  scene(id, `
    #ip-cam { transform-origin: 670px 780px; }
    #ip-cam img { height: 1080px; }`, `
    <div id="ip-cam" class="cam">
      <img id="ip-empty" class="clip" data-start="0" data-duration="${(tChip + 0.02).toFixed(2)}" src="assets/shots/01-hero.png" alt="" />
      <img id="ip-typed" class="clip" data-start="${tChip}" data-duration="${(d - tChip).toFixed(2)}" src="assets/shots/02-typed.png" alt="" />
    </div>
    <div id="ip-r1" class="ring clip" data-start="${tChip}" data-duration="0.5" style="left: 419px; top: 812px"></div>
    <div id="ip-r2" class="ring clip" data-start="${tStart}" data-duration="0.5" style="left: 969px; top: 654px"></div>
    ${CURSOR('ip-cursor', (tChip - 1.3).toFixed(2), (d - tChip + 1.3).toFixed(2))}`, `
    tl.fromTo("#ip-cam", { scale: 1 }, { scale: 1.45, duration: 1.2, ease: "power3.inOut" }, 0.4);
    tl.fromTo("#ip-cursor", { x: 1500, y: 1150 }, { x: 419, y: 812, duration: 0.9, ease: "power3.out" }, ${(tChip - 1.25).toFixed(2)});
    tl.to("#ip-cursor", { scale: 0.85, duration: 0.07, yoyo: true, repeat: 1, transformOrigin: "0 0" }, ${tChip - 0.04});
    tl.fromTo("#ip-r1", { scale: 0.3, opacity: 1 }, { scale: 1.4, opacity: 0, duration: 0.45, ease: "power2.out" }, ${tChip});
    tl.fromTo("#ip-typed", { opacity: 0.4 }, { opacity: 1, duration: 0.15 }, ${tChip});
    tl.to("#ip-cursor", { x: 969, y: 654, duration: 1.0, ease: "power3.inOut" }, ${(tStart - 1.2).toFixed(2)});
    tl.to("#ip-cursor", { scale: 0.85, duration: 0.07, yoyo: true, repeat: 1, transformOrigin: "0 0" }, ${tStart - 0.04});
    tl.fromTo("#ip-r2", { scale: 0.3, opacity: 1 }, { scale: 1.4, opacity: 0, duration: 0.45, ease: "power2.out" }, ${tStart});
    tl.to("#ip-cam", { scale: 2.6, x: -420, duration: 0.55, ease: "power3.in" }, ${(d - 0.6).toFixed(2)});
    tl.to("#ip-cursor", { opacity: 0, duration: 0.15 }, ${(d - 0.6).toFixed(2)});`);
  sfx.push(['sfx-click-chip', 'click.mp3', S[id].start + tChip, 0.37, 0.6], ['sfx-click-start', 'click.mp3', S[id].start + tStart, 0.37, 0.6]);
}

// ---- drafting ----
{
  const id = 'drafting', d = S[id].duration;
  const l = t => loc(id, t);
  const rows = [[560, 128, at(8, 'market')], [624, 156, at(8, 'roadmap')], [688, 143, at(8, 'money')]];
  scene(id, `
    #dr-cam { transform-origin: 450px 650px; }
    #dr-cam img { height: 1080px; }
    .hl { position: absolute; left: 374px; height: 28px; background: #ffd60a; mix-blend-mode: multiply; transform-origin: left center; }`, `
    <div id="dr-cam" class="cam">
      <img id="dr-a" class="clip" data-start="0" data-duration="1.7" src="assets/shots/03-loading.png" alt="" />
      <img id="dr-b" class="clip" data-start="1.5" data-duration="${(d - 1.5).toFixed(2)}" src="assets/shots/03-loading-b.png" alt="" />
${rows.map(([top, w, t], i) => `      <div id="dr-h${i}" class="hl clip" data-start="${l(t)}" data-duration="${(d - l(t)).toFixed(2)}" style="top: ${top}px; width: ${w}px"></div>`).join('\n')}
    </div>`, `
    tl.fromTo("#dr-cam", { scale: 1.25, opacity: 0.2 }, { scale: 1, opacity: 1, duration: 0.45, ease: "power3.out" }, 0);
    tl.fromTo("#dr-b", { opacity: 0 }, { opacity: 1, duration: 0.2 }, 1.5);
    tl.to("#dr-cam", { scale: 1.75, duration: 1.1, ease: "power3.inOut" }, 1.0);
${rows.map(([, , t], i) => `    tl.fromTo("#dr-h${i}", { scaleX: 0 }, { scaleX: 1, duration: 0.25, ease: "power2.out" }, ${l(t)});`).join('\n')}
    tl.to("#dr-cam", { scale: 2.3, opacity: 0, duration: 0.3, ease: "power3.in" }, ${(d - 0.32).toFixed(2)});`);
}

// ---- the eight tabs: same pattern, real full-page screenshots ----
// cam keyframes are [time, fx, fy, scale] in page coords; a tab click swaps the panel like the app does
const tab = (id, shot, prevShot, kfs, extra = { body: '', js: '', outside: '' }) => {
  const d = S[id].duration, h = H[shot];
  const click = prevShot ? 0.45 : null;
  const tx = TAB_X[id];
  const imgs = prevShot
    ? `      <img id="${id}-prev" class="clip" data-start="0" data-duration="${click + 0.02}" src="assets/shots/${prevShot}-full.png" alt="" />
      <img id="${id}-img" class="clip" data-start="${click}" data-duration="${(d - click).toFixed(2)}" src="assets/shots/${shot}-full.png" alt="" />`
    : `      <img id="${id}-img" class="clip" data-start="0" data-duration="${d}" src="assets/shots/${shot}-full.png" alt="" />`;
  const cur = prevShot ? `
    <div id="${id}-ring" class="ring clip" data-start="${click}" data-duration="0.5" style="left: ${tx}px; top: 385px"></div>
    ${CURSOR(`${id}-cursor`, 0, 1.2)}` : '';
  const curJs = prevShot ? `
    tl.fromTo("#${id}-cursor", { x: 1500, y: 950, opacity: 0 }, { x: ${tx}, y: 385, opacity: 1, duration: 0.4, ease: "power3.out" }, 0);
    tl.to("#${id}-cursor", { scale: 0.85, duration: 0.07, yoyo: true, repeat: 1, transformOrigin: "0 0" }, ${click - 0.04});
    tl.fromTo("#${id}-ring", { scale: 0.3, opacity: 1 }, { scale: 1.4, opacity: 0, duration: 0.45, ease: "power2.out" }, ${click});
    tl.fromTo("#${id}-img", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }, ${click});
    tl.to("#${id}-cursor", { x: 1600, y: 1100, opacity: 0, duration: 0.45, ease: "power2.in" }, ${click + 0.25});`
    : `
    tl.fromTo("#${id}-cam", { x: -40, y: -20, scale: 1.04, opacity: 0 }, { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" }, 0);`;
  const camJs = kfs.map(([t, fx, fy, s, dur = 0.8, hh = h]) => `    tl.to("#${id}-cam", { ...frame(${fx}, ${fy}, ${s}, ${hh}), duration: ${dur}, ease: "power3.inOut" }, ${(t - 0.35).toFixed(2)});`).join('\n');
  scene(id, extra.css || '', `
    <div id="${id}-cam" class="cam">
${imgs}
${extra.body}
    </div>${extra.outside}${cur}`, `${curJs}
${camJs}
${extra.js}
    // back to the top of the page so the next tab is in view
    tl.to("#${id}-cam", { ...frame(960, 540, 1, ${h}), duration: 0.6, ease: "power3.inOut" }, ${(d - 0.7).toFixed(2)});`);
  if (prevShot) sfx.push([`sfx-tab-${id}`, sfx.length % 2 ? 'click.mp3' : 'click-soft.mp3', S[id].start + click, 0.37, 0.6]);
};
const lt = (id, line, word, nth) => loc(id, at(line, word, nth));

tab('pitch', '04-pitch', null, [
  [lt('pitch', 9, 'viability'), 1240, 600, 1.35],
  [lt('pitch', 9, 'This'), 1240, 560, 2.0],
  [lt('pitch', 10, 'problem'), 900, 900, 1.2],
  [lt('pitch', 10, 'value'), 900, 1230, 1.2],
  [lt('pitch', 10, 'key'), 900, 1500, 1.2],
], {
  css: `
    #pitch-ring82 { position: absolute; left: 1059px; top: 413px; width: 160px; height: 160px; border: 5px solid #121212; border-radius: 50%; }`,
  body: `      <div id="pitch-ring82" class="clip" data-start="${lt('pitch', 9, 'scored') + 0.6}" data-duration="0.7"></div>`,
  outside: '',
  js: `    tl.fromTo("#pitch-ring82", { scale: 0.6, opacity: 1 }, { scale: 1.5, opacity: 0, duration: 0.6, ease: "power2.out" }, ${lt('pitch', 9, 'scored') + 0.6});`,
});
sfx.push(['sfx-pop-82', 'pop.mp3', at(9, 'scored') + 0.6, 0.6, 0.5]);
tab('market', '05-market', '04-pitch', [
  [lt('market', 11, 'Total'), 960, 503, 1.3],
  [lt('market', 12, 'customer'), 960, 730, 1.2],
  [lt('market', 12, 'competitors'), 960, 1100, 1.15],
]);
tab('product', '06-product', '05-market', [
  [lt('product', 13, 'MVP'), 960, 760, 1.15],
  [lt('product', 13, 'pricing'), 960, 1250, 1.2],
  [lt('product', 13, 'metrics'), 960, 1430, 1.2, 0.6],
]);
tab('roadmap', '07-roadmap', '06-product', [
  [lt('roadmap', 14, 'four'), 960, 900, 1.0],
  [lt('roadmap', 14, 'team'), 960, 1500, 1.15],
  [lt('roadmap', 14, 'raise') - 0.3, 960, 1640, 1.2, 0.6],
]);
tab('tech', '08-tech-stack', '07-roadmap', [
  [lt('tech', 15, 'reason'), 960, 820, 1.0],
  [lt('tech', 15, 'architecture'), 960, 1250, 1.2],
  [lt('tech', 15, 'technical'), 960, 1560, 1.2],
]);
{
  const id = 'finance';
  const bars = [[660, 114], [722, 315], [784, 486]];
  const tBars = lt(id, 16, 'three'), tTag = lt(id, 17, 'AI');
  tab(id, '09-financials', '08-tech-stack', [
    [lt(id, 16, 'seed'), 960, 503, 1.3],
    [tBars - 0.1, 900, 727, 1.55],
  ], {
    css: `
    .cover { position: absolute; left: 614px; height: 12px; background: #fff; }
    .bar { position: absolute; left: 614px; height: 12px; background: #ffd60a; border-right: 2px solid #121212; transform-origin: left center; }
    #finance-tag { position: absolute; left: 1180px; top: 690px; z-index: 3; padding: 14px 22px; background: #ff9ecf; border: 3px solid #121212; box-shadow: 6px 6px 0 #121212; font-family: "Archivo Black", sans-serif; font-size: 34px; line-height: 1.15; text-transform: uppercase; }
    #finance-tag small { display: block; margin-top: 6px; font-family: "Inter", sans-serif; font-weight: 700; font-size: 28px; text-transform: none; }`,
    body: bars.map(([top, w], i) => `      <div id="finance-c${i}" class="cover clip" data-start="0.45" data-duration="${(S[id].duration - 0.45).toFixed(2)}" style="top: ${top}px; width: ${w}px"></div>
      <div id="finance-b${i}" class="bar clip" data-start="0.45" data-duration="${(S[id].duration - 0.45).toFixed(2)}" style="top: ${top}px; width: ${w}px"></div>`).join('\n'),
    outside: `
    <div id="finance-tag" class="clip" data-start="${tTag - 0.05}" data-duration="${(S[id].duration - 0.8 - tTag).toFixed(2)}">AI estimates<small>Verify before you act.</small></div>`,
    js: bars.map((_, i) => `    tl.fromTo("#finance-b${i}", { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power3.out" }, ${(tBars + 0.2 + i * 0.25).toFixed(2)});`).join('\n') + `
    tl.fromTo("#finance-tag", { scale: 1.3, rotation: -6, opacity: 0 }, { scale: 1, rotation: -2, opacity: 1, duration: 0.3, ease: "back.out(2.5)" }, ${tTag - 0.05});
    tl.to("#finance-tag", { opacity: 0, duration: 0.15 }, ${(S[id].duration - 0.95).toFixed(2)});`,
  });
  sfx.push(['sfx-pop-tag', 'pop.mp3', S[id].start + tTag - 0.05, 0.6, 0.4]);
}
tab('gtm', '10-go-to-market', '09-financials', [
  [lt('gtm', 18, 'launch'), 960, 560, 1.2],
  [lt('gtm', 18, 'acquisition'), 960, 860, 1.15],
  [lt('gtm', 18, 'first'), 960, 1330, 1.2],
]);
{
  const id = 'land', d = S[id].duration;
  const tDl = lt(id, 19, 'Download');
  tab(id, '11-landing-page', '10-go-to-market', [
    [lt(id, 19, 'landing'), 960, 800, 1.15],
    [lt(id, 19, 'written'), 960, 900, 1.15, 1.2],
    [tDl, 700, 1090, 1.5, 0.8, 99999], // past the page bottom so the button clears the captions
  ], {
    css: `
    #land-wipe { transform-origin: left center; }`,
    body: `      <div id="land-dl" class="ring clip" data-start="${tDl + 0.4}" data-duration="0.6" style="left: 468px; top: 1198px; width: 300px; height: 120px; margin: -60px 0 0 -150px; border-radius: 0"></div>`,
    outside: `
    <div id="land-wipe" class="wipe clip" data-start="${(d - 0.4).toFixed(2)}" data-duration="0.4"></div>`,
    js: `    tl.fromTo("#land-dl", { scale: 0.8, opacity: 1 }, { scale: 1.25, opacity: 0, duration: 0.55, ease: "power2.out" }, ${tDl + 0.4});
    tl.fromTo("#land-wipe", { scaleX: 0 }, { scaleX: 1, duration: 0.36, ease: "power3.inOut" }, ${(d - 0.4).toFixed(2)});`,
  });
  sfx.push(['sfx-wipe-2', 'whoosh-short.mp3', S[id].start + d - 0.45, 0.57, 0.4]);
}

// ---- trust: four real facts from the codebase (api/blueprint.ts, WebsitePanel, FAQ) ----
{
  const id = 'trust', d = S[id].duration;
  const l = t => loc(id, t);
  const cards = [
    ['01', 'AI key stays on the server', 'Never shipped to the browser.', '#ffd60a', at(20, 'AI')],
    ['02', 'Size checks + rate limits', 'Every request, every time.', '#ffffff', at(21, 'checked')],
    ['03', 'Sandboxed page preview', 'Scripts and forms blocked.', '#9cc5ff', at(21, 'sandbox')],
    ['04', 'Your idea isn\'t stored', 'Sent to OpenAI to write the brief.', '#ff9ecf', at(21, 'your')],
  ];
  scene(id, `
    #tr-head { position: absolute; left: 160px; top: 90px; font-family: "Archivo Black", sans-serif; font-size: 92px; line-height: 1; letter-spacing: -0.03em; }
    #tr-grid { position: absolute; left: 160px; right: 160px; top: 240px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    .card { min-height: 0; padding: 34px 38px; border: 3px solid #121212; box-shadow: 9px 9px 0 #121212; }
    .card .n { font-family: "JetBrains Mono", monospace; font-weight: 700; font-size: 30px; }
    .card .t { margin-top: 14px; font-family: "Archivo Black", sans-serif; font-size: 50px; line-height: 1.05; text-transform: uppercase; }
    .card .s { margin-top: 14px; font-family: "Inter", sans-serif; font-weight: 700; font-size: 32px; color: #3a3a3a; }
    #tr-wipe { transform-origin: right center; }
    #tr-wipe2 { transform-origin: left center; }`, `
    <div id="tr-head" class="clip" data-start="0" data-duration="${d}">Under the hood.</div>
    <div id="tr-grid" class="clip" data-start="0" data-duration="${d}">
${cards.map(([n, t, s, bg], i) => `      <div id="tr-c${i}" class="card" style="background: ${bg}"><div class="n">${n}</div><div class="t">${t}</div><div class="s">${s}</div></div>`).join('\n')}
    </div>
    <div id="tr-wipe" class="wipe clip" data-start="0" data-duration="0.4"></div>
    <div id="tr-wipe2" class="wipe clip" data-start="${(d - 0.4).toFixed(2)}" data-duration="0.4"></div>`, `
    tl.fromTo("#tr-wipe", { scaleX: 1 }, { scaleX: 0, duration: 0.38, ease: "power3.inOut" }, 0);
    tl.fromTo("#tr-head", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4, ease: "back.out(2)" }, 0.3);
${cards.map(([, , , , t], i) => `    tl.fromTo("#tr-c${i}", { opacity: 0, y: 50, rotation: ${i % 2 ? 2 : -2} }, { opacity: 1, y: 0, rotation: 0, duration: 0.4, ease: "back.out(2)" }, ${(l(t) - 0.1).toFixed(2)});`).join('\n')}
    tl.fromTo("#tr-wipe2", { scaleX: 0 }, { scaleX: 1, duration: 0.36, ease: "power3.inOut" }, ${(d - 0.4).toFixed(2)});`);
  cards.forEach(([, , , , t], i) => sfx.push([`sfx-card-${i}`, 'pop.mp3', t - 0.1, 0.6, 0.35]));
  sfx.push(['sfx-wipe-3', 'whoosh-short.mp3', S[id].start + d - 0.45, 0.57, 0.4]);
}

// ---- end card ----
{
  const id = 'end', d = S[id].duration;
  const l = t => loc(id, t);
  const tLD = l(at(22, 'LaunchDesk,'));
  const words = [['#en1', l(at(22, 'No')) + 0.15], ['#en2', l(at(22, 'No', 2))], ['#en3', l(at(22, 'Just'))], ['#en-pt', l(at(22, 'pressure-tested.'))]];
  scene(id, `
    #en-lines { position: absolute; left: 220px; top: 200px; font-family: "Archivo Black", sans-serif; }
    .big { font-size: 136px; line-height: 1.08; letter-spacing: -0.03em; white-space: nowrap; }
    .w { display: inline-block; }
    #en-pt { position: relative; display: inline-block; padding: 0 16px; }
    #en-mark { position: absolute; inset: 10px 0 0 0; background: #ffd60a; transform-origin: left center; }
    #en-pt-t { position: relative; }
    #en-lock { position: absolute; left: 0; right: 0; top: 320px; display: flex; flex-direction: column; align-items: center; }
    #en-brand { display: flex; align-items: center; gap: 36px; }
    #en-logo { width: 170px; height: 170px; }
    #en-word { font-family: "Archivo Black", sans-serif; font-size: 120px; letter-spacing: -0.04em; text-transform: uppercase; }
    #en-cta { display: flex; align-items: center; gap: 30px; margin-top: 70px; }
    #en-btn { padding: 22px 34px; background: #ffd60a; border: 3px solid #121212; box-shadow: 6px 6px 0 #121212; font-family: "Archivo Black", sans-serif; font-size: 36px; text-transform: uppercase; }
    #en-url { font-family: "JetBrains Mono", monospace; font-weight: 700; font-size: 34px; }
    #en-by { margin-top: 60px; font-family: "Inter", sans-serif; font-weight: 700; font-size: 30px; color: #3a3a3a; }
    #en-wipe { transform-origin: right center; }`, `
    <div id="en-lines" class="clip" data-start="0" data-duration="${(tLD - 0.05).toFixed(2)}">
      <div class="big"><span class="w" id="en1">No sign-up.</span></div>
      <div class="big"><span class="w" id="en2">No deck.</span></div>
      <div class="big"><span class="w" id="en3">Just your idea,</span></div>
      <div class="big"><span class="w" id="en-pt"><span id="en-mark"></span><span id="en-pt-t">pressure-tested.</span></span></div>
    </div>
    <div id="en-lock" class="clip" data-start="${(tLD - 0.05).toFixed(2)}" data-duration="${(d - tLD + 0.05).toFixed(2)}">
      <div id="en-brand">
        <svg id="en-logo" viewBox="0 0 36 36"><rect id="en-shadow" x="6" y="6" width="28" height="28" fill="#121212" /><g id="en-tile"><rect x="2" y="2" width="28" height="28" fill="#FFD60A" stroke="#121212" stroke-width="3" /><path d="M16 7 L24 15.5 H19.5 V25 H12.5 V15.5 H8 Z" fill="#121212" /></g></svg>
        <div id="en-word">LaunchDesk</div>
      </div>
      <div id="en-cta"><div id="en-btn">Start a brief &rarr;</div><div id="en-url">launchdesk-rho.vercel.app/start</div></div>
      <div id="en-by">Built by LedgerGeeks &middot; ledgergeeks.io</div>
    </div>
    <div id="en-wipe" class="wipe clip" data-start="0" data-duration="0.4"></div>`, `
    tl.fromTo("#en-wipe", { scaleX: 1 }, { scaleX: 0, duration: 0.38, ease: "power3.inOut" }, 0);
${words.map(([s, t]) => `    tl.fromTo("${s}", { opacity: 0, y: 60, rotation: 2 }, { opacity: 1, y: 0, rotation: 0, duration: 0.32, ease: "back.out(2.2)" }, ${(t - 0.05).toFixed(2)});`).join('\n')}
    tl.fromTo("#en-mark", { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: "power3.out" }, ${(words[3][1] + 0.1).toFixed(2)});
    tl.to("#en-lines", { y: -160, opacity: 0, duration: 0.22, ease: "power3.in" }, ${(tLD - 0.3).toFixed(2)});
    tl.fromTo("#en-tile", { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "bounce.out" }, ${tLD});
    tl.fromTo("#en-shadow", { opacity: 0 }, { opacity: 1, duration: 0.1 }, ${(tLD + 0.22).toFixed(2)});
    tl.fromTo("#en-word", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.5, ease: "power3.out" }, ${(tLD + 0.22).toFixed(2)});
    tl.fromTo("#en-cta", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, ${(tLD + 0.7).toFixed(2)});
    tl.fromTo("#en-by", { opacity: 0 }, { opacity: 1, duration: 0.4 }, ${(tLD + 1.0).toFixed(2)});`);
  const tg = S[id].start + tLD;
  sfx.push(['sfx-riser', 'riser.mp3', +(tg - 1.97).toFixed(2), 2.8, 0.3, 1.5], ['sfx-logo-2', 'impact-bass-1.mp3', tg, 1.2, 0.4]);
}

// ---- captions: script words, transcript timings; skip where big type already says it ----
{
  const skip = w => (w.line === 1 && w.start < 3.4) || w.line === 22;
  const words = script.filter(w => !skip(w));
  const groups = []; let g = [];
  words.forEach((w, i) => {
    g.push(w);
    const nx = words[i + 1];
    const brk = !nx || nx.line !== w.line || (/[.,?]$/.test(w.text) && g.length >= 2) || g.length >= 6 || (nx.start - w.end > 0.35 && g.length >= 2);
    if (brk) { groups.push(g); g = []; }
  });
  // fold a dangling single word into its neighbour group
  for (let i = groups.length - 1; i > 0; i--) if (groups[i].length === 1 && groups[i][0].line === groups[i - 1][0].line && groups[i - 1].length < 7) { groups[i - 1].push(...groups[i]); groups.splice(i, 1); }
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  let html = '', js = '';
  groups.forEach((gr, gi) => {
    const start = +(gr[0].start - 0.05).toFixed(2);
    const nextStart = groups[gi + 1] ? groups[gi + 1][0].start - 0.05 : Infinity;
    const end = +Math.min(nextStart, gr[gr.length - 1].end + 0.6).toFixed(2);
    html += `    <div id="cp${gi}" class="cg clip" data-start="${start}" data-duration="${(end - start).toFixed(2)}"><div class="cb">` + gr.map((w, wi) => `<span id="cp${gi}w${wi}" class="cw">${esc(w.text)}</span>`).join(' ') + `</div></div>\n`;
    js += `    tl.fromTo("#cp${gi} .cb", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" }, ${start});\n`;
    gr.forEach((w, wi) => {
      js += `    tl.set("#cp${gi}w${wi}", { backgroundColor: "#ffd60a" }, ${w.start.toFixed(2)});\n`;
      if (wi < gr.length - 1) js += `    tl.set("#cp${gi}w${wi}", { backgroundColor: "rgba(255,214,10,0)" }, ${gr[wi + 1].start.toFixed(2)});\n`;
    });
    js += `    tl.to("#cp${gi} .cb", { opacity: 0, duration: 0.1, ease: "power2.in" }, ${(end - 0.1).toFixed(2)});\n    tl.set("#cp${gi} .cb", { opacity: 0 }, ${end});\n`;
  });
  fs.writeFileSync('compositions/captions.html', `<template>
  <style>
    #root { position: absolute; inset: 0; pointer-events: none; }
    .cg { position: absolute; left: 0; right: 0; bottom: 112px; text-align: center; overflow: visible; }
    .cb { display: inline-block; max-width: 1500px; padding: 12px 22px; background: #fff; border: 3px solid #121212; box-shadow: 6px 6px 0 #121212; font-family: "Inter", sans-serif; font-weight: 900; font-size: 48px; line-height: 1.2; color: #121212; }
    .cw { padding: 0 6px; background-color: rgba(255, 214, 10, 0); }
  </style>
  <div id="root" data-composition-id="captions" data-width="1920" data-height="1080">
${html}  </div>
  <script>
    const tl = gsap.timeline({ paused: true });
${js}    window.__timelines["captions"] = tl;
  </script>
</template>
`);
  console.log(`${groups.length} caption groups`);
}

// ---- root ----
const hosts = L.scenes.map(s => `      <div id="${s.id}" data-composition-id="${s.id}" data-composition-src="compositions/${s.id}.html" data-start="${s.start}" data-duration="${s.duration}" data-track-index="1" data-track-kind="graphics" data-width="1920" data-height="1080"></div>`).join('\n');
const audio = sfx.map(([id, file, t, dur, vol, ms], i) => `      <audio id="${id}" src="assets/sfx/${file}" data-start="${(+t).toFixed(2)}"${ms ? ` data-media-start="${ms}"` : ''} data-duration="${dur}" data-track-index="${4 + (i % 2)}" data-volume="${vol}"></audio>`).join('\n');
fs.writeFileSync('index.html', `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 1920px; height: 1080px; overflow: hidden; background: #ededE6; }
      #root { width: 100%; height: 100%; position: relative; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${L.total}" data-width="1920" data-height="1080">
${hosts}
      <div id="captions" data-composition-id="captions" data-composition-src="compositions/captions.html" data-start="0" data-duration="${L.total}" data-track-index="2" data-track-kind="captions" data-width="1920" data-height="1080" style="z-index: 10"></div>
      <audio id="vo" src="assets/voiceover.wav" data-start="0" data-duration="${L.total}" data-track-index="3" data-volume="1"></audio>
${audio}
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`);
console.log('built', L.scenes.length, 'scenes,', sfx.length, 'sounds, total', L.total);
