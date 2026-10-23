import { Link } from "react-router-dom";
import useMagnetic from "../hooks/useMagnetic";

export default function Hero() {
  const ctaRef = useMagnetic({
    strength: 0.3,
    radius: 100,
    cursorPull: 0.1,
  });

  return (
    <section className="hero hero--swiss">
      {/* ============================================
          GRID LINES — 12 columns (subtle)
          ============================================ */}
      <div className="hero-swiss-grid" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>

      <div className="container hero-swiss-inner">
        {/* ============================================
            ROW 1 — TOP: monogram + index
            ============================================ */}
        <div className="hero-swiss-top">
          <div className="hero-swiss-monogram">
            <span className="hero-swiss-monogram-text">BV</span>
            <span className="hero-swiss-monogram-label">EST. 2026</span>
          </div>

          <div className="hero-swiss-index">
            <span className="hero-swiss-index-num">01</span>
            <span className="hero-swiss-index-label">/ 04</span>
          </div>
        </div>

        {/* ============================================
            ROW 2 — CENTER: main content
            ============================================ */}
        <div className="hero-swiss-center">
          {/* Left column — vertical meta */}
          <div className="hero-swiss-left">
            <span className="hero-swiss-vertical">
              KANAUNG — MYANMAR
            </span>
            <span className="hero-swiss-line" />
            <span className="hero-swiss-vertical">
              350 GSM AIR LAYER
            </span>
          </div>

          {/* Main title */}
          <div className="hero-swiss-title-wrap">
            <h1 className="hero-swiss-title">
              <span className="hero-swiss-title-line">BURMA</span>
              <span className="hero-swiss-title-line hero-swiss-title-line--indent">
                VILLAGERS
              </span>
            </h1>

            <p className="hero-swiss-subtitle">
              Built for everyday.
            </p>
          </div>

          {/* Right column — description + CTA */}
          <div className="hero-swiss-right">
            <p className="hero-swiss-desc">
              Heavyweight essentials.
              Structured. Clean. Everyday.
            </p>

            <div
              ref={ctaRef}
              className="hero-swiss-cta"
              data-cursor="SHOP →"
            >
              <Link to="/shop" className="hero-swiss-btn">
                <span>SHOP THE DROP</span>
                <span className="hero-swiss-btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ============================================
            ROW 3 — BOTTOM: meta row
            ============================================ */}
        <div className="hero-swiss-bottom">
          <div className="hero-swiss-bottom-item">
            <span className="hero-swiss-bottom-key">FABRIC</span>
            <span className="hero-swiss-bottom-val">350 GSM</span>
          </div>
          <div className="hero-swiss-bottom-item">
            <span className="hero-swiss-bottom-key">CUT</span>
            <span className="hero-swiss-bottom-val">STRUCTURED</span>
          </div>
          <div className="hero-swiss-bottom-item">
            <span className="hero-swiss-bottom-key">SIZES</span>
            <span className="hero-swiss-bottom-val">S — XL</span>
          </div>
          <div className="hero-swiss-bottom-item">
            <span className="hero-swiss-bottom-key">FROM</span>
            <span className="hero-swiss-bottom-val">KANAUNG</span>
          </div>
          <div className="hero-swiss-bottom-item hero-swiss-bottom-item--end">
            <span className="hero-swiss-bottom-val">SCROLL ↓</span>
          </div>
        </div>
      </div>
    </section>
  );
}