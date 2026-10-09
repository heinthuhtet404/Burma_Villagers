import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { products, formatPrice } from "../data/products";
import SplitText from "../components/SplitText";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id) || products[0];

  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(null);
  const [switching, setSwitching] = useState(false);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const switchTimer = useRef(null);
  const addTimer = useRef(null);

  // Reset variant state on route change
  useEffect(() => {
    setColor(product.colors[0]);
    setSize(null);
    setActiveImg(0);
  }, [product.id]);

  useEffect(() => {
    return () => {
      clearTimeout(switchTimer.current);
      clearTimeout(addTimer.current);
    };
  }, []);

  const handleColorChange = (nextColor) => {
    if (nextColor === color) return;
    setSwitching(true);
    clearTimeout(switchTimer.current);
    switchTimer.current = setTimeout(() => {
      setColor(nextColor);
      setSwitching(false);
    }, 180);
  };

  const handleAddToCart = () => {
    if (!size) return;
    setAdded(true);
    clearTimeout(addTimer.current);
    addTimer.current = setTimeout(() => setAdded(false), 300);
    // TODO: dispatch add-to-cart
  };

  return (
    <section className="pdp">
      <div className="container">
        {/* Breadcrumb — editorial numbered */}
        <nav className="pdp-breadcrumb">
          <Link to="/">HOME</Link>
          <span className="pdp-breadcrumb-sep">/</span>
          <Link to="/shop">SHOP</Link>
          <span className="pdp-breadcrumb-sep">/</span>
          <span className="pdp-breadcrumb-current">{product.name}</span>
        </nav>

        <div className="pdp-inner">
          {/* =====================
              LEFT: Image + index
              ===================== */}
          <div className="pdp-media">
            <div className="pdp-image">
              <div className="pdp-image-inner">
                <img
                  className={switching ? "is-switching" : ""}
                  src={product.image}
                  alt={product.name}
                />
              </div>
              {product.isNew && (
                <span className="product-card-badge">NEW</span>
              )}

              {/* Vertical index marker — brutalist */}
              <span className="pdp-image-index">
                {String(activeImg + 1).padStart(2, "0")} / 01
              </span>
            </div>

            {/* Thumbnail strip (single image for now) */}
            <div className="pdp-thumbs">
              {[0].map((i) => (
                <button
                  key={i}
                  className={`pdp-thumb ${activeImg === i ? "is-active" : ""}`}
                  onClick={() => setActiveImg(i)}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={product.image} alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* =====================
              RIGHT: Info
              ===================== */}
          <div className="pdp-info">
            <p className="pdp-eyebrow">350 GSM AIR LAYER</p>

            <h1 className="pdp-name">
              <SplitText text={product.name} delay={80} stagger={22} />
            </h1>

            <p className="pdp-price">
              {formatPrice(product.price, product.currency)}
            </p>

            <p className="pdp-desc">{product.description}</p>

            {/* Color — full-width row, brutalist numbered */}
            <div className="pdp-field">
              <div className="pdp-field-head">
                <span className="pdp-field-label">COLOR</span>
                <span className="pdp-field-value">{color}</span>
              </div>
              <div className="pdp-colors">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    className={`pdp-swatch ${
                      color === c ? "is-active" : ""
                    }`}
                    style={{ background: c }}
                    onClick={() => handleColorChange(c)}
                    aria-label={`Color ${c}`}
                  />
                ))}
              </div>
            </div>

            {/* Size — grid cells, brutalist */}
            <div className="pdp-field">
              <div className="pdp-field-head">
                <span className="pdp-field-label">SIZE</span>
                {size && <span className="pdp-field-value">{size}</span>}
              </div>
              <div className="pdp-sizes">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    className={`pdp-size ${size === s ? "is-active" : ""}`}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart — full-width brutal CTA */}
            <button
              className={`btn btn-primary pdp-add ${added ? "is-added" : ""}`}
              disabled={!size}
              onClick={handleAddToCart}
            >
              <span>{size ? "ADD TO CART" : "SELECT A SIZE"}</span>
              <span className="pdp-add-arrow" aria-hidden="true">→</span>
            </button>

            {/* Meta */}
            <div className="pdp-meta">
              <p>Free delivery within Yangon.</p>
              <p>Heavy feel. Clean look. Everyday wear.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}