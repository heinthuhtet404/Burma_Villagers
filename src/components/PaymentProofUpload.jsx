import { useRef, useState } from "react";
import { uploadPaymentProof } from "../lib/payments";

export default function PaymentProofUpload({
  value = null,
  onChange,
  label = "PAYMENT SCREENSHOT",
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(value);

  const handleFile = async (file) => {
    if (!file) return;

    setError("");

    // Client-side validation
    if (!file.type.startsWith("image/")) {
      setError("Only image files (JPG, PNG) are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB");
      return;
    }

    // Local preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    try {
      const url = await uploadPaymentProof(file);
      onChange(url);
      setPreview(url);
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err.message || "Upload failed. Try again.");
      setPreview(null);
      onChange(null);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
    setError("");
  };

  return (
    <div className="proof-upload">
      <label className="proof-upload-label">{label}</label>

      {preview ? (
        <div className="proof-upload-preview">
          <img src={preview} alt="Payment screenshot" />
          <div className="proof-upload-preview-actions">
            <button
              type="button"
              className="proof-upload-remove"
              onClick={handleRemove}
            >
              REMOVE
            </button>
          </div>
          {uploading && (
            <div className="proof-upload-loading">
              <span>UPLOADING…</span>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          className="proof-upload-drop"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <span className="proof-upload-drop-icon">📸</span>
          <span className="proof-upload-drop-text">
            {uploading ? "UPLOADING…" : "UPLOAD SCREENSHOT"}
          </span>
          <span className="proof-upload-drop-hint">
            JPG, PNG · Max 5MB
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: "none" }}
      />

      {error && <p className="proof-upload-error">{error}</p>}
    </div>
  );
}