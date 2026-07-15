import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCart } from "../lib/cart-context";

export default function SuccessPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const isDemo = router.query.demo === "1";

  // After a real Stripe payment the customer returns here — empty the cart.
  useEffect(() => {
    if (router.isReady && !isDemo) {
      clearCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <div className="success">
      <div className="success-mark" aria-hidden="true">
        ✓
      </div>
      <h1>Thank you!</h1>
      {isDemo ? (
        <p className="muted">
          This was a <strong>demo</strong> order — no real payment was taken.
          Add your Stripe keys (see the README) to accept real Visa &amp; debit
          card payments.
        </p>
      ) : (
        <p className="muted">
          Your order was received and your payment was successful. A receipt is
          on its way to your email.
        </p>
      )}
      <Link href="/" className="btn btn-primary">
        Back to the shop
      </Link>
    </div>
  );
}
