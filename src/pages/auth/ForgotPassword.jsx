import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <section className="auth-page">
        <div className="auth-panel">
          <p className="auth-eyebrow">BURMA VILLAGERS</p>
          <h1 className="auth-title">
            CHECK
            <br />
            YOUR EMAIL.
          </h1>
          <p className="auth-sub">
            We sent a reset link to <strong>{email}</strong>.
            Click the link to reset your password.
          </p>
          <Link to="/login" className="auth-link">
            ← BACK TO SIGN IN
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-page">
      <div className="auth-panel">
        <p className="auth-eyebrow">BURMA VILLAGERS</p>
        <h1 className="auth-title">
          FORGOT
          <br />
          PASSWORD.
        </h1>
        <p className="auth-sub">
          Enter your email and we'll send a reset link.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">
              EMAIL
            </label>
            <input
              id="email"
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              autoComplete="email"
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={submitting}
          >
            {submitting ? "SENDING…" : "SEND RESET LINK →"}
          </button>
        </form>

        <Link to="/login" className="auth-link">
          ← BACK TO SIGN IN
        </Link>
      </div>
    </section>
  );
}