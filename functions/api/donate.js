// Cloudflare Pages Function: create a Shopify draft order for a donation
// and return its invoice (payment) URL.
//
// Required environment variables (set in Cloudflare Pages > Settings > Environment variables):
//   SHOPIFY_ADMIN_TOKEN — Admin API access token WITH the write_draft_orders scope
//   SHOPIFY_STORE       — optional, defaults to zuhd-store.myshopify.com

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

  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount < 1 || amount > 100000) {
    return json({ error: 'Amount must be between 1 and 100,000.' }, 400);
  }

  if (!env.SHOPIFY_ADMIN_TOKEN) {
    return json({ error: 'Donations are temporarily unavailable. Please contact info@zuhd.au.' }, 503);
  }

  const store = env.SHOPIFY_STORE || 'zuhd-store.myshopify.com';
  const cause = typeof body.cause === 'string' && body.cause.trim()
    ? body.cause.trim().slice(0, 60)
    : '';

  const draftOrder = {
    draft_order: {
      line_items: [
        {
          title: cause ? `Donation — ${cause}` : 'Donation',
          price: amount.toFixed(2),
          quantity: 1,
          requires_shipping: false,
          taxable: false,
        },
      ],
      note: 'Website donation via zuhd.au',
      tags: 'donation,website',
    },
  };

  const res = await fetch(`https://${store}/admin/api/2024-07/draft_orders.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': env.SHOPIFY_ADMIN_TOKEN,
    },
    body: JSON.stringify(draftOrder),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.log('Shopify draft order failed:', res.status, detail);
    return json({ error: 'Could not start the donation checkout. Please try again later.' }, 502);
  }

  const data = await res.json();
  const invoiceUrl = data?.draft_order?.invoice_url;
  if (!invoiceUrl) {
    return json({ error: 'Checkout link missing from Shopify response.' }, 502);
  }

  return json({ payment_url: invoiceUrl });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: JSON_HEADERS });
}
