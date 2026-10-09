import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { products, formatPrice } from "../data/products";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id) || products[0];

  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(null);

  return (
    <section className="pdp">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="pdp-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/shop">Shop</Link>
          <span>/</span>
          <span className="pdp-breadcrumb-current">{product.name}</span>
        </nav>

        <div className="pdp-inner">
          {/* Image */}
          <div className="pdp-image">
            <img src={product.image} alt={product.name} />
            {product.isNew && <span className="product-card-badge">NEW</span>}
          </div>

          {/* Info */}
          <div className="pdp-info">
            <p className="pdp-eyebrow">350 GSM AIR LAYER</p>
            <h1 className="pdp-name">{product.name}</h1>
            <p className="pdp-price">
              {formatPrice(product.price, product.currency)}
            </p>

            <p className="pdp-desc">{product.description}</p>

            {/* Color */}
            <div className="pdp-field">
              <p className="pdp-field-label">
                Color — <span className="pdp-field-value">{color}</span>
              </p>
              <div className="pdp-colors">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    className={`pdp-swatch ${color === c ? "is-active" : ""}`}
                    style={{ background: c }}
                    onClick={() => setColor(c)}
                    aria-label={`Color ${c}`}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="pdp-field">
              <p className="pdp-field-label">Size</p>
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

            {/* Add to cart */}
            <button className="btn btn-primary pdp-add" disabled={!size}>
              {size ? "ADD TO CART" : "SELECT A SIZE"}
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