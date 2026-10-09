import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";
import { Link } from "react-router-dom";
import storyImg from "../images/story.jpg";

export default function Home() {
  return (
    <>
      <Hero />

      {/* ============ NEW DROP ============ */}
      <section className="section new-drop">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="section-eyebrow">NEW DROP</p>
              <h2 className="section-title">350 GSM AIR LAYER</h2>
            </div>
            <Link to="/shop" className="section-link">
              VIEW ALL →
            </Link>
          </div>

          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ 350 GSM STORY ============ */}
      <section className="section story">
        <div className="container story-inner">
          <div className="story-image">
            <img src={storyImg} alt="350 GSM fabric" />
          </div>

          <div className="story-text">
            <p className="section-eyebrow">THE FABRIC</p>
            <h2 className="story-title">
              350 GSM
            </h2>
            <h3 className="story-sub">
              HEAVIER.
              <br />
              CLEANER.
              <br />
              BUILT FOR EVERYDAY.
            </h3>
            <p className="story-body">
              A heavier-weight fabric designed for a structured,
              substantial feel.
            </p>
          </div>
        </div>
      </section>

      {/* ============ BRAND STATEMENT ============ */}
      <section className="section brand-statement">
        <div className="container">
          <h2 className="brand-statement-title">
            MADE FOR EVERYDAY.
          </h2>
          <p className="brand-statement-body">
            Simple pieces for
            <br />
            the way we live.
          </p>
        </div>
      </section>

      {/* ============ TIKTOK CTA ============ */}
      <section className="section tiktok-cta">
        <div className="container tiktok-inner">
          <div>
            <p className="section-eyebrow">FOLLOW THE VILLAGERS</p>
            <h2 className="tiktok-title">
              See how the latest drops
              <br />
              look in real life.
            </h2>
          </div>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            FOLLOW ON TIKTOK →
          </a>
        </div>
      </section>
    </>
  );
}