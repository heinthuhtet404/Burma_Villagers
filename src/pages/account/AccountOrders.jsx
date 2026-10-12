import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyOrders } from "../../lib/account";
import { formatPrice } from "../../lib/format";

export default function AccountOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    let mounted = true;

    getMyOrders(user.id)
      .then((data) => mounted && setOrders(data))
      .catch((err) =>
        mounted && setError(err.message || "Failed to load")
      )
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [user]);

  return (
    <div className="account-card">
      <p className="account-card-title">ALL ORDERS</p>

      {loading && <p className="account-empty">Loading…</p>}

      {error && <p className="auth-error">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div className="account-empty">
          <p>No orders yet.</p>
          <Link to="/shop" className="account-link">
            SHOP THE DROP →
          </Link>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="account-orders">
          {orders.map((o) => (
            <Link
              key={o.id}
              to={`/account/orders/${o.id}`}
              className="account-order-row"
            >
              <div>
                <p className="account-order-num">{o.orderNumber}</p>
                <p className="account-order-meta">
                  {o.itemCount} item{o.itemCount !== 1 ? "s" : ""} ·{" "}
                  {new Date(o.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="account-order-right">
                <p className="account-order-total">
                  {formatPrice(o.total, "MMK")}
                </p>
                <span
                  className={`account-order-status account-order-status--${o.status}`}
                >
                  {o.status.toUpperCase()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}