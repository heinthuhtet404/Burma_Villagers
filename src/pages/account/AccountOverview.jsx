import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyOrders } from "../../lib/account";
import { formatPrice } from "../../lib/format";

export default function AccountOverview() {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let mounted = true;

    getMyOrders(user.id)
      .then((data) => mounted && setOrders(data))
      .catch((err) => console.warn("orders load:", err))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [user]);

  const recentOrders = orders.slice(0, 3);
  const totalSpent = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="account-grid">
      {/* Stats */}
      <div className="account-stat">
        <p className="account-stat-key">TOTAL ORDERS</p>
        <p className="account-stat-value">
          {loading ? "—" : orders.length}
        </p>
      </div>
      <div className="account-stat">
        <p className="account-stat-key">TOTAL SPENT</p>
        <p className="account-stat-value">
          {loading ? "—" : formatPrice(totalSpent, "MMK")}
        </p>
      </div>

      {/* Profile card */}
      <div className="account-card">
        <p className="account-card-title">PROFILE</p>
        <div className="account-info">
          <p className="account-info-row">
            <span>Name</span>
            <span>{profile?.name || "—"}</span>
          </p>
          <p className="account-info-row">
            <span>Email</span>
            <span>{user?.email}</span>
          </p>
          <p className="account-info-row">
            <span>Phone</span>
            <span>{profile?.phone || "—"}</span>
          </p>
        </div>
        <Link to="/account/settings" className="account-link">
          EDIT PROFILE →
        </Link>
      </div>

      {/* Recent orders */}
      <div className="account-card">
        <p className="account-card-title">RECENT ORDERS</p>

        {loading && <p className="account-empty">Loading…</p>}

        {!loading && recentOrders.length === 0 && (
          <div className="account-empty">
            <p>No orders yet.</p>
            <Link to="/shop" className="account-link">
              SHOP THE DROP →
            </Link>
          </div>
        )}

        {!loading && recentOrders.length > 0 && (
          <>
            <div className="account-orders">
              {recentOrders.map((o) => (
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

            <Link to="/account/orders" className="account-link">
              VIEW ALL ORDERS →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}