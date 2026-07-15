import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "storefront-cart";

// The cart stores a small, safe snapshot of each item. Prices are ALWAYS
// re-checked on the server at checkout time, so the cart is display-only.
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  // Load any saved cart from the browser once we're on the client.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // Ignore corrupt storage — start with an empty cart.
    }
    setReady(true);
  }, []);

  // Persist the cart whenever it changes.
  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage may be full or disabled; the cart still works in-memory.
    }
  }, [items, ready]);

  function addToCart(product, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id
            ? { ...i, quantity: clampQty(i.quantity + quantity) }
            : i,
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          priceCents: product.priceCents,
          currency: product.currency,
          image: product.image,
          quantity: clampQty(quantity),
        },
      ];
    });
  }

  function setQuantity(id, quantity) {
    const q = clampQty(quantity);
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: q } : i)),
    );
  }

  function removeFromCart(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const totalCents = useMemo(
    () => items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0),
    [items],
  );

  const value = {
    items,
    ready,
    count,
    totalCents,
    addToCart,
    setQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function clampQty(q) {
  const n = parseInt(q, 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  if (n > 99) return 99;
  return n;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
