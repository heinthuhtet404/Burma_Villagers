import { Link } from "react-router-dom";
import { formatPrice } from "../lib/format";
import { getProductStatus } from "../lib/products";
import Countdown from "./Countdown";

export default function DropHero({ drop }) {
  const { number, name, tagline, products = [], loading } = drop;

  const hero = products[0];

  const heroStatus = hero ? getProductStatus(hero) : "available";
  const isSold = heroStatus === "sold";
  const remainingPct = hero ? Math.min((hero.stock / 50) * 100, 100) : 0;

  return (
    <section className="drop-hero">
      <div className="container drop-hero-inner">
        <div className="drop-hero-text">
          <div className="drop-hero-status">
            <span className="drop-hero-status-dot" />
            LIVE NOW
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

          <p className="drop-hero-desc">
            The first drop from Burma Villagers. Four colorways of our
            signature 350 GSM air layer tee — built for structure, made
            for everyday wear.
          </p>

          <div className="drop-hero-actions">
            {hero && (
              <Link
                to={isSold ? "#" : `/product/${hero.slug}`}
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
            )}

            {hero && !isSold && (
              <div className="drop-hero-stock">
                <p className="drop-hero-stock-label">
                  {hero.stock} IN STOCK
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

        {hero && (
          <div className="drop-hero-image">
            <div className="drop-hero-image-inner">
              <img src={hero.image} alt={hero.name} />
            </div>

            <span className="drop-hero-image-badge">
              FEATURED — DROP {number}
            </span>

            <span className="drop-hero-image-index">№ {number} / 001</span>
          </div>
        )}
      </div>
    </section>
  );
}