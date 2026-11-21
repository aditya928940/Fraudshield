// Tiny web server so FraudShield can run on Render (or any Node host). No packages needed.
// - serves the website files
// - runs the same two functions Netlify uses: /.netlify/functions/analyze and /.netlify/functions/speak
const http = require('http');
const fs = require('fs');
const path = require('path');

const analyze = require('./netlify/functions/analyze.js').handler;
const speak = require('./netlify/functions/speak.js').handler;
const FUNCTIONS = { '/.netlify/functions/analyze': analyze, '/.netlify/functions/speak': speak };

const ROOT = __dirname;
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon' };
const MAX_BODY = 6 * 1024 * 1024;

function serveFile(res, rel) {
  // only the website itself is public: index.html, css/ and js/. Never server code, .env, etc.
  const ok = rel === 'index.html' || /^(css|js)\/[\w./-]+$/.test(rel);
  const file = path.join(ROOT, rel);
  if (!ok || rel.includes('..') || !file.startsWith(ROOT)) { res.writeHead(404); return res.end('Not found'); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  const p = url.pathname;

  if (p === '/healthz') { res.writeHead(200, { 'Content-Type': 'text/plain' }); return res.end('ok'); }

  const fn = FUNCTIONS[p];
  if (fn) {
    const chunks = []; let size = 0, dead = false;
    req.on('data', c => { size += c.length; if (size > MAX_BODY) { dead = true; res.writeHead(413, { 'Content-Type': 'application/json' }); res.end('{"ok":false,"error":"too_large"}'); req.destroy(); } else chunks.push(c); });
    req.on('end', async () => {
      if (dead) return;
      try {
        const r = await fn({ httpMethod: req.method, queryStringParameters: Object.fromEntries(url.searchParams), headers: req.headers, body: Buffer.concat(chunks).toString('utf8'), isBase64Encoded: false });
        res.writeHead(r.statusCode || 200, r.headers || {});
        res.end(r.isBase64Encoded ? Buffer.from(r.body || '', 'base64') : (r.body || ''));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' }); res.end('{"ok":false,"error":"upstream"}');
      }
    });
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
  serveFile(res, p === '/' ? 'index.html' : decodeURIComponent(p).replace(/^\/+/, ''));
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, '0.0.0.0', () => console.log('FraudShield running on port ' + PORT));
