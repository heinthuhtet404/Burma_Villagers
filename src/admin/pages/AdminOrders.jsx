import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminTopbar from "../AdminTopbar";
import { getAllOrders } from "../../lib/admin";
import { formatPrice } from "../../lib/format";

const STATUSES = [
  { value: "all", label: "ALL" },
  { value: "pending", label: "PENDING" },
  { value: "processing", label: "PROCESSING" },
  { value: "shipped", label: "SHIPPED" },
  { value: "delivered", label: "DELIVERED" },
  { value: "cancelled", label: "CANCELLED" },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getAllOrders();
        if (mounted) setOrders(data);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return orders;
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  return (
    <>
      <AdminTopbar title="ORDERS" />

      <div className="admin-content">
        <div className="admin-toolbar">
          <p className="admin-toolbar-count">
            {loading
              ? "LOADING…"
              : `${filtered.length} ORDER${filtered.length === 1 ? "" : "S"}`}
          </p>
        </div>

        <div className="admin-filters">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              className={`admin-filter-btn ${
                filter === s.value ? "is-active" : ""
              }`}
              onClick={() => setFilter(s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {error && <p className="admin-form-error">{error}</p>}

        {!loading && filtered.length === 0 && (
          <div className="admin-placeholder">
            <p>NO ORDERS {filter !== "all" ? `(${filter.toUpperCase()})` : ""}</p>
            <p className="admin-placeholder-sub">
              Orders will appear here when customers check out.
            </p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>CUSTOMER</th>
                  <th>ITEMS</th>
                  <th>TOTAL</th>
                  <th>PAYMENT</th>
                  <th>STATUS</th>
                  <th>DATE</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <span className="admin-table-code">
                        {o.orderNumber}
                      </span>
                    </td>
                    <td>
                      <span className="admin-table-name">
                        {o.customerName}
                      </span>
                      <span className="admin-table-sub">
                        {o.customerPhone}
                      </span>
                    </td>
                    <td>{o.itemCount}</td>
                    <td>
                      <strong>{formatPrice(o.total, "MMK")}</strong>
                    </td>
                    <td>
                      <span
                        className={`admin-badge admin-badge--${
                          o.paymentStatus === "paid" ? "success" : "muted"
                        }`}
                      >
                        {o.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`admin-badge admin-badge--status admin-badge--${o.status}`}
                      >
                        {o.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {new Date(o.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </td>
                    <td className="admin-table-actions">
                      <Link
                        to={`/admin/orders/${o.id}`}
                        className="admin-table-btn"
                      >
                        VIEW
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}