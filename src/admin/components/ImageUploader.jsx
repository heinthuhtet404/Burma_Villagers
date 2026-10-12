import { useRef, useState } from "react";
import { uploadProductImage, deleteProductImage } from "../../lib/admin";

export default function ImageUploader({ images = [], onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = async (files) => {
    setError("");
    setUploading(true);

    try {
      const urls = [];
      for (const file of files) {
        if (!file.type.startsWith("image/")) continue;
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} is over 5MB`);
        }
        const url = await uploadProductImage(file);
        urls.push(url);
      }
      onChange([...images, ...urls]);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (url) => {
    onChange(images.filter((u) => u !== url));
    // Optionally delete from storage:
    // await deleteProductImage(url);
  };

  const handleMove = (url, direction) => {
    const idx = images.indexOf(url);
    if (idx < 0) return;
    const next = [...images];
    const target = idx + direction;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  return (
    <div className="admin-uploader">
      <div className="admin-uploader-grid">
        {images.map((url, i) => (
          <div key={url} className="admin-uploader-item">
            <img src={url} alt={`Image ${i + 1}`} />

            <div className="admin-uploader-item-actions">
              <button
                type="button"
                onClick={() => handleMove(url, -1)}
                disabled={i === 0}
                aria-label="Move left"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => handleMove(url, 1)}
                disabled={i === images.length - 1}
                aria-label="Move right"
              >
                →
              </button>
              <button
                type="button"
                onClick={() => handleRemove(url)}
                aria-label="Remove"
              >
                ×
              </button>
            </div>

            {i === 0 && (
              <span className="admin-uploader-primary">PRIMARY</span>
            )}
          </div>
        ))}

        <button
          type="button"
          className="admin-uploader-add"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "UPLOADING…" : "+ ADD IMAGE"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) handleFiles(files);
          e.target.value = "";
        }}
      />

      {error && <p className="admin-form-error">{error}</p>}

      <p className="admin-uploader-hint">
        JPG / PNG · Max 5MB · First image = primary
      </p>
    </div>
  );
}