import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../../lib/account";

const empty = {
  label: "Home",
  name: "",
  phone: "",
  address: "",
  city: "Yangon",
  is_default: false,
};

export default function AccountAddresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // null | "new" | id
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getAddresses(user.id);
      setAddresses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [user]);

  const openNew = () => {
    setForm(empty);
    setEditing("new");
  };

  const openEdit = (addr) => {
    setForm({
      label: addr.label,
      name: addr.name,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      is_default: addr.is_default,
    });
    setEditing(addr.id);
  };

  const closeForm = () => {
    setEditing(null);
    setForm(empty);
    setError("");
  };

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editing === "new") {
        await createAddress(user.id, form);
      } else {
        await updateAddress(editing, form);
      }
      await load();
      closeForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await deleteAddress(id);
      setAddresses((list) => list.filter((a) => a.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(user.id, id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="account-card">
      <div className="account-card-head">
        <p className="account-card-title">SAVED ADDRESSES</p>
        {!editing && (
          <button className="account-btn-primary" onClick={openNew}>
            + ADD ADDRESS
          </button>
        )}
      </div>

      {error && <p className="auth-error">{error}</p>}

      {/* Form */}
      {editing && (
        <form className="account-address-form" onSubmit={handleSubmit}>
          <p className="account-card-subtitle">
            {editing === "new" ? "NEW ADDRESS" : "EDIT ADDRESS"}
          </p>

          <div className="account-address-form-grid">
            <div className="auth-field">
              <label className="auth-label">LABEL</label>
              <input
                className="auth-input"
                value={form.label}
                onChange={(e) => update("label", e.target.value)}
                placeholder="Home / Office"
              />
            </div>
            <div className="auth-field">
              <label className="auth-label">FULL NAME</label>
              <input
                className="auth-input"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
              />
            </div>
            <div className="auth-field">
              <label className="auth-label">PHONE</label>
              <input
                className="auth-input"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                required
              />
            </div>
            <div className="auth-field">
              <label className="auth-label">CITY</label>
              <input
                className="auth-input"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">ADDRESS</label>
            <textarea
              className="auth-input"
              rows={3}
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              required
            />
          </div>

          <label className="account-address-default">
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(e) => update("is_default", e.target.checked)}
            />
            <span>Set as default address</span>
          </label>

          <div className="account-address-form-actions">
            <button
              type="button"
              className="account-btn-ghost"
              onClick={closeForm}
              disabled={saving}
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="account-btn-primary"
              disabled={saving}
            >
              {saving ? "SAVING…" : "SAVE"}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {loading && <p className="account-empty">Loading…</p>}

      {!loading && addresses.length === 0 && !editing && (
        <p className="account-empty">No saved addresses yet.</p>
      )}

      {!loading && addresses.length > 0 && (
        <div className="account-addresses">
          {addresses.map((a) => (
            <div key={a.id} className="account-address">
              <div className="account-address-head">
                <span className="account-address-label">{a.label}</span>
                {a.is_default && (
                  <span className="account-address-badge">DEFAULT</span>
                )}
              </div>
              <p className="account-address-body">
                <strong>{a.name}</strong>
                <br />
                {a.address}
                <br />
                {a.city}
                <br />
                {a.phone}
              </p>
              <div className="account-address-actions">
                {!a.is_default && (
                  <button
                    className="account-address-action"
                    onClick={() => handleSetDefault(a.id)}
                  >
                    SET DEFAULT
                  </button>
                )}
                <button
                  className="account-address-action"
                  onClick={() => openEdit(a)}
                >
                  EDIT
                </button>
                <button
                  className="account-address-action account-address-action--danger"
                  onClick={() => handleDelete(a.id)}
                >
                  DELETE
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}