import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  const navItems = [
    { id: "01", label: "ALL PRODUCTS", to: "/shop" },
    { id: "02", label: "NEW DROP", to: "/shop" },
    { id: "03", label: "OUR STORY", to: "/about" },
    { id: "04", label: "CONTACT", to: "/about" },
  ];

  return (
    <footer className="footer">
      {/* ============================================
          Top row — brand mark
          ============================================ */}
      <div className="container footer-top">
        <div className="footer-top-brand">
          <span className="footer-top-dot" />
          <span className="footer-top-text">
            BURMA VILLAGERS — EST. 2026
          </span>
        </div>

        <span className="footer-top-tag">
          Heavy feel. Clean look.
        </span>
      </div>

      {/* ============================================
          Main grid — nav + follow + meta
          ============================================ */}
      <div className="container footer-grid">
        {/* --- Column 1: Shop --- */}
        <div className="footer-col">
          <p className="footer-col-title">SHOP</p>
          <ul className="footer-col-list">
            {navItems.slice(0, 2).map((item) => (
              <li key={item.id}>
                <Link to={item.to}>
                  <span className="footer-col-id">{item.id}</span>
                  <span className="footer-col-text">{item.label}</span>
                  <span className="footer-col-arrow" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* --- Column 2: About --- */}
        <div className="footer-col">
          <p className="footer-col-title">ABOUT</p>
          <ul className="footer-col-list">
            {navItems.slice(2).map((item) => (
              <li key={item.id}>
                <Link to={item.to}>
                  <span className="footer-col-id">{item.id}</span>
                  <span className="footer-col-text">{item.label}</span>
                  <span className="footer-col-arrow" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* --- Column 3: Follow --- */}
        <div className="footer-col">
          <p className="footer-col-title">FOLLOW</p>
          <ul className="footer-col-list">
            <li>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
              >
                <span className="footer-col-id">05</span>
                <span className="footer-col-text">TIKTOK</span>
                <span className="footer-col-arrow" aria-hidden="true">↗</span>
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
              >
                <span className="footer-col-id">06</span>
                <span className="footer-col-text">INSTAGRAM</span>
                <span className="footer-col-arrow" aria-hidden="true">↗</span>
              </a>
            </li>
          </ul>
        </div>

        {/* --- Column 4: Meta --- */}
        <div className="footer-col footer-col--meta">
          <p className="footer-col-title">INFO</p>
          <div className="footer-meta">
            <p className="footer-meta-line">
              <span className="footer-meta-key">FROM</span>
              <span className="footer-meta-val">YANGON, MM</span>
            </p>
            <p className="footer-meta-line">
              <span className="footer-meta-key">TIME</span>
              <span className="footer-meta-val">GMT +6:30</span>
            </p>
            <p className="footer-meta-line">
              <span className="footer-meta-key">MAIL</span>
              <a
                href="mailto:hello@burmavillagers.com"
                className="footer-meta-val"
              >
                HELLO@BURMAVILLAGERS.COM
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* ============================================
          Ticker strip
          ============================================ */}
      <div className="footer-ticker" aria-hidden="true">
        <div className="footer-ticker-track">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="footer-ticker-item">
              BURMA VILLAGERS
              <span className="footer-ticker-dot">•</span>
              350 GSM
              <span className="footer-ticker-dot">•</span>
              MADE FOR EVERYDAY
              <span className="footer-ticker-dot">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* ============================================
          Signature bar
          ============================================ */}
      <div className="container footer-signature">
        <p className="footer-signature-copy">
          © {year} BURMA VILLAGERS
        </p>
        <p className="footer-signature-mark">
          MADE IN MYANMAR
          <span className="footer-signature-dot" />
        </p>
      </div>
    </footer>
  );
}