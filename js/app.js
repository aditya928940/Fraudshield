// FraudShield app logic: language switch, voice, result card, upload, scam cards, pop-ups.
// Needs (loaded before this file): data/demos.js, data/scams.js, data/legal.js, i18n.js

const $ = id => document.getElementById(id);
const norm = s => s.replace(/\s+/g, ' ').trim();
const esc = str => String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const dropzone = $('dropzone'), fileInput = $('file-input'), previewPanel = $('preview-panel');
const previewFilename = $('preview-filename'), previewImg = $('preview-img'), clearBtn = $('clear-preview-btn');
const analyzeBtn = $('analyze-btn'), pasteBtn = $('paste-btn'), verdictCard = $('verdict-card');
const sampleList = $('sample-list'), flagLegend = $('flag-legend');
const langBtns = document.querySelectorAll('.lang-btn');

let lang = 'en';
try { const saved = localStorage.getItem('fs_lang'); if (saved === 'en' || saved === 'hn' || saved === 'hi') lang = saved; } catch (e) {}
let current = null;      // { key, isUploaded }
let speakMap = {};

const flagFor = score => FLAGS.find(f => score <= f.max) || FLAGS[FLAGS.length - 1];

// ----- small pop-up message -----
function toast(msg) {
  let t = $('fs-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'fs-toast';
    t.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-inverse-surface text-inverse-on-surface px-4 py-2 rounded-lg shadow-lg font-label-lg text-label-lg transition-opacity';
    t.style.opacity = '0';
    t.style.pointerEvents = 'none';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t._h);
  t._h = setTimeout(() => { t.style.opacity = '0'; }, 2800);
}

// ----- translate the static text already on the page -----
const SKIP = 'script,style,.scam-card,#verdict-factors,#verdict-explanation,#sample-list,#flag-legend,#lang-switch,#risk-meter';
const tracked = [];
(function collectText() {
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
  let n;
  while ((n = w.nextNode())) {
    const p = n.parentElement;
    if (!p || p.closest(SKIP)) continue;
    const key = norm(n.nodeValue);
    if (!key || !UI[key]) continue;
    const m = n.nodeValue.match(/^(\s*)([\s\S]*?)(\s*)$/);
    tracked.push({ n, key, lead: m[1], trail: m[3] });
  }
})();

function applyStatic() {
  tracked.forEach(t => {
    const text = lang === 'en' ? t.key : UI[t.key][lang === 'hn' ? 0 : 1];
    t.n.nodeValue = t.lead + text + t.trail;
  });
}

// ----- voice (text to speech) -----
const synth = ('speechSynthesis' in window) ? window.speechSynthesis : null;
let voices = [];
if (synth) {
  const loadVoices = () => { voices = synth.getVoices() || []; };
  loadVoices();
  synth.onvoiceschanged = loadVoices;
}
function pickVoice(l) {
  const want = l === 'hi' ? ['hi-in'] : ['en-in', 'en-gb', 'en-us'];
  const clean = v => (v.lang || '').replace('_', '-').toLowerCase();
  for (const w of want) { const v = voices.find(v => clean(v) === w); if (v) return v; }
  return voices.find(v => clean(v).startsWith(l === 'hi' ? 'hi' : 'en')) || null;
}
let activeBtn = null, speakToken = 0, speakLang = lang;
function setBtnState(btn, on) {
  if (!btn) return;
  btn.classList.toggle('speaking', on);
  const ic = btn.querySelector('.material-symbols-outlined');
  if (ic) ic.textContent = on ? 'stop_circle' : 'volume_up';
  const lb = btn.querySelector('.speak-label');
  if (lb) lb.textContent = on ? STR[lang].stop : STR[lang].listenAll;
}
function stopSpeech() {
  speakToken++;
  if (synth) synth.cancel();
  if (activeBtn) { setBtnState(activeBtn, false); activeBtn = null; }
}
function speak(chunks, btn) {
  if (!synth) { toast(STR[lang].noApi); return; }
  if (activeBtn === btn) { stopSpeech(); return; }
  stopSpeech();
  if (speakLang === 'hi' && voices.length && !pickVoice('hi')) { toast(STR.hi.noVoice); return; }
  const token = speakToken;
  const queue = chunks.filter(Boolean);
  let i = 0;
  activeBtn = btn;
  setBtnState(btn, true);
  const finish = () => { if (token === speakToken) { setBtnState(btn, false); activeBtn = null; } };
  const next = () => {
    if (token !== speakToken) return;
    if (i >= queue.length) { finish(); return; }
    const u = new SpeechSynthesisUtterance(queue[i++]);
    u.lang = speakLang === 'hi' ? 'hi-IN' : 'en-IN';
    const v = pickVoice(speakLang);
    if (v) u.voice = v;
    u.rate = 0.95;
    u.onend = next;
    u.onerror = finish;
    synth.speak(u);
  };
  setTimeout(next, 80);
}
const speakBtn = id => synth
  ? `<button type="button" class="speak-btn" data-speak="${id}" aria-label="${esc(STR[lang].listen)}" title="${esc(STR[lang].listen)}"><span class="material-symbols-outlined text-[16px]">volume_up</span></button>`
  : '';

// ----- result card -----
function meterHtml(score, f) {
  const segs = FLAGS.map(x => `<div style="flex:1;background:${x.bar};opacity:${x.key === f.key ? 1 : 0.28}"></div>`).join('');
  const lbls = FLAGS.map(x => `<div style="flex:1;text-align:center;color:${x.key === f.key ? x.color : '#6d7a77'};font-weight:${x.key === f.key ? 800 : 600}">${esc(x.short[lang])}<br><span style="font-weight:500">${x.min}–${x.max}</span></div>`).join('');
  const pos = Math.min(97, Math.max(3, score));
  return `<div style="position:relative;padding-top:24px">
    <div style="position:absolute;top:0;left:${pos}%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:1px;color:${f.color};font-weight:800;font-size:12px;line-height:14px">
      <span>${score}</span><span style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid ${f.color}"></span>
    </div>
    <div style="display:flex;height:12px;border-radius:9999px;overflow:hidden">${segs}</div>
    <div style="display:flex;font-size:10px;margin-top:5px;line-height:13px">${lbls}</div>
  </div>`;
}

// The data behind the card: a demo, or a real AI result (which may not be translated into every language yet)
function view() {
  const d = current.ai ? current.data : DEMOS.find(x => x.id === current.key);
  const ul = d[lang] ? lang : (d._base || 'en');
  return { d, L: d[ul], ul };
}
function renderVerdict() {
  if (!current) return;
  stopSpeech();
  const { d, L, ul } = view();
  speakLang = ul;
  const S = STR[lang], f = flagFor(d.score), safe = f.key === 'safe';
  speakMap = {};

  verdictCard.style.borderColor = f.color;
  const banner = $('flag-banner');
  banner.style.background = f.soft; banner.style.color = f.color; banner.style.border = `1px solid ${f.color}`;
  $('flag-banner-title').textContent = `${f.flag[lang]} • ${f.short[lang]}`;
  $('flag-banner-sub').textContent = f.sub[lang];
  const ic = $('verdict-icon-container');
  ic.style.background = f.soft; ic.style.color = f.color;
  $('verdict-icon').textContent = f.icon;
  const badge = $('verdict-badge');
  badge.textContent = f.short[lang]; badge.style.background = f.color;
  $('verdict-title').textContent = L.ti;
  speakMap.title = [`${f.flag[lang]}. ${f.sub[lang]}`, L.ti, S.scoreSay(d.score)];
  $('verdict-title-speak').innerHTML = speakBtn('title');
  const sb = $('verdict-score-box'); sb.style.borderColor = f.color; sb.style.background = f.soft;
  const sc = $('verdict-score'); sc.textContent = d.score + '/100'; sc.style.color = f.color;
  $('risk-meter').innerHTML = meterHtml(d.score, f);

  // 3 small cards
  $('verdict-factors').innerHTML = L.f.map((c, i) => {
    const last = i === 2;
    const col = last ? '#0d9488' : f.color;
    const icon = last ? 'shield' : (d.fi[i] || 'info');
    return `<div class="bg-surface-container-lowest p-space-sm rounded-lg border border-surface-container" style="border-left:4px solid ${col}">
      <span class="font-label-sm text-label-sm font-bold flex items-center gap-1" style="color:${col}"><span class="material-symbols-outlined text-[15px]">${icon}</span> ${esc(c[0])}</span>
      <p class="font-body-sm text-body-sm text-on-surface font-bold mt-1 break-words">${esc(c[1])}</p>
      <p class="font-label-sm text-label-sm text-on-surface-variant">${esc(c[2])}</p></div>`;
  }).join('');

  // explanation points
  const points = L.x.map((t, i) => {
    const id = 'p' + i;
    speakMap[id] = [`${t[0]}.`, t[1]];
    const mark = safe ? '<span class="material-symbols-outlined" style="font-size:15px">check</span>' : (i + 1);
    return `<div class="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-space-md">
      <div class="flex items-start justify-between gap-2 mb-1">
        <div class="flex items-center gap-2">
          <span class="w-6 h-6 rounded-full text-white font-label-md text-label-md font-bold flex items-center justify-center flex-shrink-0" style="background:${f.color}">${mark}</span>
          <h4 class="font-label-lg text-label-lg font-bold text-on-surface">${esc(t[0])}</h4>
        </div>${speakBtn(id)}
      </div>
      ${d.q[i] ? `<p class="sms-font text-[13px] leading-relaxed rounded px-2 py-1 my-2 break-words" style="color:${f.color};background:${f.soft}">"${esc(d.q[i])}"</p>` : ''}
      <p class="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">${esc(t[1])}</p></div>`;
  }).join('');

  const todoHead = safe ? S.todoSafe : S.todo;
  speakMap.steps = [todoHead, ...L.s];
  speakMap.rule = [`${S.remember} ${L.r}`];
  speakMap.all = [`${f.flag[lang]}. ${f.sub[lang]}`, S.scoreSay(d.score), L.ti, safe ? S.introSafe : S.intro,
    ...L.x.flatMap(t => [`${t[0]}.`, t[1]]), todoHead, ...L.s, `${S.remember} ${L.r}`];

  const steps = L.s.map(st => `<li class="flex items-start gap-2 font-body-sm text-body-sm text-on-surface"><span class="material-symbols-outlined text-primary text-[16px] mt-0.5 flex-shrink-0">check_circle</span><span>${esc(st)}</span></li>`).join('');

  $('verdict-explanation').innerHTML = `
    <div class="flex items-start justify-between gap-2 mb-space-sm">
      <div>
        <span class="font-label-sm text-label-sm font-bold uppercase tracking-wider" style="color:${f.color}">${esc(safe ? S.headSafe : S.head)}</span>
        <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">${esc(safe ? S.introSafe : S.intro)}</p>
      </div>
      ${synth ? `<button type="button" class="speak-btn speak-all" data-speak="all" aria-label="${esc(S.listenAll)}"><span class="material-symbols-outlined text-[16px]">volume_up</span><span class="speak-label">${esc(S.listenAll)}</span></button>` : ''}
    </div>
    <div class="p-space-sm rounded-lg bg-surface border border-outline-variant/30 sms-font text-[13px] leading-relaxed text-on-surface-variant mb-space-sm break-words">${esc(d.msg)}</div>
    <div class="grid grid-cols-1 md:grid-cols-${L.x.length >= 3 ? 3 : 2} gap-space-sm mb-space-md">${points}</div>
    <div class="bg-surface-container-lowest border border-primary/30 rounded-lg p-space-md mb-space-sm">
      <div class="flex items-center justify-between gap-2 mb-2">
        <h4 class="font-label-lg text-label-lg font-bold text-on-surface flex items-center gap-1"><span class="material-symbols-outlined text-primary text-[18px]">lightbulb</span> ${esc(todoHead)}</h4>${speakBtn('steps')}
      </div>
      <ul class="space-y-1.5">${steps}</ul>
    </div>
    <div class="flex items-start justify-between gap-space-xs bg-primary/10 rounded-lg p-space-sm">
      <div class="flex items-start gap-space-xs"><span class="material-symbols-outlined text-primary text-[18px] flex-shrink-0 mt-0.5">shield</span>
      <p class="font-label-sm text-label-sm text-on-surface"><strong>${esc(S.remember)}</strong> ${esc(L.r)}</p></div>${speakBtn('rule')}
    </div>
    ${safe ? '' : `<p class="font-label-sm text-label-sm text-on-surface-variant mt-space-sm">${esc(S.hotline)} <a class="text-primary underline" href="https://cybercrime.gov.in" target="_blank" rel="noopener">cybercrime.gov.in</a></p>`}
    <p class="font-label-sm text-label-sm text-on-surface-variant mt-1 italic">${esc(current.ai ? (current.mock ? S.mockNote : S.aiNote) : S.demo)}</p>
    ${ul !== lang ? `<p class="font-label-sm text-label-sm text-on-surface-variant mt-1 italic">${esc(S.translating)}</p>` : ''}`;
  const vt = $('verdict-time');
  if (vt) vt.textContent = current.ai ? S.analyzedIn(current.secs.toFixed(1)) : S.exampleTag;
}

verdictCard.addEventListener('click', e => {
  const b = e.target.closest('.speak-btn');
  if (!b) return;
  speak(speakMap[b.dataset.speak] || [], b);
});

// ----- sample buttons + flag legend -----
function renderSamples() {
  sampleList.innerHTML = DEMOS.map(d => {
    const f = flagFor(d.score);
    return `<button class="sample-btn px-space-md py-1.5 rounded-full bg-surface-container hover:bg-primary/10 text-on-surface hover:text-primary font-label-sm text-label-sm transition-all duration-200 flex items-center gap-1.5 border border-outline-variant/30" data-id="${d.id}" type="button"><span style="width:10px;height:10px;border-radius:9999px;background:${f.bar};display:inline-block;flex-shrink:0"></span><span>${d.emoji} ${esc(d.lbl[lang])}</span></button>`;
  }).join('');
}
function renderLegend() {
  flagLegend.innerHTML = FLAGS.map(f => `<span class="inline-flex items-center gap-1"><span style="width:10px;height:10px;border-radius:9999px;background:${f.bar};display:inline-block"></span><b style="color:${f.color}">${esc(f.short[lang])}</b> ${f.min}–${f.max}</span>`).join('');
}
sampleList.addEventListener('click', e => {
  const b = e.target.closest('.sample-btn');
  if (!b) return;
  const d = DEMOS.find(x => x.id === b.dataset.id);
  previewPanel.classList.remove('hidden');
  previewPanel.classList.add('flex');
  previewFilename.textContent = d.file;
  setMode('image'); cancelAI(); hideError(); currentFile = null; previewImg.removeAttribute('src');
  simulateAnalysis(d.id);
});

// ----- language switch -----
function setLang(l) {
  lang = l;
  try { localStorage.setItem('fs_lang', l); } catch (e) {}
  document.documentElement.lang = l === 'hi' ? 'hi' : (l === 'hn' ? 'en-IN' : 'en');
  document.title = TITLES[l];
  langBtns.forEach(b => { const on = b.dataset.lang === l; b.classList.toggle('active', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
  stopSpeech();
  applyStatic();
  renderSamples();
  renderLegend();
  renderScams();
  renderLegal();
  textInput.placeholder = STR[l].ph;
  if (current && !verdictCard.classList.contains('hidden')) { renderVerdict(); ensureLang(l); }
  if (aiErr && !aiErr.classList.contains('hidden')) hideError();
}
langBtns.forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

// ----- analyse button (busy state) -----
const busyEl = document.createElement('span');
busyEl.className = 'hidden';
analyzeBtn.appendChild(busyEl);
function setBusy(on) {
  const [iconEl, labelEl] = analyzeBtn.children;
  analyzeBtn.disabled = on;
  iconEl.textContent = on ? 'progress_activity' : 'verified_user';
  iconEl.classList.toggle('animate-spin', on);
  labelEl.classList.toggle('hidden', on);
  busyEl.classList.toggle('hidden', !on);
  busyEl.textContent = STR[lang].checking;
}
let lastSampleKey = null;
function simulateAnalysis(key) {
  lastSampleKey = key;
  current = { key: key || 'bank', isUploaded: false };
  setBusy(true);
  setTimeout(() => {
    setBusy(false);
    renderVerdict();
    verdictCard.classList.remove('hidden');
    verdictCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 750);
}
analyzeBtn.addEventListener('click', () => {
  if (currentFile) runAI();
  else if (lastSampleKey) simulateAnalysis(lastSampleKey);
  else fileInput.click();
});

// ----- real AI analysis -----
let aiToken = 0, aiCtl = null;
const aiErr = $('ai-error');
function hideError() { if (aiErr) aiErr.classList.add('hidden'); }
function showError(code) {
  const E = STR[lang].err;
  $('ai-error-text').textContent = E[code] || E.generic;
  aiErr.classList.remove('hidden');
  verdictCard.classList.add('hidden');
  aiErr.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function cancelAI() { aiToken++; if (aiCtl) { aiCtl.abort(); aiCtl = null; } setBusy(false); }
async function runAI(text) {
  if (typeof text !== 'string' && !currentFile) return;
  cancelAI(); stopSpeech(); hideError();
  const my = aiToken, t0 = Date.now();
  aiCtl = new AbortController();
  setBusy(true);
  try {
    const r = typeof text === 'string' ? await aiAnalyzeText(text, lang, aiCtl.signal) : await aiAnalyze(currentFile, lang, aiCtl.signal);
    if (my !== aiToken) return;
    current = { key: 'ai', ai: true, mock: r.mock, secs: (Date.now() - t0) / 1000,
      data: { id: 'ai', score: r.score, msg: r.message, q: r.quotes, fi: r.icons, _base: lang, [lang]: r.fields } };
    renderVerdict();
    verdictCard.classList.remove('hidden');
    verdictCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (e) {
    if (my !== aiToken || e.code === 'cancel') return;
    showError(e.code);
  } finally { if (my === aiToken) { setBusy(false); aiCtl = null; } }
}
// Other languages are translated only when the user switches to them (saves free quota)
async function ensureLang(l) {
  if (!current || !current.ai) return;
  const d = current.data;
  if (d[l]) return;
  d._pending = d._pending || {};
  if (d._pending[l]) return;
  d._pending[l] = 1;
  try {
    d[l] = await aiTranslate(d[d._base], l);
    if (current && current.data === d && lang === l) renderVerdict();
  } catch (e) { toast(STR[lang].transFail); }
  finally { delete d._pending[l]; }
}
const retryBtn = $('ai-retry-btn');
let lastText = null;
if (retryBtn) retryBtn.addEventListener('click', () => (lastText !== null && !currentFile) ? runAI(lastText) : runAI());

// ----- tabs: screenshot / paste text -----
const modeImage = $('mode-image'), modeText = $('mode-text'), textInput = $('text-input'), textCount = $('text-count');
function setMode(m) {
  const img = m === 'image';
  modeImage.classList.toggle('hidden', !img); modeText.classList.toggle('hidden', img);
  [['tab-image', img], ['tab-text', !img]].forEach(([id, on]) => {
    const b = $(id); b.setAttribute('aria-selected', on ? 'true' : 'false');
    b.classList.toggle('bg-primary', on); b.classList.toggle('text-on-primary', on); b.classList.toggle('text-on-surface-variant', !on);
  });
  if (!img) textInput.focus();
}
$('tab-image').addEventListener('click', () => setMode('image'));
$('tab-text').addEventListener('click', () => setMode('text'));
textInput.addEventListener('input', () => { textCount.textContent = textInput.value.length + ' / 3000'; });
$('text-clear-btn').addEventListener('click', () => { textInput.value = ''; textCount.textContent = '0 / 3000'; cancelAI(); hideError(); verdictCard.classList.add('hidden'); stopSpeech(); textInput.focus(); });
$('text-analyze-btn').addEventListener('click', () => {
  const t = textInput.value.trim();
  if (t.length < 5) { toast(STR[lang].tshort); textInput.focus(); return; }
  lastText = t; currentFile = null; lastSampleKey = null;
  runAI(t);
});

// ----- copy report -----
$('copy-report-btn').addEventListener('click', () => {
  if (!current) return;
  const { d, L } = view(), S = STR[lang], f = flagFor(d.score);
  const text = [`${S.repTitle}`, `${f.flag[lang]} - ${f.short[lang]}`, `${S.score}: ${d.score}/100`, `${S.msg}: ${d.msg}`, '',
    `${S.whatDid}:`, ...L.x.map((t, i) => `${i + 1}. ${t[0]}: ${t[1]}`), '', `${S.whatDo}:`, ...L.s.map((st, i) => `${i + 1}. ${st}`), '', `${S.remember} ${L.r}`].join('\n');
  const done = () => toast(S.copied);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
  } else { fallbackCopy(text, done); }
});
function fallbackCopy(text, done) {
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); done(); } catch (e) {}
  document.body.removeChild(ta);
}
$('scan-another-btn').addEventListener('click', () => { stopSpeech(); verdictCard.classList.add('hidden'); });

// ----- upload / drag-drop / paste (same as before) -----
let currentFile = null;
['dragenter', 'dragover'].forEach(ev => dropzone.addEventListener(ev, e => { e.preventDefault(); dropzone.classList.add('bg-primary-fixed-dim/20', 'border-primary'); }));
['dragleave', 'drop'].forEach(ev => dropzone.addEventListener(ev, e => { e.preventDefault(); dropzone.classList.remove('bg-primary-fixed-dim/20', 'border-primary'); }));
dropzone.addEventListener('drop', e => { const files = e.dataTransfer.files; if (files.length > 0) handleFileSelect(files[0]); });
dropzone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', e => { if (e.target.files.length > 0) handleFileSelect(e.target.files[0]); });

function handleFileSelect(file) {
  if (!file.type.startsWith('image/')) { alert('Please upload an image file (PNG, JPG, WEBP).'); return; }
  setMode('image'); cancelAI(); hideError(); lastSampleKey = null; lastText = null;
  currentFile = file;
  previewFilename.textContent = file.name;
  previewPanel.classList.remove('hidden');
  previewPanel.classList.add('flex');
  const reader = new FileReader();
  reader.onload = e => { previewImg.src = e.target.result; runAI(); };
  reader.readAsDataURL(file);
}
clearBtn.addEventListener('click', e => {
  e.stopPropagation();
  cancelAI(); hideError(); lastSampleKey = null;
  currentFile = null; fileInput.value = '';
  previewPanel.classList.add('hidden'); previewPanel.classList.remove('flex');
  verdictCard.classList.add('hidden');
  stopSpeech();
});
window.addEventListener('paste', e => {
  const items = (e.clipboardData || e.originalEvent.clipboardData).items;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      const blob = items[i].getAsFile();
      handleFileSelect(new File([blob], 'clipboard_screenshot.png', { type: blob.type }));
      break;
    }
  }
});
pasteBtn.addEventListener('click', async () => {
  try {
    const clipboardItems = await navigator.clipboard.read();
    for (const item of clipboardItems) {
      const imageType = item.types.find(type => type.startsWith('image/'));
      if (imageType) {
        const blob = await item.getType(imageType);
        handleFileSelect(new File([blob], 'pasted_screenshot.png', { type: blob.type }));
        return;
      }
    }
    alert('No image found on your clipboard. Take a screenshot (Win+Shift+S or Cmd+Shift+4) and click Paste.');
  } catch (err) {
    alert('Press Ctrl+V (or Cmd+V on Mac) anywhere on this page to paste your screenshot.');
  }
});


// ----- Common Scams: render cards + filter tabs -----
let scamFilter = 'all';
const scamGrid = $('scam-cards-grid');
const filterTabs = document.querySelectorAll('.scam-tab-btn');
const tabName = key => lang === 'en' ? key : UI[key][lang === 'hn' ? 0 : 1];

function renderScams() {
  const L = SCAM_LBL[lang];
  scamGrid.innerHTML = SCAMS.map(s => {
    const hide = (scamFilter === 'all' || s.cats.split(' ').includes(scamFilter)) ? '' : ' hidden';
    return `<div class="scam-card bg-surface-container-lowest rounded-xl p-space-lg border border-surface-container shadow-sm hover:shadow-md transition-all flex flex-col justify-between${hide}" data-category="${s.cats}">
<div>
<div class="flex items-center justify-between mb-space-sm gap-2">
<span class="px-2.5 py-0.5 rounded-full ${s.cls} font-label-sm text-label-sm font-bold flex items-center gap-1"><span class="material-symbols-outlined text-[13px]">${s.icon}</span> ${esc(s.badge[lang])}</span>
<span class="font-label-sm text-label-sm text-on-surface-variant font-medium text-right">${esc(tabName(s.cat))}</span>
</div>
<h3 class="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs">${esc(s.title[lang])}</h3>
<div class="p-space-sm rounded-lg bg-surface border border-outline-variant/30 sms-font text-[13px] leading-relaxed text-on-surface-variant mb-space-md break-words">"${esc(s.msg[lang])}"</div>
<div class="space-y-1.5 mb-space-md">
<div class="text-[12px]"><strong class="text-error font-bold">${esc(L[0])}</strong> ${esc(s.trick[lang])}</div>
<div class="text-[12px]"><strong class="text-on-surface font-bold">${esc(L[1])}</strong> ${esc(s.warn[lang])}</div>
</div>
</div>
<div class="pt-space-sm bg-surface-container-low p-space-sm rounded-lg border border-surface-container">
<div class="flex items-start gap-space-xs">
<span class="material-symbols-outlined text-primary text-[18px] flex-shrink-0 mt-0.5">shield</span>
<p class="font-label-sm text-label-sm text-on-surface-variant"><strong class="text-on-surface">${esc(L[2])}</strong> ${esc(s.rule[lang])}</p>
</div>
</div>
</div>`;
  }).join('');
}

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => { t.classList.remove('bg-primary', 'text-on-primary', 'active'); t.classList.add('bg-surface-container-low', 'text-on-surface-variant'); });
    tab.classList.add('bg-primary', 'text-on-primary', 'active');
    tab.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
    scamFilter = tab.getAttribute('data-category');
    renderScams();
  });
});


// ----- Privacy Guarantee + Terms of Service pop-up -----
let legalKey = null, legalOpener = null;
const legalModal = document.createElement('div');
legalModal.id = 'legal-modal';
legalModal.className = 'fixed inset-0 z-[70] hidden items-center justify-center p-4';
legalModal.setAttribute('role', 'dialog');
legalModal.setAttribute('aria-modal', 'true');
legalModal.setAttribute('aria-labelledby', 'legal-title');
document.body.appendChild(legalModal);

function renderLegal() {
  if (!legalKey) return;
  const d = LEGAL[legalKey];
  legalModal.innerHTML = `
    <div class="absolute inset-0 bg-black/50" data-close="1"></div>
    <div class="relative bg-surface-container-lowest rounded-xl shadow-xl max-w-xl w-full max-h-[85vh] overflow-y-auto border border-surface-container p-space-lg">
      <div class="flex items-start justify-between gap-3 mb-space-sm">
        <div class="flex items-center gap-2 text-primary">
          <span class="material-symbols-outlined text-[24px]">${d.icon}</span>
          <h3 id="legal-title" class="font-headline-sm text-headline-sm text-on-surface font-bold">${esc(d.title[lang])}</h3>
        </div>
        <button type="button" id="legal-close" data-close="1" aria-label="${esc(LEGAL_CLOSE[lang])}" class="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container flex-shrink-0">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
      <p class="font-body-sm text-body-sm text-on-surface-variant mb-space-md">${esc(d.intro[lang])}</p>
      <ol class="space-y-3 mb-space-md">${d.pts[lang].map((p, i) => `
        <li class="flex items-start gap-3">
          <span class="w-6 h-6 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold flex items-center justify-center flex-shrink-0">${i + 1}</span>
          <div><p class="font-label-lg text-label-lg font-bold text-on-surface">${esc(p[0])}</p><p class="font-body-sm text-body-sm text-on-surface-variant">${esc(p[1])}</p></div>
        </li>`).join('')}
      </ol>
      <p class="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-low rounded-lg border border-surface-container p-space-sm">${esc(d.note[lang])}</p>
      <div class="mt-space-md flex justify-end"><button type="button" data-close="1" class="px-space-lg py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-primary/90">${esc(LEGAL_CLOSE[lang])}</button></div>
    </div>`;
}
function openLegal(key, opener) {
  legalKey = key; legalOpener = opener || null;
  renderLegal();
  legalModal.classList.remove('hidden'); legalModal.classList.add('flex');
  document.body.style.overflow = 'hidden';
  const c = $('legal-close'); if (c) c.focus();
}
function closeLegal() {
  legalKey = null;
  legalModal.classList.add('hidden'); legalModal.classList.remove('flex');
  document.body.style.overflow = '';
  if (legalOpener && legalOpener.focus) legalOpener.focus();
  if (location.hash === '#privacy' || location.hash === '#terms') history.replaceState(null, '', location.pathname + location.search);
}
legalModal.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeLegal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && legalKey) closeLegal(); });
document.querySelectorAll('a[href="#privacy"], a[href="#terms"]').forEach(a => {
  a.addEventListener('click', e => { e.preventDefault(); openLegal(a.getAttribute('href').slice(1), a); });
});
if (location.hash === '#privacy' || location.hash === '#terms') openLegal(location.hash.slice(1));


// ----- start -----
setLang(lang);
