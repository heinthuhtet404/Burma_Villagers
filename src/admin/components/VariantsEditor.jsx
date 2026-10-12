import { useState } from "react";

const SIZES = ["S", "M", "L", "XL", "XXL"];
const COLORS = [
  { name: "Black", hex: "#111311" },
  { name: "Ivory", hex: "#F5F3EC" },
  { name: "Forest", hex: "#1D4020" },
  { name: "Stone", hex: "#c9c6bc" },
];

export default function VariantsEditor({ variants = [], onChange }) {
  const [selectedColor, setSelectedColor] = useState(COLORS[0].hex);

  const getStock = (color, size) => {
    const v = variants.find((x) => x.color === color && x.size === size);
    return v?.stock || 0;
  };

  const setStock = (color, colorName, size, value) => {
    const num = Math.max(0, parseInt(value) || 0);
    const idx = variants.findIndex(
      (v) => v.color === color && v.size === size
    );

    const next = [...variants];

    if (idx >= 0) {
      if (num === 0) {
        next.splice(idx, 1);
      } else {
        next[idx] = { ...next[idx], stock: num };
      }
    } else if (num > 0) {
      next.push({
        color,
        colorName,
        size,
        stock: num,
      });
    }

    onChange(next);
  };

  return (
    <div className="admin-variants">
      <div className="admin-variants-colors">
        <span className="admin-form-label">COLOR</span>
        <div className="admin-variants-swatches">
          {COLORS.map((c) => (
            <button
              key={c.hex}
              type="button"
              className={`admin-variant-swatch ${
                selectedColor === c.hex ? "is-active" : ""
              }`}
              style={{ background: c.hex }}
              onClick={() => setSelectedColor(c.hex)}
              aria-label={c.name}
              title={c.name}
            />
          ))}
        </div>
      </div>

      <div className="admin-variants-grid">
        <div className="admin-variants-grid-head">
          <span className="admin-form-label">SIZE</span>
          {SIZES.map((s) => (
            <span key={s} className="admin-variants-size-label">
              {s}
            </span>
          ))}
        </div>

        {COLORS.map((c) => (
          <div key={c.hex} className="admin-variants-row">
            <span className="admin-variants-color-cell">
              <span
                className="admin-variants-dot"
                style={{ background: c.hex }}
              />
              {c.name}
            </span>

            {SIZES.map((s) => (
              <input
                key={s}
                type="number"
                min="0"
                className="admin-variants-input"
                value={getStock(c.hex, s) || ""}
                onChange={(e) =>
                  setStock(c.hex, c.name, s, e.target.value)
                }
                placeholder="0"
              />
            ))}
          </div>
        ))}
      </div>

      <p className="admin-variants-hint">
        Enter stock quantity. Leave empty or 0 to skip.
      </p>
    </div>
  );
}