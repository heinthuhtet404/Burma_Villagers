import { useState, useEffect } from "react";

const STORAGE_KEY = "underConstructionSeen";

export default function UnderConstructionAlert({ onDone }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (seen) {
      onDone?.();
    } else {
      setOpen(true);
    }
  }, [onDone]);

  // lock scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
    onDone?.(); // alert 2 ကို ပြခွင့်ပေး
  };

  if (!open) return null;

  return (
    <div className="uc-alert-overlay">
      <div className="uc-alert" role="dialog" aria-modal="true">
        <p className="uc-alert-eyebrow">NOTICE / 00</p>
        <h3 className="uc-alert-title">
          SITE UNDER
          <br />
          CONSTRUCTION
        </h3>

        <p className="uc-alert-text">
          This website is still in its early stage. Some things may be
          broken or not work as expected — we're fixing it step by step.
          Soon you'll be able to shop here smoothly.
        </p>

        <div className="uc-alert-highlight">
          <p className="uc-alert-highlight-label">
            TO ORDER NOW →
          </p>
          <p className="uc-alert-highlight-text">
            Please order directly via <strong>TikTok</strong> using the
            checkbox link on our page.
          </p>
        </div>

        <div className="uc-alert-actions">
          <button
            type="button"
            className="btn btn-primary uc-alert-btn"
            onClick={dismiss}
          >
            <span>I UNDERSTAND</span>
            <span className="uc-alert-arrow" aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}