import { useState } from "react";
import { Link } from "react-router-dom";
import MenuOverlay from "./MenuOverlay";
import CartIcon from "./CartIcon";
import CartDrawer from "./CartDrawer";
import SearchOverlay from "./SearchOverlay";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const openCartFromMenu = () => {
    setMenuOpen(false);
    // Small delay so menu close animation plays first
    setTimeout(() => setCartOpen(true), 200);
  };

  return (
    <>
      <header className="navbar">
        <div className="container navbar-inner">
          <div className="navbar-left">
            <button
              className={`navbar-burger ${menuOpen ? "is-open" : ""}`}
              aria-label="Menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>

            <nav className="navbar-links">
              <Link to="/shop">SHOP</Link>
              <Link to="/new-drop">NEW DROP</Link>
              <Link to="/about">ABOUT</Link>
            </nav>
          </div>

          <Link
            to="/"
            className="navbar-logo"
            onClick={() => setMenuOpen(false)}
          >
            BURMA VILLAGERS
          </Link>

          <div className="navbar-right">
            <button
              className="navbar-search"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <span className="navbar-search-text">SEARCH</span>
              <span className="navbar-search-icon" aria-hidden="true">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="7"
                    cy="7"
                    r="5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="11"
                    y1="11"
                    x2="14"
                    y2="14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </button>

            <CartIcon
              onClick={() => setCartOpen(true)}
              className="navbar-cart-desktop"
            />
          </div>
        </div>
      </header>

      <MenuOverlay
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onCartOpen={openCartFromMenu}
      />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}