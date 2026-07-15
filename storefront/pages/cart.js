import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCart } from "../lib/cart-context";
import { formatMoney } from "../lib/format";

export default function CartPage() {
  const { items, ready, totalCents, setQuantity, removeFromCart, clearCart } =
    useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkout() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Sorry, checkout could not start.");
        setLoading(false);
        return;
      }

      if (data.demo) {
        // No Stripe keys configured yet — show the demo confirmation.
        clearCart();
        router.push("/success?demo=1");
        return;
      }

      if (data.url) {
        // Send the customer to Stripe's secure card-payment page.
        window.location.href = data.url;
        return;
      }

      setError("Unexpected response from the server.");
      setLoading(false);
    } catch {
      setError("Could not reach the server. Please try again.");
      setLoading(false);
    }
  }

  if (!ready) {
    return <p className="muted">Loading your cart…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <h1>Your cart is empty</h1>
        <p className="muted">Find something handmade to love.</p>
        <Link href="/" className="btn btn-primary">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <h1 className="page-title">Your cart</h1>

      <ul className="cart-list">
        {items.map((item) => (
          <li key={item.id} className="cart-item">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="cart-thumb"
              src={item.image}
              alt={item.name}
            />
            <div className="cart-item-main">
              <Link href={`/product/${item.id}`} className="cart-item-name">
                {item.name}
              </Link>
              <p className="cart-item-price">
                {formatMoney(item.priceCents, item.currency)} each
              </p>
            </div>
            <div className="cart-item-controls">
              <label className="qty-label">
                Qty
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={item.quantity}
                  onChange={(e) => setQuantity(item.id, e.target.value)}
                  className="qty-input"
                />
              </label>
              <p className="cart-item-line">
                {formatMoney(item.priceCents * item.quantity, item.currency)}
              </p>
              <button
                className="link-danger"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="cart-summary">
        <div className="cart-total-row">
          <span>Total</span>
          <span className="cart-total">{formatMoney(totalCents)}</span>
        </div>
        <p className="muted small">
          Shipping is collected on the secure payment page.
        </p>

        {error && <p className="error-banner">{error}</p>}

        <button
          className="btn btn-primary btn-lg btn-block"
          onClick={checkout}
          disabled={loading}
        >
          {loading ? "Starting checkout…" : "Checkout"}
        </button>
        <Link href="/" className="continue-link">
          ← Continue shopping
        </Link>
      </div>
    </div>
  );
}
