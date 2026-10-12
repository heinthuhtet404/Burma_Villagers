import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import useProduct from "../hooks/useProduct";
import SplitText from "../components/SplitText";
import SizeGuide from "../components/SizeGuide";
import { formatPrice } from "../lib/format";
import { getProductStatus } from "../lib/products";
import { getVariantStock } from "../lib/products";

export default function ProductDetail() {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);

  const { add } = useCart();

  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const [switching, setSwitching] = useState(false);
  const [added, setAdded] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const switchTimer = useRef(null);
  const addTimer = useRef(null);
  // Add near the top of component
  const [variantStock, setVariantStock] = useState(null);

  // When product loads
  useEffect(() => {
    if (!product?.id) return;
    getVariantStock(product.id).then(setVariantStock).catch(() => { });
  }, [product?.id]);

  // Reset selections when product changes
  useEffect(() => {
    if (product) {
      setColor(product.colors[0] || null);
      setSize(null);
    }
  }, [product?.id]);

  useEffect(() => {
    return () => {
      clearTimeout(switchTimer.current);
      clearTimeout(addTimer.current);
    };
  }, []);

  if (loading) {
    return (
      <section className="pdp">
        <div className="container">
          <p className="pdp-loading">Loading…</p>
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="pdp">
        <div className="container">
          <p className="pdp-loading">Product not found.</p>
          <Link to="/shop" className="btn btn-primary">
            BACK TO SHOP →
          </Link>
        </div>
      </section>
    );
  }

  const status = getProductStatus(product);
  const isSold = status === "sold";

  // Find variants matching current color
  const colorVariants = product.variants.filter(
    (v) => v.color === color
  );

  // Sizes available for current color (with stock)
  const sizeStock = new Map(
    colorVariants.map((v) => [v.size, v.stock])
  );

  // Selected size stock
  const selectedVariant = colorVariants.find((v) => v.size === size);
  const canAdd = selectedVariant && selectedVariant.stock > 0 && !isSold;

  const handleColorChange = (nextColor) => {
    if (nextColor === color) return;
    setSwitching(true);
    clearTimeout(switchTimer.current);
    switchTimer.current = setTimeout(() => {
      setColor(nextColor);
      setSize(null); // reset size when color changes
      setSwitching(false);
    }, 180);
  };

  const handleAddToCart = () => {
    if (!canAdd) return;

    add(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        currency: product.currency,
        image: product.image,
      },
      { size, color, qty: 1 }
    );

    setAdded(true);
    clearTimeout(addTimer.current);
    addTimer.current = setTimeout(() => setAdded(false), 300);
  };

  return (
    <section className="pdp">
      <div className="container">
        <nav className="pdp-breadcrumb">
          <Link to="/">HOME</Link>
          <span className="pdp-breadcrumb-sep">/</span>
          <Link to="/shop">SHOP</Link>
          <span className="pdp-breadcrumb-sep">/</span>
          <span className="pdp-breadcrumb-current">{product.name}</span>
        </nav>

        <div className="pdp-inner">
          <div className="pdp-media">
            <div className="pdp-image">
              <div className="pdp-image-inner">
                <img
                  className={switching ? "is-switching" : ""}
                  src={product.image}
                  alt={product.name}
                />
              </div>

              {product.isNew && !isSold && (
                <span className="product-card-badge">NEW</span>
              )}
              {isSold && (
                <span className="pdp-sold-overlay">SOLD OUT</span>
              )}

              <span className="pdp-image-index">01 / 01</span>
            </div>
          </div>

          <div className="pdp-info">
            <p className="pdp-eyebrow">350 GSM AIR LAYER</p>

            <h1 className="pdp-name">
              <SplitText text={product.name} delay={80} stagger={22} />
            </h1>

            <p className="pdp-price">
              {formatPrice(product.price, product.currency)}
            </p>

            <p className="pdp-desc">{product.description}</p>

            {!isSold && (
              <div className="pdp-stock">
                <p className="pdp-stock-label">
                  {product.stock} IN STOCK
                </p>
                <div className="pdp-stock-bar">
                  <div
                    className="pdp-stock-fill"
                    style={{
                      transform: `scaleX(${Math.min(
                        product.stock / 50,
                        1
                      )})`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Color */}
            <div className="pdp-field">
              <div className="pdp-field-head">
                <span className="pdp-field-label">COLOR</span>
                <span className="pdp-field-value">{color}</span>
              </div>
              <div className="pdp-colors">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    className={`pdp-swatch ${color === c ? "is-active" : ""
                      }`}
                    style={{ background: c }}
                    onClick={() => handleColorChange(c)}
                    aria-label={`Color ${c}`}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="pdp-field">
              <div className="pdp-field-head">
                <span className="pdp-field-label">SIZE</span>
                <button
                  type="button"
                  className="pdp-size-guide-link"
                  onClick={() => setSizeGuideOpen(true)}
                >
                  SIZE GUIDE →
                </button>
              </div>
              <div className="pdp-sizes">
                {product.sizes.map((s) => {
                  const key = `${s}-${color}`;
                  const stock = variantStock?.[key] ?? sizeStock.get(s) ?? 0;
                  const isUnavailable = stock <= 0;
                  return (
                    <button
                      key={s}
                      className={`pdp-size ${size === s ? "is-active" : ""}`}
                      onClick={() => setSize(s)}
                      disabled={isUnavailable || isSold}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              className={`btn btn-primary pdp-add ${added ? "is-added" : ""
                }`}
              disabled={!canAdd}
              onClick={handleAddToCart}
            >
              <span>
                {isSold
                  ? "SOLD OUT"
                  : !size
                    ? "SELECT A SIZE"
                    : !canAdd
                      ? "OUT OF STOCK"
                      : "ADD TO BAG"}
              </span>
              {canAdd && (
                <span className="pdp-add-arrow" aria-hidden="true">→</span>
              )}
            </button>

            <div className="pdp-meta">
              <p>Free delivery within Yangon.</p>
              <p>Heavy feel. Clean look. Everyday wear.</p>
            </div>
          </div>
        </div>
      </div>

      <SizeGuide
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />
    </section>
  );
}