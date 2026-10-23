import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Signup() {
  const { user, loading, signUp } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailSentTo, setEmailSentTo] = useState("");

  // Only redirect if user is signed in AND not in success state
  if (!loading && user && !success) return <Navigate to="/account" replace />;

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim()) return setError("Email is required");
    if (!form.password || form.password.length < 6)
      return setError("Password must be at least 6 characters");
    if (form.password !== form.confirm)
      return setError("Passwords do not match");

    setSubmitting(true);

    try {
      await signUp({
        email: form.email.trim(),
        password: form.password,
        name: form.name.trim(),
        phone: form.phone.trim(),
      });

      // Show "check your email" — DO NOT redirect
      setEmailSentTo(form.email.trim());
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Sign up failed");
    } finally {
      setSubmitting(false);
    }
  };

  /* ============================================================
     SUCCESS STATE — "Check your email"
     ============================================================ */
  if (success) {
    return (
      <section className="auth-page">
        <div className="auth-panel">
          <p className="auth-eyebrow">BURMA VILLAGERS</p>

          <h1 className="auth-title">
            CHECK
            <br />
            YOUR EMAIL.
          </h1>

          <div className="auth-alert">
            <span className="auth-alert-icon">✓</span>
            <div>
              <p className="auth-alert-title">
                CONFIRMATION EMAIL SENT
              </p>
              <p className="auth-alert-text">
                We sent a confirmation link to{" "}
                <strong>{emailSentTo}</strong>. Click the link in your
                email to activate your account.
              </p>
            </div>
          </div>

          <div className="auth-success-steps">
            <p className="auth-success-step">
              <span>1</span>
              Open your email inbox
            </p>
            <p className="auth-success-step">
              <span>2</span>
              Click the confirmation link
            </p>
            <p className="auth-success-step">
              <span>3</span>
              You'll be redirected to your account
            </p>
          </div>

          <p className="auth-note">
            Didn't receive the email? Check your spam folder or{" "}
            <button
              type="button"
              className="auth-resend"
              onClick={() => {
                setSuccess(false);
                setForm((f) => ({ ...f, password: "", confirm: "" }));
              }}
            >
              try again
            </button>
            .
          </p>

          <Link to="/login" className="auth-link">
            ← BACK TO SIGN IN
          </Link>
        </div>
      </section>
    );
  }

  /* ============================================================
     FORM STATE
     ============================================================ */
  return (
    <section className="auth-page">
      <div className="auth-panel">
        <p className="auth-eyebrow">BURMA VILLAGERS</p>
        <h1 className="auth-title">
          CREATE
          <br />
          ACCOUNT.
        </h1>
        <p className="auth-sub">
          Already have one? <Link to="/login">Sign in</Link>
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="name">
              FULL NAME
            </label>
            <input
              id="name"
              type="text"
              className="auth-input"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="AUNG AUNG"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="email">
              EMAIL
            </label>
            <input
              id="email"
              type="email"
              className="auth-input"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="phone">
              PHONE (OPTIONAL)
            </label>
            <input
              id="phone"
              type="tel"
              className="auth-input"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="09 xxx xxx xxx"
              autoComplete="tel"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              className="auth-input"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
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
              value={form.confirm}
              onChange={(e) => update("confirm", e.target.value)}
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
            {submitting ? "CREATING…" : "CREATE ACCOUNT →"}
          </button>
        </form>

        <p className="auth-note">
          By creating an account, you agree to our Terms & Privacy
          Policy.
        </p>
      </div>
    </section>
  );
}