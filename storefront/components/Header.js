import Link from "next/link";
import { useCart } from "../lib/cart-context";
import { SHOP_NAME } from "../pages/_app";

export default function Header() {
  const { count, ready } = useCart();

  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            ✽
          </span>
          <span className="brand-name">{SHOP_NAME}</span>
        </Link>
        <nav className="nav">
          <Link href="/" className="nav-link">
            Shop
          </Link>
          <Link href="/cart" className="nav-link cart-link">
            Cart
            {ready && count > 0 && (
              <span className="cart-badge" aria-label={`${count} items in cart`}>
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
