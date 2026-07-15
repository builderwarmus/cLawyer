import Link from "next/link";
import { formatMoney } from "../lib/format";

export default function ProductCard({ product }) {
  return (
    <Link href={`/product/${product.id}`} className="card">
      <div className="card-image">
        {/* Using a plain <img> keeps setup simple and works with any photo. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.soldOut && <span className="badge-soldout">Sold out</span>}
      </div>
      <div className="card-body">
        <span className="card-category">{product.category}</span>
        <h3 className="card-name">{product.name}</h3>
        <p className="card-price">
          {formatMoney(product.priceCents, product.currency)}
        </p>
      </div>
    </Link>
  );
}
