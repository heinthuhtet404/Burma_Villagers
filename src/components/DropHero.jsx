import { Link } from "react-router-dom";
import { formatPrice, getProductStatus } from "../data/products";
import Countdown from "./Countdown";

export default function DropHero({ drop }) {
  const {
    heroProduct,
    number,
    name,
    tagline,
    description,
    releaseDate,
    status,
  } = drop;

  if (!heroProduct) return null;

  const heroStatus = getProductStatus(heroProduct);
  const isSold = heroStatus === "sold";
  const remainingPct = Math.round(
    (heroProduct.stock / heroProduct.total) * 100
  );

  return (
    <section className="drop-hero">
      <div className="container drop-hero-inner">
        <div className="drop-hero-text">
          <div className="drop-hero-status">
            <span className="drop-hero-status-dot" />
            {status === "live" ? "LIVE NOW" : "UPCOMING"}
          </div>

          <p className="drop-hero-eyebrow">
            DROP {number} — {name}
          </p>

          <h1 className="drop-hero-title">
            {tagline
              .split(".")
              .filter(Boolean)
              .map((line, i) => (
                <span key={i} className="drop-hero-title-line">
                  {line.trim()}.
                </span>
              ))}
          </h1>

          <p className="drop-hero-desc">{description}</p>

          {status === "upcoming" && (
            <div className="drop-hero-countdown">
              <p className="drop-hero-countdown-label">DROPS IN</p>
              <Countdown target={releaseDate.getTime()} />
            </div>
          )}

          <div className="drop-hero-actions">
            <Link
              to={isSold ? "#" : `/product/${heroProduct.id}`}
              className="btn btn-primary drop-hero-cta"
              onClick={(e) => isSold && e.preventDefault()}
              aria-disabled={isSold}
            >
              <span>
                {isSold ? "SOLD OUT" : `SHOP DROP ${number}`}
              </span>
              {!isSold && (
                <span className="drop-hero-cta-arrow">→</span>
              )}
            </Link>

            {!isSold && (
              <div className="drop-hero-stock">
                <p className="drop-hero-stock-label">
                  {heroProduct.stock} / {heroProduct.total} REMAINING
                </p>
                <div className="drop-hero-stock-bar">
                  <div
                    className="drop-hero-stock-fill"
                    style={{ transform: `scaleX(${remainingPct / 100})` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="drop-hero-image">
          <div className="drop-hero-image-inner">
            <img src={heroProduct.image} alt={heroProduct.name} />
          </div>

          <span className="drop-hero-image-badge">
            FEATURED — DROP {number}
          </span>

          <span className="drop-hero-image-index">№ {number} / 001</span>
        </div>
      </div>
    </section>
  );
}