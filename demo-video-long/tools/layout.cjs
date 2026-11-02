// Places voice lines on the timeline -> assets/vo/layout.json, and mixes assets/voiceover.wav.
const { execFileSync, spawnSync } = require('child_process');
const fs = require('fs');
const scenes = [
  ['intro', [1, 2]], ['home', [3, 4, 5]], ['input', [6, 7]], ['drafting', [8]],
  ['pitch', [9, 10]], ['market', [11, 12]], ['product', [13]], ['roadmap', [14]], ['tech', [15]],
  ['finance', [16, 17]], ['gtm', [18]], ['land', [19]], ['trust', [20, 21]], ['end', [22]],
];
const dur = i => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', `assets/vo/l${i}.mp3`]).toString();
const ends = {};
for (let i = 1; i <= 22; i++) {
  const r = spawnSync('ffmpeg', ['-i', `assets/vo/l${i}.mp3`, '-af', 'silencedetect=noise=-40dB:d=0.12', '-f', 'null', '-'], { encoding: 'utf8' });
  const m = [...r.stderr.matchAll(/silence_start: ([\d.]+)/g)].map(x => +x[1]);
  const last = m.length ? m[m.length - 1] : dur(i);
  ends[i] = last > dur(i) - 0.6 ? last : dur(i);
}
let t = 0.3; const lines = {}; const out = [];
scenes.forEach(([id, ls], si) => {
  if (si > 0) t += 0.35; // extra breath at a scene change
  const start = si === 0 ? 0 : +(t - 0.5).toFixed(2);
  ls.forEach(i => { lines[i] = +t.toFixed(2); t += ends[i] + 0.65; });
  out.push({ id, start, lines: ls });
});
out.forEach((s, i) => { s.end = i < out.length - 1 ? out[i + 1].start : +(t + 2.6).toFixed(2); s.duration = +(s.end - s.start).toFixed(2); });
const total = out[out.length - 1].end;
fs.writeFileSync('assets/vo/layout.json', JSON.stringify({ total, lines, ends, scenes: out }, null, 1));
const inputs = [], filters = [], labels = [];
for (let i = 1; i <= 22; i++) { inputs.push('-i', `assets/vo/l${i}.mp3`); filters.push(`[${i - 1}]adelay=${Math.round(lines[i] * 1000)}:all=1[a${i}]`); labels.push(`[a${i}]`); }
execFileSync('ffmpeg', ['-y', '-v', 'error', ...inputs, '-filter_complex', `${filters.join(';')};${labels.join('')}amix=inputs=22:normalize=0,apad=whole_dur=${total}`, '-ar', '44100', 'assets/voiceover.wav']);
console.log('total', total); out.forEach(s => console.log(s.id, s.start, s.duration, s.lines.map(i => `${i}@${lines[i]}`).join(' ')));
