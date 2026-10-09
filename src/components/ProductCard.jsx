import { Link } from "react-router-dom";
import { formatPrice } from "../data/products";

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card-image">
        <img src={product.image} alt={product.name} />
        {product.isNew && <span className="product-card-badge">NEW</span>}
      </div>

      <div className="product-card-info">
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-price">
          {formatPrice(product.price, product.currency)}
        </p>

        {product.colors?.length > 0 && (
          <div className="product-card-colors">
            {product.colors.map((c, i) => (
              <span
                key={i}
                className="product-card-swatch"
                style={{ background: c }}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}