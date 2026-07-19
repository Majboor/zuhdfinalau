// Cloudflare Pages Function: email an FAQ question to the Zuhd team.
//
// Required environment variables (Cloudflare Pages > Settings > Environment variables):
//   EMAIL_API_URL — Google Apps Script web app URL (mail sender)
//   EMAIL_API_KEY — its API key
//   ASK_TO        — optional destination inbox, defaults to info@zuhd.store

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: JSON_HEADERS });
}

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }

  const name = clean(body.name, 100);
  const email = clean(body.email, 150);
  const question = clean(body.question, 3000);

  if (!question || question.length < 5) {
    return json({ error: 'Please write your question (at least a few words).' }, 400);
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Please provide a valid email address so we can reply.' }, 400);
  }

  if (!env.EMAIL_API_URL || !env.EMAIL_API_KEY) {
    return json({ error: 'The question box is temporarily unavailable. Please email info@zuhd.store directly.' }, 503);
  }

  const to = env.ASK_TO || 'info@zuhd.store';
  const payload = {
    apiKey: env.EMAIL_API_KEY,
    action: 'sendEmail',
    to,
    subject: `New question from zuhd.au FAQ${name ? ' — ' + name : ''}`,
    body:
      `A new question was submitted on the zuhd.au FAQ page.\n\n` +
      `From: ${name || '(no name given)'} <${email}>\n\n` +
      `Question:\n${question}\n\n—\nReply directly to the asker at ${email}.`,
  };

  // Apps Script web apps require text/plain to avoid CORS preflight issues
  const res = await fetch(env.EMAIL_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload),
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    /* Apps Script sometimes returns HTML on error */
  }

  if (!res.ok || !data.ok) {
    console.log('Ask email failed:', res.status, JSON.stringify(data).slice(0, 300));
    return json({ error: 'Could not send your question right now. Please email info@zuhd.store directly.' }, 502);
  }

  return json({ ok: true, message: 'Your question has been sent. We will reply to your email, in shaa Allah.' });
}

function clean(v, max) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: JSON_HEADERS });
}
