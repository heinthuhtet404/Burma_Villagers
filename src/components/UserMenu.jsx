import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UserMenu() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    navigate("/");
  };

  if (!user) {
    return (
      <Link to="/login" className="navbar-user navbar-user--signin">
        SIGN IN
      </Link>
    );
  }

  const initial =
    (profile?.name?.[0] || user.email?.[0] || "U").toUpperCase();

  return (
    <div className="navbar-user-menu" ref={ref}>
      <button
        className="navbar-user-btn"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Account menu"
      >
        <span className="navbar-user-avatar">{initial}</span>
      </button>

      {open && (
        <div className="navbar-user-dropdown">
          <div className="navbar-user-head">
            <p className="navbar-user-name">
              {profile?.name || "Account"}
            </p>
            <p className="navbar-user-email">{user.email}</p>
          </div>

          <Link
            to="/account"
            className="navbar-user-item"
            onClick={() => setOpen(false)}
          >
            MY ACCOUNT
          </Link>
          <Link
            to="/account/orders"
            className="navbar-user-item"
            onClick={() => setOpen(false)}
          >
            ORDERS
          </Link>
          <Link
            to="/account/addresses"
            className="navbar-user-item"
            onClick={() => setOpen(false)}
          >
            ADDRESSES
          </Link>
          <Link
            to="/account/settings"
            className="navbar-user-item"
            onClick={() => setOpen(false)}
          >
            SETTINGS
          </Link>

          <button
            className="navbar-user-item navbar-user-item--signout"
            onClick={handleSignOut}
          >
            SIGN OUT
          </button>
        </div>
      )}
    </div>
  );
}