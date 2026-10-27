import { useState, useEffect } from "react";

export default function VpnAlert() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // တစ်ခါပဲ ပြချင်ရင် — localStorage
    // tab တစ်ခုအတွင်းပဲ ပြချင်ရင် → sessionStorage
    const seen = sessionStorage.getItem("vpnAlertSeen");
    if (!seen) setOpen(true);
  }, []);

  // lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && dismiss();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const dismiss = () => {
    sessionStorage.setItem("vpnAlertSeen", "1");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="vpn-alert-overlay" onClick={dismiss}>
      <div
        className="vpn-alert"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vpn-alert-title"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="vpn-alert-eyebrow">NOTICE / 01</p>
        <h3 id="vpn-alert-title" className="vpn-alert-title">
          VPN Required
        </h3>
        <p className="vpn-alert-text">
          This site requires a VPN connection to display products. Please enable your VPN.
        </p>
        <div className="vpn-alert-actions">
          <button
            type="button"
            className="btn btn-primary vpn-alert-btn"
            onClick={dismiss}
          >
            <span>I UNDERSTAND</span>
            <span className="vpn-alert-arrow" aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}