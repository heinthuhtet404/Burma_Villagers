import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import useProduct from "../hooks/useProduct";
import SplitText from "../components/SplitText";
import { formatPrice } from "../lib/format";

export default function ProductDetail() {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);

  const { add } = useCart();

  const [added, setAdded] = useState(false);
  const addTimer = useRef(null);

  useEffect(() => {
    return () => {
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

  const handleAddToCart = () => {
    add(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        currency: product.currency,
        image: product.image,
      },
      { qty: 1 }
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
                <img src={product.image} alt={product.name} />
              </div>

              {product.isNew && (
                <span className="product-card-badge">NEW</span>
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

            <button
              className={`btn btn-primary pdp-add ${added ? "is-added" : ""}`}
              onClick={handleAddToCart}
            >
              <span>{added ? "ADDED" : "ADD TO BAG"}</span>
              <span className="pdp-add-arrow" aria-hidden="true">→</span>
            </button>

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