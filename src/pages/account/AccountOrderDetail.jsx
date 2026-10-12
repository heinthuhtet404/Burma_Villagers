import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyOrderById } from "../../lib/account";
import { formatPrice } from "../../lib/format";

export default function AccountOrderDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    let mounted = true;

    getMyOrderById(user.id, id)
      .then((data) => {
        if (!data) throw new Error("Order not found");
        if (mounted) setOrder(data);
      })
      .catch((err) =>
        mounted && setError(err.message || "Failed to load")
      )
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [user, id]);

  if (loading) {
    return (
      <div className="account-card">
        <p className="account-empty">Loading…</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="account-card">
        <p className="auth-error">{error || "Not found"}</p>
        <Link to="/account/orders" className="account-link">
          ← BACK TO ORDERS
        </Link>
      </div>
    );
  }

  const createdDate = new Date(order.createdAt).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="account-order-detail">
      <div className="account-order-detail-head">
        <Link to="/account/orders" className="account-link">
          ← BACK TO ORDERS
        </Link>
        <p className="account-order-detail-date">{createdDate}</p>
      </div>

      <div className="account-order-detail-top">
        <div>
          <p className="account-card-title">ORDER №</p>
          <p className="account-order-detail-num">{order.orderNumber}</p>
        </div>
        <span
          className={`account-order-status account-order-status--${order.status}`}
        >
          {order.status.toUpperCase()}
        </span>
      </div>

      {/* Items */}
      <div className="account-card">
        <p className="account-card-title">ITEMS ({order.items.length})</p>

        <div className="account-order-items">
          {order.items.map((item) => (
            <div key={item.id} className="account-order-item">
              <div className="account-order-item-image">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <span />
                )}
              </div>
              <div className="account-order-item-info">
                <p className="account-order-item-name">{item.name}</p>
                <p className="account-order-item-meta">
                  SIZE {item.size} · QTY {item.quantity}
                </p>
              </div>
              <p className="account-order-item-price">
                {formatPrice(item.price * item.quantity, "MMK")}
              </p>
            </div>
          ))}
        </div>

        <div className="account-order-totals">
          <div className="account-order-total-row">
            <span>SUBTOTAL</span>
            <span>{formatPrice(order.subtotal, "MMK")}</span>
          </div>
          <div className="account-order-total-row">
            <span>DELIVERY</span>
            <span>
              {order.deliveryFee === 0
                ? "FREE"
                : formatPrice(order.deliveryFee, "MMK")}
            </span>
          </div>
          <div className="account-order-total-row account-order-total-row--big">
            <span>TOTAL</span>
            <span>{formatPrice(order.total, "MMK")}</span>
          </div>
        </div>
      </div>

      {/* Delivery + Payment */}
      <div className="account-order-detail-grid">
        <div className="account-card">
          <p className="account-card-title">SHIPPING TO</p>
          <p className="account-order-info">
            {order.customerName}
            <br />
            {order.address}
            <br />
            {order.city}
            <br />
            {order.customerPhone}
          </p>
        </div>

        <div className="account-card">
          <p className="account-card-title">PAYMENT</p>
          <p className="account-order-info">
            <strong>Method:</strong>{" "}
            {order.paymentMethod.toUpperCase()}
            <br />
            <strong>Status:</strong>{" "}
            {order.paymentStatus.toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
}