import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const LINKS = [
  { to: "/shop", label: "SHOP", meta: "01" },
  { to: "/new-drop", label: "NEW DROP", meta: "02" },
  { to: "/about", label: "ABOUT", meta: "03" },
];

export default function MenuOverlay({ open, onClose, onCartOpen }) {
  const panelRef = useRef(null);
  const { count } = useCart();

  // Lock body scroll when open
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

  const handleCartClick = () => {
    if (onCartOpen) onCartOpen();
    else onClose();
  };

  return (
    <div
      ref={panelRef}
      className={`menu-overlay ${open ? "is-open" : ""}`}
      aria-hidden={!open}
    >
      {/* Top bar */}
      <div className="menu-overlay-top container">
        <span className="menu-overlay-brand">BURMA VILLAGERS</span>
        <button
          className="menu-overlay-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          <span />
          <span />
        </button>
      </div>

      {/* Main links */}
      <nav className="menu-overlay-nav container">
        <ul>
          {LINKS.map((l, i) => (
            <li
              key={l.label}
              className="menu-overlay-item"
              style={{ "--i": i }}
            >
              <Link to={l.to} onClick={onClose}>
                <span className="menu-overlay-meta">{l.meta}</span>
                <span className="menu-overlay-label">{l.label}</span>
                <span className="menu-overlay-arrow" aria-hidden="true">→</span>
              </Link>
            </li>
          ))}

          {/* Cart item — mobile-only row */}
          <li
            className="menu-overlay-item menu-overlay-item--cart"
            style={{ "--i": LINKS.length }}
          >
            <button
              type="button"
              onClick={handleCartClick}
              className="menu-overlay-cart-btn"
            >
              <span className="menu-overlay-meta">04</span>
              <span className="menu-overlay-label">
                CART
                {count > 0 && (
                  <span className="menu-overlay-cart-count">
                    ({count})
                  </span>
                )}
              </span>
              <span className="menu-overlay-arrow" aria-hidden="true">→</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* ❌ FOLLOW / CONTACT / YANGON — ဒီအပိုင်း ဖျက်လိုက်တယ် */}
    </div>
  );
}