// ------------------------------------------------------------------
// Cloudflare Pages Function  ->  POST /api/checkout
// ------------------------------------------------------------------
// This runs on Cloudflare's servers, NOT in the shopper's browser, so
// your Stripe secret key stays private. It builds the order from the
// trusted price list below (never from prices sent by the browser),
// then asks Stripe to create a secure card-payment page.
//
// Your dad adds the secret key in the Cloudflare dashboard as an
// environment variable named  STRIPE_SECRET_KEY  (see README.md).
// With no key set, it stays in safe DEMO mode (no real charges).
//
// IMPORTANT: these prices (in cents) are what customers are actually
// charged. If you change a price in assets/products.js, change it here
// too so the two match.
// ------------------------------------------------------------------

const CATALOG = {
  "sunset-over-the-hills": { name: "Sunset Over the Hills", priceCents: 12000, currency: "usd" },
  "hand-thrown-mug": { name: "Hand-Thrown Ceramic Mug", priceCents: 3200, currency: "usd" },
  "abstract-blue-study": { name: "Abstract Blue Study", priceCents: 8500, currency: "usd" },
  "woven-wall-hanging": { name: "Woven Wall Hanging", priceCents: 5400, currency: "usd" },
  "wildflower-greeting-cards": { name: "Wildflower Greeting Cards (Set of 6)", priceCents: 1800, currency: "usd" },
  "tiny-clay-cat": { name: "Tiny Clay Cat", priceCents: 2200, currency: "usd" },
};

// Countries you're willing to ship to.
const SHIP_TO = ["US", "CA", "GB", "AU", "IE", "NZ"];

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ error: "Could not read the order." }, 400);
  }

  const items = body && body.items;
  if (!Array.isArray(items) || items.length === 0) {
    return json({ error: "Your cart is empty." }, 400);
  }

  // Build a Stripe Checkout Session request as form-encoded fields.
  const form = new URLSearchParams();
  form.append("mode", "payment");

  const origin = new URL(request.url).origin;
  form.append("success_url", origin + "/success.html?session_id={CHECKOUT_SESSION_ID}");
  form.append("cancel_url", origin + "/");

  SHIP_TO.forEach((c, i) => {
    form.append("shipping_address_collection[allowed_countries][" + i + "]", c);
  });

  let idx = 0;
  for (const item of items) {
    const product = CATALOG[item && item.id];
    if (!product) {
      return json({ error: "One of the items is no longer available." }, 400);
    }
    const qty = clampQty(item.quantity);
    const base = "line_items[" + idx + "]";
    form.append(base + "[price_data][currency]", product.currency);
    form.append(base + "[price_data][product_data][name]", product.name);
    form.append(base + "[price_data][unit_amount]", String(product.priceCents));
    form.append(base + "[quantity]", String(qty));
    idx++;
  }

  const key = env && env.STRIPE_SECRET_KEY;

  // DEMO MODE: no key configured yet.
  if (!key) {
    return json({ demo: true }, 200);
  }

  let resp;
  try {
    resp = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + key,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
    });
  } catch (e) {
    return json({ error: "We couldn't reach the payment service. Please try again." }, 502);
  }

  if (!resp.ok) {
    return json({ error: "We couldn't start checkout. Please try again." }, 502);
  }

  const session = await resp.json();
  if (!session || !session.url) {
    return json({ error: "We couldn't start checkout. Please try again." }, 502);
  }
  return json({ url: session.url }, 200);
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status,
    headers: { "Content-Type": "application/json" },
  });
}

function clampQty(q) {
  const n = parseInt(q, 10);
  if (!isFinite(n) || n < 1) return 1;
  if (n > 99) return 99;
  return n;
}
