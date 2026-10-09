import { useState } from "react";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

const SORT_OPTIONS = [
  { value: "new", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function Shop() {
  const [sort, setSort] = useState("new");

  const sorted = [...products].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return 0; // "new" — keep original order
  });

  return (
    <section className="shop">
      <div className="container">
        {/* Head */}
        <div className="shop-head">
          <div>
            <p className="section-eyebrow">ALL PRODUCTS</p>
            <h1 className="shop-title">SHOP</h1>
          </div>

          <div className="shop-sort">
            <label htmlFor="sort" className="shop-sort-label">SORT</label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="shop-sort-select"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Count */}
        <p className="shop-count">{products.length} ITEMS</p>

        {/* Grid */}
        <div className="product-grid">
          {sorted.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}