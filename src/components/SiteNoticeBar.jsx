import { useState, useEffect } from "react";

const STORAGE_KEY = "siteNoticeDismissed";

export default function SiteNoticeBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="site-notice" role="status">
      <div className="site-notice-pill">
        <span className="site-notice-dot" />
        <div className="site-notice-copy">
          <p className="site-notice-title">Site in progress</p>
          <p className="site-notice-text">
            Order via <strong>TikTok chat</strong> for the smoothest
            experience.
          </p>
        </div>
        <button
          type="button"
          className="site-notice-close"
          onClick={dismiss}
          aria-label="Dismiss notice"
        >
          <span />
          <span />
        </button>
      </div>
    </div>
  );
}