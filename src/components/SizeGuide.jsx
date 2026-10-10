import { useEffect } from "react";

const MEASUREMENTS = [
  {
    size: "S",
    chest: "96 cm",
    length: "68 cm",
    shoulder: "44 cm",
    sleeve: "21 cm",
  },
  {
    size: "M",
    chest: "102 cm",
    length: "70 cm",
    shoulder: "46 cm",
    sleeve: "22 cm",
  },
  {
    size: "L",
    chest: "108 cm",
    length: "72 cm",
    shoulder: "48 cm",
    sleeve: "23 cm",
  },
  {
    size: "XL",
    chest: "114 cm",
    length: "74 cm",
    shoulder: "50 cm",
    sleeve: "24 cm",
  },
];

export default function SizeGuide({ open, onClose }) {
  // Lock body scroll
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // ESC closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        className={`size-guide-overlay ${open ? "is-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`size-guide ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <div className="size-guide-head">
          <div>
            <p className="section-eyebrow">SIZE GUIDE</p>
            <h2 className="size-guide-title">
              350 GSM — FIT
            </h2>
          </div>
          <button
            className="size-guide-close"
            onClick={onClose}
            aria-label="Close size guide"
          >
            <span />
            <span />
          </button>
        </div>

        <div className="size-guide-body">
          <p className="size-guide-lead">
            Our tees are cut for a structured, boxy fit. If you prefer a
            relaxed drape, size up once.
          </p>

          <div className="size-guide-table">
            <div className="size-guide-row size-guide-row--head">
              <span>SIZE</span>
              <span>CHEST</span>
              <span>LENGTH</span>
              <span>SHOULDER</span>
              <span>SLEEVE</span>
            </div>

            {MEASUREMENTS.map((m) => (
              <div key={m.size} className="size-guide-row">
                <span className="size-guide-cell size-guide-cell--size">
                  {m.size}
                </span>
                <span className="size-guide-cell">{m.chest}</span>
                <span className="size-guide-cell">{m.length}</span>
                <span className="size-guide-cell">{m.shoulder}</span>
                <span className="size-guide-cell">{m.sleeve}</span>
              </div>
            ))}
          </div>

          <div className="size-guide-how">
            <p className="size-guide-how-title">HOW TO MEASURE</p>
            <ol className="size-guide-how-list">
              <li>
                <span>01</span>
                Lay your best-fitting tee flat on a table.
              </li>
              <li>
                <span>02</span>
                Measure pit-to-pit across the chest.
              </li>
              <li>
                <span>03</span>
                Measure from collar to hem for length.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}