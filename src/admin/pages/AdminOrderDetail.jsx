import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminTopbar from "../AdminTopbar";
import {
  getOrderById,
  updateOrderStatus,
  verifyPayment,
} from "../../lib/admin";
import { formatPrice } from "../../lib/format";
import { useAuth } from "../../context/AuthContext";

const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  // Payment modal state
  const [paymentModal, setPaymentModal] = useState(null); // "approve" | "reject"
  const [paymentNote, setPaymentNote] = useState("");

  // Proof lightbox
  const [proofOpen, setProofOpen] = useState(false);

  /* ============================================================
     Load order
     ============================================================ */
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

  /* ============================================================
     Update order status
     ============================================================ */
  const handleStatusChange = async (status) => {
    setUpdating(true);
    try {
      await updateOrderStatus(order.id, status);
      setOrder({ ...order, status });
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  /* ============================================================
     Verify payment (approve / reject)
     ============================================================ */
  const handleVerifyPayment = async () => {
    if (!paymentModal) return;

    setUpdating(true);
    setError("");

    try {
      const newStatus = paymentModal === "approve" ? "paid" : "failed";
      await verifyPayment(order.id, {
        status: newStatus,
        note: paymentNote.trim() || null,
        adminId: user?.id || null,
      });

      setOrder({
        ...order,
        paymentStatus: newStatus,
        paymentNote: paymentNote.trim() || null,
        paymentVerifiedAt: new Date().toISOString(),
      });

      setPaymentModal(null);
      setPaymentNote("");
    } catch (err) {
      setError(err.message || "Verify failed");
    } finally {
      setUpdating(false);
    }
  };

  /* ============================================================
     Loading / Error states
     ============================================================ */
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

  if (error && !order) {
    return (
      <>
        <AdminTopbar title="ORDER" />
        <div className="admin-content">
          <p className="admin-form-error">{error}</p>
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

  if (!order) return null;

  const createdDate = new Date(order.createdAt).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const isCod = order.paymentMethod === "cod";
  const depositAmount = order.depositAmount || 0;
  const remainingAmount = order.total - depositAmount;

  const paymentStatusLabel = {
    pending: "PENDING",
    pending_verification: "PENDING VERIFICATION",
    paid: "PAID",
    failed: "FAILED",
    refunded: "REFUNDED",
  };

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
          {/* ============================================
              LEFT — items + summary + notes
              ============================================ */}
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
                <p className="admin-order-panel-title">CUSTOMER NOTES</p>
                <p className="admin-order-notes">{order.notes}</p>
              </div>
            )}
          </div>

          {/* ============================================
              RIGHT — customer + payment + status
              ============================================ */}
          <aside className="admin-order-side">
            {/* CUSTOMER */}
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
                <p className="admin-order-info-line">{order.address}</p>
                <p className="admin-order-info-line">{order.city}</p>
              </div>
            </div>

            {/* PAYMENT — MAIN SECTION */}
            <div className="admin-order-panel admin-payment-panel">
              <p className="admin-order-panel-title">PAYMENT</p>

              <div className="admin-payment-method">
                <span className="admin-payment-method-label">METHOD</span>
                <span className="admin-payment-method-value">
                  {isCod ? "CASH ON DELIVERY" : "KPAY / WAVE PAY"}
                </span>
              </div>

              {isCod && depositAmount > 0 && (
                <div className="admin-payment-deposit">
                  <div className="admin-payment-deposit-row">
                    <span>Deposit</span>
                    <strong>
                      {formatPrice(depositAmount, "MMK")}
                    </strong>
                  </div>
                  <div className="admin-payment-deposit-row">
                    <span>Pay on delivery</span>
                    <strong>
                      {formatPrice(remainingAmount, "MMK")}
                    </strong>
                  </div>
                </div>
              )}

              {/* Proof screenshot */}
              {order.paymentProofUrl && (
                <div className="admin-payment-proof">
                  <p className="admin-payment-proof-title">
                    SCREENSHOT
                  </p>
                  <button
                    type="button"
                    className="admin-payment-proof-thumb"
                    onClick={() => setProofOpen(true)}
                  >
                    <img
                      src={order.paymentProofUrl}
                      alt="Payment proof"
                    />
                  </button>
                  <a
                    href={order.paymentProofUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-payment-proof-link"
                  >
                    OPEN FULL SIZE ↗
                  </a>
                </div>
              )}

              {order.paymentReference && (
                <div className="admin-payment-method">
                  <span className="admin-payment-method-label">
                    REFERENCE
                  </span>
                  <span className="admin-payment-method-value">
                    {order.paymentReference}
                  </span>
                </div>
              )}

              {/* Payment status */}
              <div className="admin-payment-status">
                <span className="admin-payment-method-label">STATUS</span>
                <span
                  className={`admin-payment-status-badge admin-payment-status-badge--${order.paymentStatus}`}
                >
                  {paymentStatusLabel[order.paymentStatus] ||
                    order.paymentStatus}
                </span>
              </div>

              {/* Payment note */}
              {order.paymentNote && (
                <div className="admin-payment-note">
                  <p className="admin-payment-note-label">NOTE</p>
                  <p className="admin-payment-note-text">
                    {order.paymentNote}
                  </p>
                </div>
              )}

              {/* Verify buttons */}
              {order.paymentStatus === "pending_verification" && (
                <div className="admin-payment-actions">
                  <button
                    type="button"
                    className="admin-payment-btn admin-payment-btn--approve"
                    onClick={() => setPaymentModal("approve")}
                    disabled={updating}
                  >
                    ✓ APPROVE
                  </button>
                  <button
                    type="button"
                    className="admin-payment-btn admin-payment-btn--reject"
                    onClick={() => setPaymentModal("reject")}
                    disabled={updating}
                  >
                    ✕ REJECT
                  </button>
                </div>
              )}

              {/* Re-verify option */}
              {(order.paymentStatus === "paid" ||
                order.paymentStatus === "failed") && (
                <button
                  type="button"
                  className="admin-payment-reverify"
                  onClick={() => {
                    setPaymentModal(
                      order.paymentStatus === "paid"
                        ? "reject"
                        : "approve"
                    );
                  }}
                  disabled={updating}
                >
                  {order.paymentStatus === "paid"
                    ? "REVERSE — MARK AS FAILED"
                    : "REVERSE — MARK AS PAID"}
                </button>
              )}
            </div>

            {/* ORDER STATUS */}
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

            {/* DELIVERY */}
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

      {/* ============================================
          PAYMENT VERIFY MODAL
          ============================================ */}
      {paymentModal && (
        <div
          className="admin-modal-overlay"
          onClick={() => !updating && setPaymentModal(null)}
        >
          <div
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="admin-modal-title">
              {paymentModal === "approve"
                ? "APPROVE PAYMENT?"
                : "REJECT PAYMENT?"}
            </p>

            <p className="admin-modal-text">
              {paymentModal === "approve"
                ? `Mark ${order.orderNumber} as paid. The order will move forward.`
                : `Mark ${order.orderNumber} as failed. Add a note to explain.`}
            </p>

            <div className="admin-modal-field">
              <label
                className="admin-form-label"
                htmlFor="paymentNote"
              >
                NOTE {paymentModal === "reject" ? "(REQUIRED)" : "(OPTIONAL)"}
              </label>
              <textarea
                id="paymentNote"
                className="admin-form-input admin-form-textarea"
                rows={3}
                value={paymentNote}
                onChange={(e) => setPaymentNote(e.target.value)}
                placeholder={
                  paymentModal === "reject"
                    ? "e.g. Screenshot is unclear"
                    : "e.g. Verified by KPay reference"
                }
              />
            </div>

            <div className="admin-modal-actions">
              <button
                className="admin-form-btn admin-form-btn--ghost"
                onClick={() => setPaymentModal(null)}
                disabled={updating}
              >
                CANCEL
              </button>
              <button
                className={`admin-form-btn ${
                  paymentModal === "approve"
                    ? "admin-form-btn--primary"
                    : "admin-form-btn--danger"
                }`}
                onClick={handleVerifyPayment}
                disabled={
                  updating ||
                  (paymentModal === "reject" && !paymentNote.trim())
                }
              >
                {updating
                  ? "SAVING…"
                  : paymentModal === "approve"
                  ? "APPROVE"
                  : "REJECT"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          PROOF LIGHTBOX
          ============================================ */}
      {proofOpen && order.paymentProofUrl && (
        <div
          className="admin-lightbox"
          onClick={() => setProofOpen(false)}
        >
          <img
            src={order.paymentProofUrl}
            alt="Payment proof"
            className="admin-lightbox-img"
          />
          <button
            className="admin-lightbox-close"
            onClick={() => setProofOpen(false)}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}