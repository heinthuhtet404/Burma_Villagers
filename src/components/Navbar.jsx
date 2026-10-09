import { useState } from "react";
import { Link } from "react-router-dom";
import MenuOverlay from "./MenuOverlay";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="navbar">
        <div className="container navbar-inner">
          {/* LEFT slot: burger (mobile) + links (desktop) */}
          <div className="navbar-left">
            <button
              className={`navbar-burger ${open ? "is-open" : ""}`}
              aria-label="Menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>

            <nav className="navbar-links">
              <Link to="/shop">SHOP</Link>
              <Link to="/shop">NEW DROP</Link>
              <Link to="/about">ABOUT</Link>
            </nav>
          </div>

          {/* CENTER: logo */}
          <Link
            to="/"
            className="navbar-logo"
            onClick={() => setOpen(false)}
          >
            BURMA VILLAGERS
          </Link>

          {/* RIGHT: cart */}
          <Link to="/cart" className="navbar-cart">
            CART (0)
          </Link>
        </div>
      </header>

      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}