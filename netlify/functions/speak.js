// FraudShield voice - server side. Text in, ElevenLabs voice (mp3) out.
// The ElevenLabs key lives ONLY here (env var ELEVENLABS_API_KEY).
//
// POST { text, lang:'en'|'hn'|'hi' }  -> audio/mpeg
// GET  ?health=1  -> key set? voice? model?      GET ?voices=1 -> voices you can use

const VOICE = () => process.env.ELEVEN_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // "Rachel" (a default ElevenLabs voice)
const MODEL = () => process.env.ELEVEN_MODEL || 'eleven_flash_v2_5';
const MAX_CHARS = 700; // keeps credits and response size small
const API = 'https://api.elevenlabs.io/v1';

const cors = () => ({
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
});
const json = (code, obj) => ({ statusCode: code, headers: Object.assign({ 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, cors()), body: JSON.stringify(obj) });

exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors(), body: '' };
    const key = process.env.ELEVENLABS_API_KEY;
    const q = event.queryStringParameters || {};

    if (event.httpMethod === 'GET') {
      if (q.health) return json(200, { ok: true, keySet: !!key, voice: VOICE(), model: MODEL() });
      if (q.voices) {
        if (!key) return json(500, { ok: false, error: 'no_key' });
        const r = await fetch(API + '/voices', { headers: { 'xi-api-key': key } });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) return json(r.status, { ok: false, error: 'bad_key' });
        return json(200, { ok: true, voices: (j.voices || []).map(v => ({ id: v.voice_id, name: v.name })) });
      }
      return json(200, { ok: true, name: 'FraudShield voice function' });
    }
    if (event.httpMethod !== 'POST') return json(405, { ok: false, error: 'bad_request' });
    if (!key) return json(500, { ok: false, error: 'no_key' });

    let b; try { b = JSON.parse(event.body || ''); } catch (e) { return json(400, { ok: false, error: 'bad_request' }); }
    const text = typeof b.text === 'string' ? b.text.trim().slice(0, MAX_CHARS) : '';
    if (!text) return json(400, { ok: false, error: 'bad_request' });

    const body = { text, model_id: MODEL(), voice_settings: { stability: 0.5, similarity_boost: 0.75, speed: 0.95 } };
    // language_code works only on the v2.5 models; Hinglish (Roman letters) is left to auto-detect
    if (/v2_5/.test(MODEL()) && (b.lang === 'hi' || b.lang === 'en')) body.language_code = b.lang;

    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 9000);
    let res;
    try {
      res = await fetch(`${API}/text-to-speech/${encodeURIComponent(VOICE())}?output_format=mp3_44100_64`, {
        method: 'POST', signal: ctl.signal,
        headers: { 'Content-Type': 'application/json', 'xi-api-key': key, Accept: 'audio/mpeg' },
        body: JSON.stringify(body)
      });
    } catch (e) { return json(504, { ok: false, error: 'timeout' }); } finally { clearTimeout(timer); }

    if (!res.ok) {
      const t = await res.text().catch(() => '');
      const code = res.status === 401 ? 'bad_key' : res.status === 429 ? 'rate_limit' : /quota/i.test(t) ? 'quota' : 'upstream';
      return json(res.status === 401 ? 500 : 502, { ok: false, error: code, detail: t.slice(0, 200) });
    }
    const buf = Buffer.from(await res.arrayBuffer());
    return { statusCode: 200, isBase64Encoded: true, body: buf.toString('base64'), headers: Object.assign({ 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' }, cors()) };
  } catch (err) {
    return json(502, { ok: false, error: 'upstream' });
  }
};
