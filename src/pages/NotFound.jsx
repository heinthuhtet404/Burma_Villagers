import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <section className="notfound">
      {/* Top marquee ticker */}
      <div className="notfound-ticker" aria-hidden="true">
        <div className="notfound-ticker-track">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="notfound-ticker-item">
              404
              <span className="notfound-ticker-dot">•</span>
              PAGE NOT FOUND
              <span className="notfound-ticker-dot">•</span>
              LOST IN THE VILLAGE
              <span className="notfound-ticker-dot">•</span>
            </span>
          ))}
        </div>
      </div>

      <div className="container notfound-inner">
        {/* Meta strip */}
        <div className="notfound-meta">
          <span className="notfound-meta-item">
            <span className="notfound-meta-dot" />
            ERROR — 404
          </span>
          <span className="notfound-meta-item">
            {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="notfound-meta-item">YANGON · MM</span>
        </div>

        {/* Giant 404 */}
        <div className="notfound-code-wrap">
          <h1 className="notfound-code" aria-label="404">
            <span className="notfound-code-digit">4</span>
            <span className="notfound-code-digit notfound-code-digit--outline">
              0
            </span>
            <span className="notfound-code-digit">4</span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className="notfound-sub-wrap">
          <p className="notfound-eyebrow">
            <span className="notfound-eyebrow-line" />
            PAGE NOT FOUND
          </p>

          <h2 className="notfound-title">
            THIS PAGE
            <br />
            WANDERED OFF.
          </h2>

          <p className="notfound-desc">
            The link you followed is broken, or the page has moved.
            Let's get you back to something solid.
          </p>
        </div>

        {/* Actions */}
        <div className="notfound-actions">
          <Link to="/shop" className="btn btn-primary notfound-cta">
            <span>SHOP THE DROP</span>
            <span className="notfound-cta-arrow">→</span>
          </Link>

          <Link to="/" className="notfound-link">
            BACK TO HOME
          </Link>

          <button
            type="button"
            className="notfound-link notfound-link--ghost"
            onClick={() => navigate(-1)}
          >
            ← GO BACK
          </button>
        </div>

        {/* Footer marker */}
        <div className="notfound-foot">
          <span className="notfound-foot-line" />
          <p className="notfound-foot-text">
            BURMA VILLAGERS — HEAVY FEEL. CLEAN LOOK.
          </p>
        </div>
      </div>
    </section>
  );
}