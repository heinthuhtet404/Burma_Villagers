import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ResetPassword() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || password.length < 6)
      return setError("Password must be at least 6 characters");
    if (password !== confirm) return setError("Passwords do not match");

    setSubmitting(true);
    try {
      await updatePassword(password);
      navigate("/account", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to update password");
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-panel">
        <p className="auth-eyebrow">BURMA VILLAGERS</p>
        <h1 className="auth-title">
          SET NEW
          <br />
          PASSWORD.
        </h1>
        <p className="auth-sub">
          Choose a new password for your account.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="password">
              NEW PASSWORD
            </label>
            <input
              id="password"
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              autoComplete="new-password"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="confirm">
              CONFIRM PASSWORD
            </label>
            <input
              id="confirm"
              type="password"
              className="auth-input"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={submitting}
          >
            {submitting ? "UPDATING…" : "UPDATE PASSWORD →"}
          </button>
        </form>
      </div>
    </section>
  );
}