import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../lib/format";
import { getOrderByNumber } from "../lib/orders";

export default function OrderConfirmation() {
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      let orderNumber = null;
      try {
        const raw = sessionStorage.getItem("bv-last-order");
        if (raw) {
          const parsed = JSON.parse(raw);
          orderNumber = parsed?.orderNumber;
        }
      } catch {
        /* ignore */
      }

      if (!orderNumber) {
        if (mounted) {
          setError("No recent order found.");
          setLoading(false);
        }
        return;
      }

      try {
        const data = await getOrderByNumber(orderNumber);
        if (!data) throw new Error("Order not found");
        if (mounted) setOrder(data);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load order");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="confirmation">
        <div className="container confirmation-inner">
          <p className="section-eyebrow">LOADING…</p>
        </div>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="confirmation">
        <div className="container confirmation-inner">
          <p className="section-eyebrow">NO ORDER</p>
          <h1 className="confirmation-title">NOTHING HERE.</h1>
          <p className="confirmation-sub">
            {error || "We couldn't find a recent order."}
          </p>
          <Link to="/shop" className="btn btn-primary">
            SHOP THE DROP →
          </Link>
        </div>
      </section>
    );
  }

  const firstName = order.customerName.split(" ")[0].toUpperCase();

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
          {firstName}.
        </h1>

        <p className="confirmation-sub">
          Your order is on the way. We'll text you when it ships.
        </p>

        <div className="confirmation-grid">
          <div className="confirmation-block">
            <p className="confirmation-block-key">ORDER №</p>
            <p className="confirmation-block-val">{order.orderNumber}</p>
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
              {order.deliveryMethod.toUpperCase()}
            </p>
          </div>
          <div className="confirmation-block">
            <p className="confirmation-block-key">PAYMENT</p>
            <p className="confirmation-block-val">
              {order.paymentMethod.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Order items */}
        {order.items.length > 0 && (
          <div className="confirmation-items">
            <p className="confirmation-items-title">
              ITEMS ({order.items.length})
            </p>

            <ul className="confirmation-items-list">
              {order.items.map((item) => (
                <li key={item.id} className="confirmation-item">
                  <div className="confirmation-item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <span />
                    )}
                  </div>
                  <div className="confirmation-item-info">
                    <p className="confirmation-item-name">{item.name}</p>
                    <p className="confirmation-item-meta">
                      SIZE {item.size} · QTY {item.quantity}
                    </p>
                  </div>
                  <p className="confirmation-item-price">
                    {formatPrice(item.price * item.quantity, "MMK")}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="confirmation-actions">
          {user ? (
            <Link to="/account/orders" className="btn btn-primary">
              VIEW MY ORDERS →
            </Link>
          ) : (
            <Link to="/shop" className="btn btn-primary">
              CONTINUE SHOPPING →
            </Link>
          )}
          <Link to="/" className="confirmation-link">
            BACK TO HOME
          </Link>
        </div>

        {/* Sign-in prompt for guests */}
        {!user && (
          <div className="confirmation-signup">
            <p>
              Want to track this order?{" "}
              <Link to="/signup">Create an account</Link> with the same
              email to see your order history.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}