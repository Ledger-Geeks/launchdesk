// Builds compositions/captions.html from assets/transcript.json (static HTML, timed by the voice).
const fs = require('fs');
const t = require(process.cwd() + '/assets/transcript.json');
let w = (Array.isArray(t) ? t : t.words).map(x => ({ text: x.text, start: x.start, end: x.end }));
// transcript spelling fixes, by position
const fix = { Launchdesk: 'LaunchDesk', breakheaven: 'breakeven', sentences: 'sentences.', who: 'Who', 'market,': 'Market,', pass: 'pass.' };
w.forEach((x, i) => {
  if (fix[x.text]) x.text = fix[x.text];
  // the script says "eighty-two"; ASR heard only "two"
  if (i > 0 && w[i - 1].text === 'scored' && x.text !== '82') x.text = '82';
});
// on-screen big type already says these words: no caption over the hook lines or the end card
w = w.filter(x => x.start >= 2.9 && x.start < 36.9);
// phrase breaks follow the script's own phrasing (word counts per group)
const sizes = [3,4, 3,3, 3,5, 5,3, 3,3, 5,4, 3,4, 5, 3,4, 3,3, 5, 3,3, 5,5];
if (sizes.reduce((a, b) => a + b) !== w.length) throw new Error('sizes ' + sizes.reduce((a, b) => a + b) + ' != words ' + w.length);
const groups = []; let k = 0;
sizes.forEach(n => { groups.push(w.slice(k, k + n)); k += n; });
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
let html = '', js = '';
groups.forEach((gr, gi) => {
  const start = +(gr[0].start - 0.05).toFixed(2);
  const nextStart = groups[gi + 1] ? groups[gi + 1][0].start - 0.05 : gr[gr.length - 1].end + 0.3;
  const end = +Math.min(nextStart, gr[gr.length - 1].end + 0.6, 36.8).toFixed(2);
  const dur = +(end - start).toFixed(2);
  html += `      <div id="cap-g${gi}" class="cap-group clip" data-start="${start}" data-duration="${dur}"><div class="cap-box">` +
    gr.map((x, wi) => `<span id="cap-g${gi}w${wi}" class="cap-w">${esc(x.text)}</span>`).join(' ') + `</div></div>\n`;
  js += `    tl.fromTo("#cap-g${gi} .cap-box", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" }, ${start});\n`;
  gr.forEach((x, wi) => {
    js += `    tl.set("#cap-g${gi}w${wi}", { backgroundColor: "#ffd60a" }, ${x.start.toFixed(2)});\n`;
    if (wi < gr.length - 1) js += `    tl.set("#cap-g${gi}w${wi}", { backgroundColor: "rgba(255,214,10,0)" }, ${gr[wi + 1].start.toFixed(2)});\n`;
  });
  js += `    tl.to("#cap-g${gi} .cap-box", { opacity: 0, duration: 0.1, ease: "power2.in" }, ${(end - 0.1).toFixed(2)});\n`;
  js += `    tl.set("#cap-g${gi} .cap-box", { opacity: 0 }, ${end});\n`;
});
fs.writeFileSync('compositions/captions.html', `<template>
  <style>
    #root { position: absolute; inset: 0; pointer-events: none; }
    .cap-group { position: absolute; left: 0; right: 0; bottom: 112px; text-align: center; overflow: visible; }
    .cap-box {
      display: inline-block; max-width: 1500px; padding: 12px 22px;
      background: #ffffff; border: 3px solid #121212; box-shadow: 6px 6px 0 #121212;
      font-family: "Inter", sans-serif; font-weight: 900; font-size: 48px; line-height: 1.2; color: #121212;
    }
    .cap-w { padding: 0 6px; background-color: rgba(255, 214, 10, 0); }
  </style>
  <div id="root" data-composition-id="captions" data-width="1920" data-height="1080">
${html}  </div>
  <script>
    const tl = gsap.timeline({ paused: true });
${js}    window.__timelines["captions"] = tl;
  </script>
</template>
`);
console.log(groups.map(gr => gr.map(x => x.text).join(' ')).join('\n'));
