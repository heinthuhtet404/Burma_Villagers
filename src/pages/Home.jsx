import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import ScrollMarquee from "../components/ScrollMarquee";
import { products } from "../data/products";
import { Link } from "react-router-dom";
import storyImg from "../images/story.jpg";
import useScrollReveal from "../hooks/useScrollReveal";
import useParallax from "../hooks/useParallax";

export default function Home() {
  const newDropRef  = useScrollReveal();
  const gridRef     = useScrollReveal({ threshold: 0.05 });
  const storyRef    = useScrollReveal({ threshold: 0.2 });
  const brandRef    = useScrollReveal({ threshold: 0.3 });
  const tiktokRef   = useScrollReveal({ threshold: 0.2 });
  const storyImgRef = useParallax({ speed: 0.12 });

  return (
    <>
      <Hero />

      {/* ============ NEW DROP ============ */}
      <section className="section new-drop">
        <div className="container">
          <div ref={newDropRef} className="section-head reveal">
            <div>
              <p className="section-eyebrow">NEW DROP</p>
              <h2 className="section-title">350 GSM AIR LAYER</h2>
            </div>
            <Link to="/shop" className="section-link">
              VIEW ALL →
            </Link>
          </div>

          <div ref={gridRef} className="product-grid reveal-stagger">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ 350 GSM STORY ============ */}
      <section className="section story">
        <div
          ref={storyRef}
          className="container story-inner reveal reveal--story"
        >
          <div className="story-image">
            <div ref={storyImgRef} className="story-image-inner">
              <img src={storyImg} alt="350 GSM fabric" />
            </div>
          </div>

          <div className="story-text">
            <p className="section-eyebrow">THE FABRIC</p>
            <h2 className="story-title">350 GSM</h2>
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

      {/* ============ MARQUEE ============ */}
      <ScrollMarquee />

      {/* ============ BRAND STATEMENT ============ */}
      <section className="section brand-statement">
        <div ref={brandRef} className="container reveal reveal--calm">
          <h2 className="brand-statement-title">MADE FOR EVERYDAY.</h2>
          <p className="brand-statement-body">
            Simple pieces for
            <br />
            the way we live.
          </p>
        </div>
      </section>

      {/* ============ TIKTOK CTA ============ */}
      <section className="section tiktok-cta">
        <div ref={tiktokRef} className="container tiktok-inner reveal">
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
            data-cursor="OPEN ↗"
          >
            FOLLOW ON TIKTOK →
          </a>
        </div>
      </section>
    </>
  );
}