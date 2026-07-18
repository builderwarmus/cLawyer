import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { getAllProducts, getProductById } from "../../data/products";
import { formatMoney } from "../../lib/format";
import { useCart } from "../../lib/cart-context";

export async function getStaticPaths() {
  return {
    paths: getAllProducts().map((p) => ({ params: { id: p.id } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const product = getProductById(params.id);
  if (!product) return { notFound: true };
  return { props: { product } };
}

export default function ProductPage({ product }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart(product, 1);
    setAdded(true);
  }

  return (
    <div className="product">
      <Link href="/" className="back-link">
        ← Back to shop
      </Link>

      <div className="product-layout">
        <div className="product-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-info">
          <span className="card-category">{product.category}</span>
          <h1 className="product-name">{product.name}</h1>
          <p className="product-price">
            {formatMoney(product.priceCents, product.currency)}
          </p>
          <p className="product-description">{product.description}</p>

          {product.soldOut ? (
            <p className="soldout-note">This piece has found a home. 💛</p>
          ) : added ? (
            <div className="added-actions">
              <p className="added-note">✓ Added to your cart</p>
              <div className="button-row">
                <button
                  className="btn btn-secondary"
                  onClick={() => setAdded(false)}
                >
                  Keep shopping
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => router.push("/cart")}
                >
                  Go to cart
                </button>
              </div>
            </div>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={handleAdd}>
              Add to cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
