import { useState } from "react";
import { getAllProducts, getCategories } from "../data/products";
import ProductCard from "../components/ProductCard";

export async function getStaticProps() {
  return {
    props: {
      products: getAllProducts(),
      categories: getCategories(),
    },
  };
}

export default function Home({ products, categories }) {
  const [filter, setFilter] = useState("All");
  const filters = ["All", ...categories];
  const shown =
    filter === "All"
      ? products
      : products.filter((p) => p.category === filter);

  return (
    <div>
      <section className="hero">
        <h1 className="hero-title">Original arts &amp; handmade crafts</h1>
        <p className="hero-subtitle">
          One-of-a-kind paintings, ceramics, and little treasures — made by
          hand and shipped with love.
        </p>
      </section>

      <div className="filters" role="tablist" aria-label="Filter products">
        {filters.map((f) => (
          <button
            key={f}
            className={`filter-chip ${filter === f ? "is-active" : ""}`}
            onClick={() => setFilter(f)}
            role="tab"
            aria-selected={filter === f}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid">
        {shown.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
