import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageUploader from "./ImageUploader";
import VariantsEditor from "./VariantsEditor";
import { slugify } from "../../lib/format";

export default function ProductForm({
  initial = null,
  onSubmit,
  submitLabel = "SAVE",
}) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: initial?.name || "",
    slug: initial?.slug || "",
    description: initial?.description || "",
    price: initial?.price || 25000,
    isNew: initial?.isNew ?? true,
    isActive: initial?.isActive ?? true,
    dropId: initial?.dropId || "drop-001",
  });

  const [images, setImages] = useState(initial?.images || []);
  const [variants, setVariants] = useState(initial?.variants || []);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleNameBlur = () => {
    if (!form.slug && form.name) {
      update("slug", slugify(form.name));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!form.name.trim()) return setError("Name is required");
    if (!form.slug.trim()) return setError("Slug is required");
    if (!form.price || form.price <= 0)
      return setError("Price must be greater than 0");
    if (images.length === 0) return setError("Add at least one image");
    if (variants.length === 0) return setError("Add at least one variant");

    setSaving(true);
    try {
      await onSubmit({
        ...form,
        price: parseInt(form.price) || 0,
        images,
        variants,
      });
      navigate("/admin/products");
    } catch (err) {
      setError(err.message || "Save failed");
      setSaving(false);
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form-grid">
        {/* LEFT */}
        <div className="admin-form-main">
          <div className="admin-form-field">
            <label className="admin-form-label" htmlFor="name">
              PRODUCT NAME
            </label>
            <input
              id="name"
              type="text"
              className="admin-form-input"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              onBlur={handleNameBlur}
              placeholder="350 GSM AIR LAYER TEE"
              required
            />
          </div>

          <div className="admin-form-field">
            <label className="admin-form-label" htmlFor="slug">
              SLUG (URL)
            </label>
            <input
              id="slug"
              type="text"
              className="admin-form-input"
              value={form.slug}
              onChange={(e) => update("slug", slugify(e.target.value))}
              placeholder="air-layer-black"
              required
            />
            <p className="admin-form-hint">
              → /product/{form.slug || "your-slug"}
            </p>
          </div>

          <div className="admin-form-field">
            <label className="admin-form-label" htmlFor="description">
              DESCRIPTION
            </label>
            <textarea
              id="description"
              className="admin-form-input admin-form-textarea"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={4}
              placeholder="Heavier-weight fabric…"
            />
          </div>

          <div className="admin-form-field">
            <label className="admin-form-label">IMAGES</label>
            <ImageUploader images={images} onChange={setImages} />
          </div>

          <div className="admin-form-field">
            <label className="admin-form-label">VARIANTS</label>
            <VariantsEditor variants={variants} onChange={setVariants} />
          </div>
        </div>

        {/* RIGHT */}
        <aside className="admin-form-side">
          <div className="admin-form-side-panel">
            <p className="admin-form-side-title">DETAILS</p>

            <div className="admin-form-field">
              <label className="admin-form-label" htmlFor="price">
                PRICE (MMK)
              </label>
              <input
                id="price"
                type="number"
                min="0"
                className="admin-form-input"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                required
              />
            </div>

            <div className="admin-form-field">
              <label className="admin-form-label" htmlFor="dropId">
                DROP ID
              </label>
              <input
                id="dropId"
                type="text"
                className="admin-form-input"
                value={form.dropId}
                onChange={(e) => update("dropId", e.target.value)}
                placeholder="drop-001"
              />
            </div>

            <label className="admin-form-check">
              <input
                type="checkbox"
                checked={form.isNew}
                onChange={(e) => update("isNew", e.target.checked)}
              />
              <span>Mark as NEW</span>
            </label>

            <label className="admin-form-check">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => update("isActive", e.target.checked)}
              />
              <span>Active (visible on storefront)</span>
            </label>
          </div>

          {error && <p className="admin-form-error">{error}</p>}

          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-form-btn admin-form-btn--ghost"
              onClick={() => navigate("/admin/products")}
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="admin-form-btn admin-form-btn--primary"
              disabled={saving}
            >
              {saving ? "SAVING…" : submitLabel}
            </button>
          </div>
        </aside>
      </div>
    </form>
  );
}