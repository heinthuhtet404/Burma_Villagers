import { useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartContext";

export default function CartIcon({ onClick, className = "" }) {
  const { count } = useCart();
  const [bump, setBump] = useState(false);
  const prevCount = useRef(count);

  useEffect(() => {
    if (prevCount.current !== count) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 320);
      prevCount.current = count;
      return () => clearTimeout(t);
    }
  }, [count]);

  return (
    <button
      className={`navbar-cart ${className}`}
      onClick={onClick}
      aria-label={`Cart with ${count} items`}
    >
      <span className={`cart-count ${bump ? "is-bumped" : ""}`}>
        CART ({count})
      </span>
    </button>
  );
}