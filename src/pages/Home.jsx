import { useEffect, useRef } from "react";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import ScrollMarquee from "../components/ScrollMarquee";
import { Link } from "react-router-dom";
import storyImg from "../images/four_layer-airlayer-lightning.jpg";
import useScrollReveal from "../hooks/useScrollReveal";
import useParallax from "../hooks/useParallax";
import useProducts from "../hooks/useProducts";

export default function Home() {
  const newDropRef = useScrollReveal();
  const storyRef = useScrollReveal({ threshold: 0.2 });
  const brandRef = useScrollReveal({ threshold: 0.3 });
  const tiktokRef = useScrollReveal({ threshold: 0.2 });
  const storyImgRef = useParallax({ speed: 0.12 });
  const gridRef = useRef(null);

  // NEW DROP မဟုတ်တော့ဘဲ all products ဆွဲ
  const { products, loading, error, total } = useProducts();

  // Reveal grid as soon as products are rendered
  useEffect(() => {
    if (loading || products.length === 0) return;
    const el = gridRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      el.classList.add("is-revealed");
    });
  }, [loading, products.length]);

  return (
    <>
      <Hero />

      {/* ============ SHOP SECTION ============ */}
      <section className="section new-drop">
        <div className="container">
          <div ref={newDropRef} className="section-head reveal">
            <div>
              <p className="section-eyebrow">ALL PRODUCTS</p>
              <h2 className="section-title">SHOP</h2>
            </div>
            <Link to="/shop" className="section-link">
              VIEW ALL →
            </Link>
          </div>

          {loading && (
            <p className="section-loading">Loading products…</p>
          )}

          {error && (
            <p className="section-error">
              Failed to load products. Please refresh.
            </p>
          )}

          {!loading && !error && (
            <>
              <p className="shop-count">
                {products.length} PRODUCT{products.length !== 1 ? "S" : ""}
                {total != null && total !== products.length
                  ? ` OF ${total}`
                  : ""}
              </p>

              <div
                ref={gridRef}
                className="product-grid reveal-stagger"
              >
                {products.slice(0, 8).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Home မှာ pagination မလို — Shop page ကို ညွှန်း */}
              {products.length > 8 && (
                <div className="shop-loadmore">
                  <Link to="/shop" className="shop-loadmore-btn">
                    <span>VIEW ALL PRODUCTS</span>
                    <span className="shop-loadmore-count">
                      ({products.length}{total != null ? ` / ${total}` : ""})
                    </span>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <ScrollMarquee />

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
            href="https://www.tiktok.com/@burma.villagers?_r=1&_t=ZS-9AnaUZa0hfw"
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