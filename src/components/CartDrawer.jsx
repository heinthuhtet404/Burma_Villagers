import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../lib/format";

export default function CartDrawer({ open, onClose }) {
  const { items, subtotal, count, remove, updateQty } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showSignIn, setShowSignIn] = useState(false);

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

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Reset sign-in prompt when drawer closes
  useEffect(() => {
    if (!open) setShowSignIn(false);
  }, [open]);

  const handleCheckout = () => {
    if (!user) {
      setShowSignIn(true);
      return;
    }
    onClose();
    navigate("/checkout");
  };

  const handleGoSignIn = () => {
    onClose();
    navigate("/login", { state: { from: "/checkout" } });
  };

  const handleGoSignUp = () => {
    onClose();
    navigate("/signup", { state: { from: "/checkout" } });
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${open ? "is-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`cart-drawer ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="cart-drawer-head">
          <div>
            <p className="cart-drawer-eyebrow">YOUR BAG</p>
            <h2 className="cart-drawer-title">
              {count === 0 ? "EMPTY" : `${count} ITEM${count > 1 ? "S" : ""}`}
            </h2>
          </div>
          <button
            className="cart-drawer-close"
            onClick={onClose}
            aria-label="Close cart"
          >
            <span />
            <span />
          </button>
        </div>

        {/* Items */}
        <div className="cart-drawer-body">
          {count === 0 ? (
            <div className="cart-empty">
              <p className="cart-empty-title">
                Your bag
                <br />
                is empty.
              </p>
              <p className="cart-empty-sub">
                Nothing here yet — start with the new drop.
              </p>
              <Link
                to="/shop"
                className="btn btn-primary cart-empty-btn"
                onClick={onClose}
              >
                SHOP THE DROP →
              </Link>
            </div>
          ) : (
            <ul className="cart-list">
              {items.map((item) => (
                <li key={item.key} className="cart-item">
                  <Link
                    to={`/product/${item.slug || item.id}`}
                    onClick={onClose}
                    className="cart-item-image"
                  >
                    <img src={item.image} alt={item.name} />
                  </Link>

                  <div className="cart-item-info">
                    <div className="cart-item-top">
                      <Link
                        to={`/product/${item.slug || item.id}`}
                        onClick={onClose}
                        className="cart-item-name"
                      >
                        {item.name}
                      </Link>
                      <button
                        className="cart-item-remove"
                        onClick={() => remove(item.key)}
                        aria-label={`Remove ${item.name}`}
                      >
                        ×
                      </button>
                    </div>

                    <div className="cart-item-meta">
                      <span
                        className="cart-item-swatch"
                        style={{ background: item.color }}
                      />
                      <span>SIZE {item.size}</span>
                    </div>

                    <div className="cart-item-bottom">
                      <div className="cart-qty">
                        <button
                          onClick={() => updateQty(item.key, item.qty - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span>{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.key, item.qty + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <p className="cart-item-price">
                        {formatPrice(item.price * item.qty, item.currency)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {count > 0 && (
          <div className="cart-drawer-foot">
            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>SUBTOTAL</span>
                <span>{formatPrice(subtotal, "MMK")}</span>
              </div>
              <div className="cart-summary-row cart-summary-row--muted">
                <span>SHIPPING</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            {showSignIn ? (
              <div className="cart-signin-prompt">
                <p className="cart-signin-title">SIGN IN REQUIRED</p>
                <p className="cart-signin-text">
                  Please sign in or create an account to continue to checkout.
                </p>
                <div className="cart-signin-actions">
                  <button
                    type="button"
                    className="btn btn-primary cart-signin-btn"
                    onClick={handleGoSignIn}
                  >
                    SIGN IN →
                  </button>
                  <button
                    type="button"
                    className="cart-signin-link"
                    onClick={handleGoSignUp}
                  >
                    CREATE ACCOUNT
                  </button>
                </div>
                <button
                  type="button"
                  className="cart-signin-back"
                  onClick={() => setShowSignIn(false)}
                >
                  ← BACK TO BAG
                </button>
              </div>
            ) : (
              <>
                <button
                  className="btn btn-primary cart-checkout"
                  onClick={handleCheckout}
                >
                  <span>CHECKOUT</span>
                  <span className="cart-checkout-arrow">→</span>
                </button>

                <p className="cart-drawer-note">
                  Taxes included · Delivery calculated at checkout
                </p>
              </>
            )}
          </div>
        )}
      </aside>
    </>
  );
}