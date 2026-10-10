import { useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartContext";

export default function Toast() {
  const { count } = useCart();
  const [visible, setVisible] = useState(false);
  const prevCount = useRef(count);
  const timer = useRef(null);

  useEffect(() => {
    // Only trigger when count increases
    if (count > prevCount.current) {
      setVisible(true);

      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setVisible(false);
      }, 1600);
    }

    prevCount.current = count;

    return () => clearTimeout(timer.current);
  }, [count]);

  return (
    <div className={`toast ${visible ? "is-visible" : ""}`}>
      <span className="toast-dot" />
      <span className="toast-text">Added to bag</span>
    </div>
  );
}