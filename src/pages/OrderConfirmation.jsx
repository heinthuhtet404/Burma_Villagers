import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../data/products";

export default function OrderConfirmation() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("bv-last-order");
      if (raw) setOrder(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  if (!order) {
    return (
      <section className="confirmation">
        <div className="container confirmation-inner">
          <p className="section-eyebrow">NO ORDER</p>
          <h1 className="confirmation-title">NOTHING HERE.</h1>
          <Link to="/shop" className="btn btn-primary">
            SHOP THE DROP →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="confirmation">
      <div className="container confirmation-inner">
        <p className="confirmation-eyebrow">
          <span className="confirmation-dot" />
          ORDER CONFIRMED
        </p>

        <h1 className="confirmation-title">
          THANK YOU,
          <br />
          {order.form.name.split(" ")[0].toUpperCase()}.
        </h1>

        <p className="confirmation-sub">
          Your order is on the way. We'll text you when it ships.
        </p>

        <div className="confirmation-grid">
          <div className="confirmation-block">
            <p className="confirmation-block-key">ORDER №</p>
            <p className="confirmation-block-val">{order.id}</p>
          </div>
          <div className="confirmation-block">
            <p className="confirmation-block-key">TOTAL</p>
            <p className="confirmation-block-val">
              {formatPrice(order.total, "MMK")}
            </p>
          </div>
          <div className="confirmation-block">
            <p className="confirmation-block-key">DELIVERY</p>
            <p className="confirmation-block-val">
              {order.delivery.toUpperCase()}
            </p>
          </div>
          <div className="confirmation-block">
            <p className="confirmation-block-key">PAYMENT</p>
            <p className="confirmation-block-val">
              {order.payment.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="confirmation-actions">
          <Link to="/shop" className="btn btn-primary">
            CONTINUE SHOPPING →
          </Link>
          <Link to="/" className="confirmation-link">
            BACK TO HOME
          </Link>
        </div>
      </div>
    </section>
  );
}