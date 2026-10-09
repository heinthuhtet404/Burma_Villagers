import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Mobile: hamburger */}
        <button
          className="navbar-burger"
          aria-label="Menu"
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setOpen(false)}>
          BURMA VILLAGERS
        </Link>

        {/* Desktop links */}
        <nav className="navbar-links">
          <Link to="/shop">SHOP</Link>
          <Link to="/shop">NEW DROP</Link>
          <Link to="/about">ABOUT</Link>
        </nav>

        {/* Cart */}
        <Link to="/cart" className="navbar-cart">
          CART (0)
        </Link>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="navbar-mobile">
          <Link to="/shop" onClick={() => setOpen(false)}>SHOP</Link>
          <Link to="/shop" onClick={() => setOpen(false)}>NEW DROP</Link>
          <Link to="/about" onClick={() => setOpen(false)}>ABOUT</Link>
        </div>
      )}
    </header>
  );
}