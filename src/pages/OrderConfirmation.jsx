import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../lib/format";
import { getOrderByNumber } from "../lib/orders";
import { PAYMENT_CONFIG } from "../lib/payments";

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
  const isCod = order.paymentMethod === "cod";
  const paymentInfo = PAYMENT_CONFIG[order.paymentMethod] || {};

  const depositAmount = order.depositAmount || 0;
  const remainingAmount = order.total - depositAmount;

  return (
    <section className="confirmation">
      <div className="container confirmation-inner">
        <p className="confirmation-eyebrow">
          <span className="confirmation-dot" />
          ORDER PLACED
        </p>

        <h1 className="confirmation-title">
          THANK YOU,
          <br />
          {firstName}.
        </h1>

        <p className="confirmation-sub">
          Your order is being processed. We'll verify your payment
          within 24 hours.
        </p>

        {/* Payment status banner */}
        <div className="confirmation-status">
          <div className="confirmation-status-icon">⏳</div>
          <div>
            <p className="confirmation-status-title">
              PAYMENT PENDING VERIFICATION
            </p>
            <p className="confirmation-status-note">
              We'll notify you once your payment is confirmed.
            </p>
          </div>
        </div>

        {/* Order info grid */}
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
              {order.paymentMethod === "kpay_wave"
                ? "KPAY / WAVE"
                : "COD"}
            </p>
          </div>
        </div>

        {/* COD deposit info */}
        {isCod && depositAmount > 0 && (
          <div className="confirmation-deposit">
            <p className="confirmation-deposit-title">
              CASH ON DELIVERY
            </p>
            <div className="confirmation-deposit-rows">
              <div className="confirmation-deposit-row">
                <span>Deposit paid</span>
                <strong>{formatPrice(depositAmount, "MMK")}</strong>
              </div>
              <div className="confirmation-deposit-row">
                <span>Pay on delivery</span>
                <strong>{formatPrice(remainingAmount, "MMK")}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Payment proof */}
        {order.paymentProofUrl && (
          <div className="confirmation-proof">
            <p className="confirmation-proof-title">
              {isCod ? "DEPOSIT SCREENSHOT" : "PAYMENT SCREENSHOT"}
            </p>
            <div className="confirmation-proof-image">
              <img
                src={order.paymentProofUrl}
                alt="Payment proof"
              />
            </div>
            {order.paymentReference && (
              <p className="confirmation-proof-ref">
                <span>REFERENCE:</span> {order.paymentReference}
              </p>
            )}
          </div>
        )}

        {/* Items */}
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

        {/* Actions */}
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

        {/* Guest signup prompt */}
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