import { Link } from "react-router-dom";
import DropHero from "../components/DropHero";
import { currentDrop, pastDrops, resolveDrop } from "../data/drops";
import { formatPrice, getProductStatus } from "../data/products";
import useScrollReveal from "../hooks/useScrollReveal";

export default function NewDrop() {
  const drop = resolveDrop(currentDrop);
  const headerRef = useScrollReveal();
  const gridRef = useScrollReveal({ threshold: 0.05 });
  const notifyRef = useScrollReveal({ threshold: 0.2 });
  const archiveRef = useScrollReveal({ threshold: 0.2 });

  return (
    <section className="new-drop-page">
      {/* Top ticker */}
      <div className="drop-ticker" aria-hidden="true">
        <div className="drop-ticker-track">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="drop-ticker-item">
              DROP {drop.number}
              <span className="drop-ticker-dot">•</span>
              LIVE NOW
              <span className="drop-ticker-dot">•</span>
              {drop.name}
              <span className="drop-ticker-dot">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <DropHero drop={drop} />

      {/* Header */}
      <div ref={headerRef} className="container drop-header reveal">
        <div>
          <p className="section-eyebrow">THE COLLECTION</p>
          <h2 className="drop-header-title">
            {drop.items.length} PIECES.
            <br />
            ONE FABRIC.
          </h2>
        </div>
        <p className="drop-header-meta">
          {drop.releaseDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}{" "}
          · YANGON
        </p>
      </div>

      {/* Items grid */}
      <div ref={gridRef} className="container drop-grid reveal-stagger">
        {drop.items.map((item, i) => {
          const status = getProductStatus(item);
          const isSold = status === "sold";
          const pct = Math.round((item.stock / item.total) * 100);

          return (
            <Link
              key={item.id}
              to={isSold ? "#" : `/product/${item.id}`}
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

                {isSold && <span className="drop-card-sold">SOLD OUT</span>}
                {status === "low" && !isSold && (
                  <span className="drop-card-low">LOW STOCK</span>
                )}
              </div>

              <div className="drop-card-info">
                <div className="drop-card-info-top">
                  <p className="drop-card-colorway">
                    {item.colors[0] === "#111311"
                      ? "BLACK"
                      : item.colors[0] === "#F5F3EC"
                      ? "IVORY"
                      : item.colors[0] === "#1D4020"
                      ? "FOREST"
                      : "STONE"}
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
                      {item.stock} / {item.total}
                    </p>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

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

      {/* Archive */}
      <div ref={archiveRef} className="container drop-archive reveal">
        <div className="drop-archive-head">
          <p className="section-eyebrow">ARCHIVE</p>
          <h2 className="drop-archive-title">PAST DROPS</h2>
        </div>

        <ul className="drop-archive-list">
          {pastDrops.map((d) => (
            <li key={d.id} className="drop-archive-item">
              <span className="drop-archive-num">№ {d.number}</span>
              <span className="drop-archive-name">{d.name}</span>
              <span className="drop-archive-date">{d.date}</span>
              <span className="drop-archive-status">
                {d.status.toUpperCase()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}