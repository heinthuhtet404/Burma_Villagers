import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import DropHero from "../components/DropHero";
import useProducts from "../hooks/useProducts";
import useScrollReveal from "../hooks/useScrollReveal";
import { formatPrice } from "../lib/format";
import { getProductStatus } from "../lib/products";

const DROP_NUMBER = "001";
const DROP_NAME = "350 GSM AIR LAYER";
const DROP_TAGLINE = "HEAVY. CLEAN. EVERYDAY.";

export default function NewDrop() {
  const headerRef = useScrollReveal();
  const notifyRef = useScrollReveal({ threshold: 0.2 });
  const gridRef = useRef(null);

  const { products, loading, error } = useProducts({ onlyNew: true });

  // 🎯 Reveal grid as soon as products are rendered
  useEffect(() => {
    if (loading || products.length === 0) return;
    const el = gridRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      el.classList.add("is-revealed");
    });
  }, [loading, products.length]);

  return (
    <section className="new-drop-page">
      {/* Top ticker */}
      <div className="drop-ticker" aria-hidden="true">
        <div className="drop-ticker-track">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="drop-ticker-item">
              DROP {DROP_NUMBER}
              <span className="drop-ticker-dot">•</span>
              LIVE NOW
              <span className="drop-ticker-dot">•</span>
              {DROP_NAME}
              <span className="drop-ticker-dot">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <DropHero
        drop={{
          number: DROP_NUMBER,
          name: DROP_NAME,
          tagline: DROP_TAGLINE,
          products,
          loading,
        }}
      />

      {/* Header */}
      <div ref={headerRef} className="container drop-header reveal">
        <div>
          <p className="section-eyebrow">THE COLLECTION</p>
          <h2 className="drop-header-title">
            {products.length} PIECES.
            <br />
            ONE FABRIC.
          </h2>
        </div>
        <p className="drop-header-meta">YANGON</p>
      </div>

      {/* Items grid */}
      {loading && (
        <p className="section-loading container">Loading…</p>
      )}

      {!loading && !error && (
        <div
          ref={gridRef}
          className="container drop-grid reveal-stagger"
        >
          {products.map((item, i) => {
            const status = getProductStatus(item);
            const isSold = status === "sold";
            const pct = item.stock > 0 ? 100 : 0;

            return (
              <Link
                key={item.id}
                to={isSold ? "#" : `/product/${item.slug}`}
                className={`drop-card ${isSold ? "is-sold" : ""}`}
                data-cursor={isSold ? "SOLD" : "VIEW"}
                onClick={(e) => {
                  if (isSold) e.preventDefault();
                }}
                aria-disabled={isSold}
              >
                <div className="drop-card-image">
                  <img src={item.image} alt={item.name} />
                  <span className="drop-card-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {isSold && (
                    <span className="drop-card-sold">SOLD OUT</span>
                  )}
                  {status === "low" && !isSold && (
                    <span className="drop-card-low">LOW STOCK</span>
                  )}
                </div>

                <div className="drop-card-info">
                  <div className="drop-card-info-top">
                    <p className="drop-card-colorway">
                      {item.colorNames[0]?.name || "—"}
                    </p>
                    <p className="drop-card-price">
                      {formatPrice(item.price, item.currency)}
                    </p>
                  </div>

                  <p className="drop-card-name">{item.name}</p>

                  {!isSold && (
                    <div className="drop-card-stock">
                      <div className="drop-card-stock-bar">
                        <div
                          className="drop-card-stock-fill"
                          style={{ transform: `scaleX(${pct / 100})` }}
                        />
                      </div>
                      <p className="drop-card-stock-label">
                        {item.stock} IN STOCK
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Notify */}
      <div ref={notifyRef} className="drop-notify reveal reveal--story">
        <div className="container drop-notify-inner">
          <div>
            <p className="section-eyebrow">NEXT DROP</p>
            <h2 className="drop-notify-title">
              BE FIRST
              <br />
              TO KNOW.
            </h2>
          </div>

          <form
            className="drop-notify-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              className="drop-notify-input"
              required
            />
            <button
              type="submit"
              className="btn btn-primary drop-notify-btn"
            >
              <span>NOTIFY ME</span>
              <span className="drop-notify-arrow">→</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}