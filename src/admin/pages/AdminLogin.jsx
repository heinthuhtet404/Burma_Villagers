import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const { user, isAdmin, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/admin";

  // If already signed in as admin → redirect
  if (!loading && user && isAdmin) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await signIn(email.trim(), password);
      // AuthContext handles admin check; guard will redirect
      setTimeout(() => navigate(from, { replace: true }), 400);
    } catch (err) {
      setError(err.message || "Sign in failed. Check your email and password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-panel">
        <div className="admin-login-head">
          <p className="admin-login-eyebrow">BURMA VILLAGERS — ADMIN</p>
          <h1 className="admin-login-title">
            SIGN IN
          </h1>
          <p className="admin-login-sub">
            Only authorized staff can access this dashboard.
          </p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="admin-login-field">
            <label className="admin-login-label" htmlFor="email">
              EMAIL
            </label>
            <input
              id="email"
              type="email"
              className="admin-login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@burmavillagers.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="admin-login-field">
            <label className="admin-login-label" htmlFor="password">
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              className="admin-login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="admin-login-error">{error}</p>
          )}

          <button
            type="submit"
            className="btn btn-primary admin-login-submit"
            disabled={submitting}
          >
            {submitting ? "SIGNING IN…" : "SIGN IN →"}
          </button>
        </form>

        <p className="admin-login-note">
          Not authorized? Contact the store owner.
        </p>
      </div>
    </div>
  );
}