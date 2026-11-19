// Google Agenda-koppeling voor Kitoko Salon (Vercel serverless).
// Env vars (Vercel → Settings → Environment Variables):
//   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
// De refresh token staat versleuteld in een HttpOnly-cookie op Kate's toestel; niets wordt op de server bewaard.
const crypto = require('crypto');

const CID = process.env.GOOGLE_CLIENT_ID || '';
const SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const COOKIE = 'kgc';
const KEY = crypto.createHash('sha256').update('kitoko-gcal|' + SECRET).digest();

function seal(txt) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', KEY, iv);
  const enc = Buffer.concat([c.update(txt, 'utf8'), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), enc]).toString('base64url');
}
function open(b64) {
  try {
    const raw = Buffer.from(b64, 'base64url');
    const d = crypto.createDecipheriv('aes-256-gcm', KEY, raw.subarray(0, 12));
    d.setAuthTag(raw.subarray(12, 28));
    return Buffer.concat([d.update(raw.subarray(28)), d.final()]).toString('utf8');
  } catch (e) { return null; }
}
function readCookie(req) {
  const m = String(req.headers.cookie || '').match(new RegExp('(?:^|;\\s*)' + COOKIE + '=([^;]+)'));
  return m ? m[1] : null;
}
function setCookie(res, val, maxAge) {
  res.setHeader('Set-Cookie', `${COOKIE}=${val}; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`);
}
async function google(params) {
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: CID, client_secret: SECRET, ...params }),
  });
  return { ok: r.ok, data: await r.json().catch(() => ({})) };
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const a = (req.query && req.query.a) || '';
  if (a === 'config') return res.status(200).json({ clientId: CID && SECRET ? CID : null });
  if (!CID || !SECRET) return res.status(503).json({ error: 'not_configured' });

  // Alleen aanroepen vanaf de eigen site (CSRF-bescherming bovenop SameSite=Strict)
  const origin = req.headers.origin;
  if (req.method !== 'GET' && origin && new URL(origin).host !== req.headers.host) return res.status(403).json({ error: 'origin' });

  if (a === 'connect' && req.method === 'POST') {
    const code = req.body && req.body.code;
    if (!code) return res.status(400).json({ error: 'code' });
    const { ok, data } = await google({ code, grant_type: 'authorization_code', redirect_uri: 'postmessage' });
    if (!ok) return res.status(400).json({ error: data.error || 'exchange_failed' });
    if (data.refresh_token) setCookie(res, seal(data.refresh_token), 60 * 60 * 24 * 400);
    return res.status(200).json({ access_token: data.access_token, expires_in: data.expires_in });
  }

  if (a === 'token') {
    const c = readCookie(req);
    const rt = c && open(c);
    if (!rt) return res.status(401).json({ error: 'no_session' });
    const { ok, data } = await google({ refresh_token: rt, grant_type: 'refresh_token' });
    if (!ok) {
      if (data.error === 'invalid_grant') setCookie(res, '', 0);
      return res.status(401).json({ error: data.error || 'refresh_failed' });
    }
    return res.status(200).json({ access_token: data.access_token, expires_in: data.expires_in });
  }

  if (a === 'logout' && req.method === 'POST') {
    const c = readCookie(req);
    const rt = c && open(c);
    if (rt) await fetch('https://oauth2.googleapis.com/revoke?token=' + encodeURIComponent(rt), { method: 'POST' }).catch(() => {});
    setCookie(res, '', 0);
    return res.status(200).json({ ok: true });
  }

  res.status(404).json({ error: 'unknown' });
};
