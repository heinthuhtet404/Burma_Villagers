import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminTopbar from "../AdminTopbar";
import {
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
} from "../../lib/admin";
import { formatPrice } from "../../lib/format";
import { restoreOrderStock } from "../../lib/orders";

const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUSES = ["pending", "paid", "failed"];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      try {
        const data = await getOrderById(id);
        if (!data) throw new Error("Order not found");
        if (mounted) setOrder(data);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleStatusChange = async (status) => {
  setUpdating(true);
  try {
    // If cancelling — restore stock
    if (status === "cancelled" && order.status !== "cancelled") {
      await restoreOrderStock(order.id);
    }

    await updateOrderStatus(order.id, status);
    setOrder({ ...order, status });
  } catch (err) {
    setError(err.message || "Update failed");
  } finally {
    setUpdating(false);
  }
};

  const handlePaymentStatusChange = async (payment_status) => {
    setUpdating(true);
    try {
      await updatePaymentStatus(order.id, payment_status);
      setOrder({ ...order, paymentStatus: payment_status });
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminTopbar title="ORDER" />
        <div className="admin-content">
          <p className="admin-placeholder">LOADING…</p>
        </div>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <AdminTopbar title="ORDER" />
        <div className="admin-content">
          <p className="admin-form-error">{error || "Not found"}</p>
          <button
            className="admin-btn-primary"
            onClick={() => navigate("/admin/orders")}
          >
            ← BACK TO ORDERS
          </button>
        </div>
      </>
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
    <>
      <AdminTopbar title={`ORDER ${order.orderNumber}`} />

      <div className="admin-content">
        <div className="admin-order-head">
          <Link to="/admin/orders" className="admin-back-link">
            ← BACK
          </Link>
          <p className="admin-order-date">{createdDate}</p>
        </div>

        {error && <p className="admin-form-error">{error}</p>}

        <div className="admin-order-grid">
          {/* LEFT: items + summary */}
          <div className="admin-order-main">
            {/* Items */}
            <div className="admin-order-panel">
              <p className="admin-order-panel-title">
                ITEMS ({order.items.length})
              </p>

              <div className="admin-order-items">
                {order.items.map((item) => (
                  <div key={item.id} className="admin-order-item">
                    <div className="admin-order-item-image">
                      {item.image ? (
                        <img src={item.image} alt="" />
                      ) : (
                        <span />
                      )}
                    </div>

                    <div className="admin-order-item-info">
                      <p className="admin-order-item-name">
                        {item.name}
                      </p>
                      <p className="admin-order-item-meta">
                        SIZE {item.size} · QTY {item.quantity}
                      </p>
                    </div>

                    <p className="admin-order-item-price">
                      {formatPrice(item.price * item.quantity, "MMK")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="admin-order-summary">
                <div className="admin-order-summary-row">
                  <span>SUBTOTAL</span>
                  <span>{formatPrice(order.subtotal, "MMK")}</span>
                </div>
                <div className="admin-order-summary-row">
                  <span>DELIVERY</span>
                  <span>
                    {order.deliveryFee === 0
                      ? "FREE"
                      : formatPrice(order.deliveryFee, "MMK")}
                  </span>
                </div>
                <div className="admin-order-summary-row admin-order-summary-row--total">
                  <span>TOTAL</span>
                  <span>{formatPrice(order.total, "MMK")}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="admin-order-panel">
                <p className="admin-order-panel-title">NOTES</p>
                <p className="admin-order-notes">{order.notes}</p>
              </div>
            )}
          </div>

          {/* RIGHT: customer + actions */}
          <aside className="admin-order-side">
            {/* Customer */}
            <div className="admin-order-panel">
              <p className="admin-order-panel-title">CUSTOMER</p>
              <div className="admin-order-info">
                <p className="admin-order-info-name">
                  {order.customerName}
                </p>
                <p className="admin-order-info-line">
                  {order.customerEmail}
                </p>
                <p className="admin-order-info-line">
                  {order.customerPhone}
                </p>
                <hr className="admin-order-info-hr" />
                <p className="admin-order-info-line">
                  {order.address}
                </p>
                <p className="admin-order-info-line">{order.city}</p>
              </div>
            </div>

            {/* Order status */}
            <div className="admin-order-panel">
              <p className="admin-order-panel-title">ORDER STATUS</p>
              <div className="admin-order-status">
                {ORDER_STATUSES.map((s) => (
                  <button
                    key={s}
                    className={`admin-status-btn admin-status-btn--${s} ${
                      order.status === s ? "is-active" : ""
                    }`}
                    onClick={() => handleStatusChange(s)}
                    disabled={updating || order.status === s}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment */}
            <div className="admin-order-panel">
              <p className="admin-order-panel-title">PAYMENT</p>
              <p className="admin-order-info-line">
                <strong>Method:</strong>{" "}
                {order.paymentMethod.toUpperCase()}
              </p>
              <p className="admin-order-info-line">
                <strong>Status:</strong>{" "}
                {order.paymentStatus.toUpperCase()}
              </p>

              <div className="admin-order-status">
                {PAYMENT_STATUSES.map((s) => (
                  <button
                    key={s}
                    className={`admin-status-btn admin-status-btn--payment-${
                      s === "paid" ? "success" : s === "failed" ? "danger" : "muted"
                    } ${order.paymentStatus === s ? "is-active" : ""}`}
                    onClick={() => handlePaymentStatusChange(s)}
                    disabled={updating || order.paymentStatus === s}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery */}
            <div className="admin-order-panel">
              <p className="admin-order-panel-title">DELIVERY</p>
              <p className="admin-order-info-line">
                <strong>Method:</strong>{" "}
                {order.deliveryMethod.toUpperCase()}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}