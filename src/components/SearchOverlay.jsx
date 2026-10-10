import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { products, formatPrice } from "../data/products";

const SUGGESTIONS = [
  "AIR LAYER",
  "350 GSM",
  "BLACK",
  "IVORY",
  "FOREST",
];

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(t);
    }
    setQuery("");
  }, [open]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // ESC closes
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
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.colors.some((c) => c.toLowerCase().includes(q))
      )
      .slice(0, 6);
  }, [query]);

  return (
    <div
      className={`search-overlay ${open ? "is-open" : ""}`}
      aria-hidden={!open}
    >
      {/* Top bar */}
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

      {/* Input */}
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

        <span className="search-input-hint">
          PRESS ESC TO CLOSE
        </span>
      </div>

      {/* Body */}
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
                  to={`/product/${p.id}`}
                  className="search-result"
                  onClick={onClose}
                >
                  <div className="search-result-image">
                    <img src={p.image} alt={p.name} />
                  </div>
                  <div className="search-result-info">
                    <p className="search-result-name">{p.name}</p>
                    <p className="search-result-price">
                      {formatPrice(p.price, p.currency)}
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
              Try a different word, or browse the new drop.
            </p>
            <Link
              to="/new-drop"
              className="btn btn-primary"
              onClick={onClose}
            >
              VIEW NEW DROP →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}