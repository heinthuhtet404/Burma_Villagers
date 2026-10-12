import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "../components/ProductCard";
import useProducts from "../hooks/useProducts";

export default function Shop() {
  const gridRef = useRef(null);
  const { products, loading, error } = useProducts();
  const [sortBy, setSortBy] = useState("newest");

  const sorted = useMemo(() => {
    const list = [...products];
    switch (sortBy) {
      case "price-low":
        return list.sort((a, b) => a.price - b.price);
      case "price-high":
        return list.sort((a, b) => b.price - a.price);
      case "newest":
      default:
        return list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );
    }
  }, [products, sortBy]);

  // 🎯 Reveal grid as soon as products are rendered
  useEffect(() => {
    if (loading || sorted.length === 0) return;
    const el = gridRef.current;
    if (!el) return;

    // Force next frame so transition applies
    requestAnimationFrame(() => {
      el.classList.add("is-revealed");
    });
  }, [loading, sorted.length]);

  return (
    <section className="shop">
      <div className="container">
        <div className="shop-head">
          <div>
            <p className="section-eyebrow">ALL PRODUCTS</p>
            <h1 className="shop-title">SHOP</h1>
          </div>

          <div className="shop-sort">
            <span className="shop-sort-label">SORT</span>
            <select
              className="shop-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading && <p className="shop-count">LOADING…</p>}

        {error && (
          <p className="shop-count">FAILED TO LOAD. REFRESH.</p>
        )}

        {!loading && !error && (
          <>
            <p className="shop-count">
              {sorted.length} PRODUCT{sorted.length !== 1 ? "S" : ""}
            </p>

            <div
              ref={gridRef}
              className="product-grid reveal-stagger"
            >
              {sorted.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}