import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminTopbar({ title = "DASHBOARD" }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <h1 className="admin-topbar-title">{title}</h1>
      </div>

      <div className="admin-topbar-right">
        <div className="admin-user">
          <button
            className="admin-user-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
          >
            <span className="admin-user-avatar">
              {(user?.email?.[0] || "A").toUpperCase()}
            </span>
            <span className="admin-user-email">{user?.email}</span>
          </button>

          {menuOpen && (
            <div className="admin-user-menu">
              <button
                className="admin-user-menu-item"
                onClick={handleSignOut}
              >
                SIGN OUT
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}