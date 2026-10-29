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

  const firstName = (order.customerName || "there")
    .split(" ")[0]
    .toUpperCase();

  const isCod = order.paymentMethod === "cod";
  const paymentLabel =
    PAYMENT_CONFIG?.[order.paymentMethod]?.label ||
    order.paymentMethod ||
    "—";

  const items = Array.isArray(order.items) ? order.items : [];

  const total = Number(order.total) || 0;
  const depositAmount = Number(order.depositAmount) || 0;
  const remainingAmount = Math.max(total - depositAmount, 0);

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

        <div className="confirmation-grid">
          <div className="confirmation-block">
            <p className="confirmation-block-key">ORDER №</p>
            <p className="confirmation-block-val">
              {order.orderNumber || "—"}
            </p>
          </div>
          <div className="confirmation-block">
            <p className="confirmation-block-key">TOTAL</p>
            <p className="confirmation-block-val">
              {formatPrice(total, "MMK")}
            </p>
          </div>
          <div className="confirmation-block">
            <p className="confirmation-block-key">DELIVERY</p>
            <p className="confirmation-block-val">
              {(order.deliveryMethod || "—").toUpperCase()}
            </p>
          </div>
          <div className="confirmation-block">
            <p className="confirmation-block-key">PAYMENT</p>
            <p className="confirmation-block-val">{paymentLabel}</p>
          </div>
        </div>

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

        {order.paymentProofUrl && (
          <div className="confirmation-proof">
            <p className="confirmation-proof-title">
              {isCod ? "DEPOSIT SCREENSHOT" : "PAYMENT SCREENSHOT"}
            </p>
            <div className="confirmation-proof-image">
              <img
                src={order.paymentProofUrl}
                alt="Payment proof"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            {order.paymentReference && (
              <p className="confirmation-proof-ref">
                <span>REFERENCE:</span> {order.paymentReference}
              </p>
            )}
          </div>
        )}

        {items.length > 0 && (
          <div className="confirmation-items">
            <p className="confirmation-items-title">
              ITEMS ({items.length})
            </p>

            <ul className="confirmation-items-list">
              {items.map((item, idx) => {
                const metaParts = [];
                if (item.size) metaParts.push(`SIZE ${item.size}`);
                if (item.color) metaParts.push(`COLOR ${item.color}`);
                metaParts.push(`QTY ${item.quantity ?? 1}`);

                const lineTotal =
                  (Number(item.price) || 0) *
                  (Number(item.quantity) || 1);

                return (
                  <li
                    key={item.id ?? `item-${idx}`}
                    className="confirmation-item"
                  >
                    <div className="confirmation-item-image">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name || "Item"}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="confirmation-item-placeholder" />
                      )}
                    </div>
                    <div className="confirmation-item-info">
                      <p className="confirmation-item-name">
                        {item.name || "Item"}
                      </p>
                      <p className="confirmation-item-meta">
                        {metaParts.join(" · ")}
                      </p>
                    </div>
                    <p className="confirmation-item-price">
                      {formatPrice(lineTotal, "MMK")}
                    </p>
                  </li>
                );
              })}
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