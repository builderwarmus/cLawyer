import Stripe from "stripe";
import { getProductById } from "../../data/products";

// Countries you're willing to ship to. Add or remove as you like.
const SHIP_TO = ["US", "CA", "GB", "AU", "IE", "NZ"];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const items = req.body && req.body.items;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Your cart is empty." });
  }

  // IMPORTANT: build the order from the server-side catalog, never from
  // prices sent by the browser. This stops anyone from editing the price.
  const lineItems = [];
  for (const item of items) {
    const product = getProductById(item && item.id);
    if (!product) {
      return res.status(400).json({ error: "One of the items is no longer available." });
    }
    if (product.soldOut) {
      return res.status(400).json({ error: `"${product.name}" is sold out.` });
    }
    const quantity = clampQty(item.quantity);
    lineItems.push({
      price_data: {
        currency: product.currency || "usd",
        product_data: {
          name: product.name,
          description: truncate(product.description, 300),
        },
        unit_amount: product.priceCents,
      },
      quantity,
    });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;

  // DEMO MODE: no Stripe key set yet, so return a simulated success.
  if (!stripeKey) {
    return res.status(200).json({ demo: true });
  }

  try {
    const stripe = new Stripe(stripeKey);
    const origin =
      req.headers.origin ||
      `${req.headers["x-forwarded-proto"] || "http"}://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      // Stripe collects Visa, Mastercard, debit cards, Apple Pay, etc.
      shipping_address_collection: { allowed_countries: SHIP_TO },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err && err.message);
    return res
      .status(500)
      .json({ error: "We couldn't start checkout. Please try again." });
  }
}

function clampQty(q) {
  const n = parseInt(q, 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  if (n > 99) return 99;
  return n;
}

function truncate(text, max) {
  if (!text) return undefined;
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}
