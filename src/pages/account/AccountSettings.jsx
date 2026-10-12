import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AccountSettings() {
  const { user, profile, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      await updateProfile(form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2400);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="account-card">
      <p className="account-card-title">PROFILE SETTINGS</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label className="auth-label">EMAIL</label>
          <input
            className="auth-input"
            value={user?.email || ""}
            disabled
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="name">
            FULL NAME
          </label>
          <input
            id="name"
            className="auth-input"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="AUNG AUNG"
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="phone">
            PHONE
          </label>
          <input
            id="phone"
            className="auth-input"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="09 xxx xxx xxx"
          />
        </div>

        {error && <p className="auth-error">{error}</p>}
        {success && (
          <p className="auth-success">✓ PROFILE UPDATED</p>
        )}

        <button
          type="submit"
          className="btn btn-primary auth-submit"
          disabled={saving}
        >
          {saving ? "SAVING…" : "SAVE CHANGES →"}
        </button>
      </form>
    </div>
  );
}