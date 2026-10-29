import { Link } from "react-router-dom";
import { formatPrice } from "../lib/format";
import { getProductStatus } from "../lib/products";
import useTilt from "../hooks/useTilt";

export default function ProductCard({ product }) {
  const tiltRef = useTilt({ max: 6, scale: 1.015 });
  const status = getProductStatus(product);
  const isSold = status === "sold";

  return (
    <Link
      to={isSold ? "#" : `/product/${product.slug}`}
      className={`product-card ${isSold ? "is-sold" : ""}`}
      data-cursor={isSold ? "SOLD" : "VIEW"}
      onClick={(e) => {
        if (isSold) e.preventDefault();
      }}
      aria-disabled={isSold}
    >
      <div ref={tiltRef} className="product-card-tilt">
        <div className="product-card-image">
          {product.isNew && !isSold && (
            <span className="product-card-badge">NEW</span>
          )}
          {status === "low" && !isSold && (
            <span className="product-card-low">LOW STOCK</span>
          )}
          {isSold && <span className="product-card-sold">SOLD OUT</span>}
          <img src={product.image} alt={product.name} />
        </div>
      </div>

      <div className="product-card-info">
        <p className="product-card-name">{product.name}</p>
        <p className="product-card-price">
          {formatPrice(product.price, product.currency)}
        </p>
      </div>
    </Link>
  );
}