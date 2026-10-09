import { Link } from "react-router-dom";
import { formatPrice } from "../data/products";
import useTilt from "../hooks/useTilt";

export default function ProductCard({ product }) {
  const tiltRef = useTilt({ max: 6, scale: 1.015 });

  return (
    <Link
      to={`/product/${product.id}`}
      className="product-card"
      data-cursor="VIEW"
    >
      <div ref={tiltRef} className="product-card-tilt">
        <div className="product-card-image">
          {product.isNew && <span className="product-card-badge">NEW</span>}
          <img src={product.image} alt={product.name} />
        </div>
      </div>

      <div className="product-card-info">
        <p className="product-card-name">{product.name}</p>
        <p className="product-card-price">
          {formatPrice(product.price, product.currency)}
        </p>

        <div className="product-card-colors">
          {product.colors.map((c) => (
            <span
              key={c}
              className="product-card-swatch"
              style={{ background: c }}
            />
          ))}
        </div>
      </div>
    </Link>
  );
}