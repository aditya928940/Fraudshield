// Browser side of the AI check. Talks to the Netlify Function (the secret key is NOT here).
const AI_ENDPOINT = '/.netlify/functions/analyze'; // if the site is hosted elsewhere, put the full Netlify URL here
const AI_CLIENT_TIMEOUT = 28000;

// Shrink the screenshot so it uploads fast and stays under the size limit.
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      try {
        const MAX = 2000;
        let w = img.naturalWidth, h = img.naturalHeight;
        const k = Math.min(1, MAX / Math.max(w, h));
        w = Math.round(w * k); h = Math.round(h * k);
        let q = 0.82, b64 = '';
        const c = document.createElement('canvas');
        for (let i = 0; i < 4; i++) {
          c.width = w; c.height = h;
          const ctx = c.getContext('2d');
          ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          b64 = c.toDataURL('image/jpeg', q).split(',')[1];
          if (b64.length < 3.2 * 1024 * 1024) break;
          q -= 0.15; w = Math.round(w * 0.8); h = Math.round(h * 0.8);
        }
        resolve({ image: b64, mime: 'image/jpeg' });
      } catch (e) { reject(Object.assign(new Error('image'), { code: 'bad_image' })); }
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(Object.assign(new Error('image'), { code: 'bad_image' })); };
    img.src = url;
  });
}

async function aiPost(payload, outerSignal) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort('timeout'), AI_CLIENT_TIMEOUT);
  if (outerSignal) outerSignal.addEventListener('abort', () => ctl.abort('cancel'));
  let res, j;
  try {
    res = await fetch(AI_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: ctl.signal });
    const t = await res.text();
    try { j = JSON.parse(t); } catch (e) { j = null; }
  } catch (e) {
    if (outerSignal && outerSignal.aborted) throw Object.assign(new Error('cancel'), { code: 'cancel' });
    throw Object.assign(new Error('net'), { code: ctl.signal.aborted ? 'timeout' : 'network' });
  } finally { clearTimeout(timer); }
  // A static host (no Netlify function) answers 404 with an HTML page
  if (!j) throw Object.assign(new Error('nofn'), { code: res.status === 404 ? 'no_function' : 'upstream' });
  if (!j.ok) throw Object.assign(new Error(j.error || 'upstream'), { code: j.error || 'upstream' });
  return j;
}

// -> { score, message, quotes[3], icons[2], fields:{ti,f,x,s,r}, mock }
async function aiAnalyze(file, lang, signal) {
  const img = await compressImage(file);
  const j = await aiPost({ mode: 'analyze', lang, image: img.image, mime: img.mime }, signal);
  return Object.assign({ mock: !!j.mock }, j.result);
}
// -> { ti, f, x, s, r }
async function aiTranslate(fields, lang, signal) {
  const j = await aiPost({ mode: 'translate', lang, fields }, signal);
  return j.fields;
}
