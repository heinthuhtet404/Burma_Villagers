import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const LINKS = [
  { to: "/shop", label: "SHOP",      meta: "01" },
  { to: "/shop", label: "NEW DROP",  meta: "02" },
  { to: "/about", label: "ABOUT",    meta: "03" },
];

export default function MenuOverlay({ open, onClose }) {
  const panelRef = useRef(null);

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

  return (
    <div
      ref={panelRef}
      className={`menu-overlay ${open ? "is-open" : ""}`}
      aria-hidden={!open}
    >
      {/* Top bar inside overlay: close + brand mark */}
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
        </ul>
      </nav>

      {/* Bottom meta — brutalist/editorial corner info */}
      <div className="menu-overlay-bottom container">
        <div className="menu-overlay-col">
          <span className="menu-overlay-col-title">FOLLOW</span>
          <a href="https://tiktok.com" target="_blank" rel="noreferrer">
            TIKTOK ↗
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            INSTAGRAM ↗
          </a>
        </div>

        <div className="menu-overlay-col">
          <span className="menu-overlay-col-title">CONTACT</span>
          <a href="mailto:hello@burmavillagers.com">
            HELLO@BURMAVILLAGERS.COM
          </a>
        </div>

        <div className="menu-overlay-col menu-overlay-col--end">
          <span className="menu-overlay-col-title">YANGON</span>
          <span>MM · GMT+6:30</span>
        </div>
      </div>
    </div>
  );
}