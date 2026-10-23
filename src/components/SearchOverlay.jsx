import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../lib/format";
import useProducts from "../hooks/useProducts";

const SUGGESTIONS = ["AIR LAYER", "350 GSM", "TEE"];

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  // ✅ Shop items အားလုံး ဆွဲ (paginate: false → all products)
  const { products } = useProducts({ paginate: false });

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(t);
    }
    setQuery("");
  }, [open]);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return products
      .filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [query, products]);

  return (
    <div
      className={`search-overlay ${open ? "is-open" : ""}`}
      aria-hidden={!open}
    >
      <div className="container search-top">
        <span className="search-brand">SEARCH — BURMA VILLAGERS</span>
        <button
          className="search-close"
          onClick={onClose}
          aria-label="Close search"
        >
          <span />
          <span />
        </button>
      </div>

      <div className="container search-input-wrap">
        <input
          ref={inputRef}
          className="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="WHAT ARE YOU LOOKING FOR?"
          aria-label="Search products"
        />
        <span className="search-input-hint">PRESS ESC TO CLOSE</span>
      </div>

      <div className="container search-body">
        {!query.trim() && (
          <div className="search-suggestions">
            <p className="search-suggestions-label">POPULAR SEARCHES</p>
            <div className="search-suggestions-list">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className="search-suggestion"
                  onClick={() => setQuery(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {query.trim() && results.length > 0 && (
          <ul className="search-results">
            {results.map((p) => (
              <li key={p.id}>
                <Link
                  to={`/product/${p.slug || p.id}`}
                  className="search-result"
                  onClick={onClose}
                >
                  <div className="search-result-image">
                    {p.image ? (
                      <img src={p.image} alt={p.name} />
                    ) : (
                      <span />
                    )}
                  </div>
                  <div className="search-result-info">
                    <p className="search-result-name">{p.name}</p>
                    <p className="search-result-price">
                      {formatPrice(p.price, p.currency || "MMK")}
                    </p>
                  </div>
                  <span className="search-result-arrow">→</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {query.trim() && results.length === 0 && (
          <div className="search-empty">
            <p className="search-empty-title">
              Nothing for "{query.toUpperCase()}".
            </p>
            <p className="search-empty-sub">
              Try a different word, or browse the shop.
            </p>
            <Link
              to="/shop"
              className="btn btn-primary"
              onClick={onClose}
            >
              BROWSE SHOP →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}