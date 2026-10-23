import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../lib/format";
import { createOrder } from "../lib/orders";
import { getAddresses } from "../lib/account";
import { PAYMENT_CONFIG } from "../lib/payments";
import PaymentProofUpload from "../components/PaymentProofUpload";

/* ============================================================
   DELIVERY OPTIONS — for UI display only
   (server recomputes these — never trust client)
   ============================================================ */
const DELIVERY = {
  standard: {
    id: "standard",
    label: "STANDARD",
    note: "2–4 days · Yangon only",
    price: 0,
  },
  express: {
    id: "express",
    label: "EXPRESS",
    note: "Next day · Yangon only",
    price: 3000,
  },
};

const STEPS = [
  { n: 1, label: "INFO" },
  { n: 2, label: "DELIVERY" },
  { n: 3, label: "PAYMENT" },
  { n: 4, label: "REVIEW" },
];

export default function Checkout() {
  const { items, subtotal, count, clear } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "Yangon",
    notes: "",
  });
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [delivery, setDelivery] = useState("standard");

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentProofUrl, setPaymentProofUrl] = useState(null);
  const [paymentReference, setPaymentReference] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // UI-display only (server recomputes)
  const deliveryFee = DELIVERY[delivery].price;
  const total = subtotal + deliveryFee;

  const isCod = paymentMethod === "cod";
  const depositAmount = isCod ? PAYMENT_CONFIG.cod.depositAmount : 0;
  const amountToPay = isCod ? depositAmount : total;

  /* ============================================================
     Auto-fill from profile + addresses
     ============================================================ */
  useEffect(() => {
    if (!user) return;

    setForm((f) => ({
      ...f,
      name: f.name || profile?.name || "",
      email: f.email || user.email || "",
      phone: f.phone || profile?.phone || "",
    }));

    getAddresses(user.id)
      .then((list) => {
        setAddresses(list);
        const defaultAddr = list.find((a) => a.is_default);
        if (defaultAddr) {
          applyAddress(defaultAddr);
          setSelectedAddressId(defaultAddr.id);
        } else if (list.length > 0) {
          applyAddress(list[0]);
          setSelectedAddressId(list[0].id);
        }
      })
      .catch((err) => console.warn("addresses load:", err));
    // eslint-disable-next-line
  }, [user, profile]);

  const applyAddress = (addr) => {
    setForm((f) => ({
      ...f,
      name: addr.name,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
    }));
  };

  const handleSelectAddress = (addr) => {
    applyAddress(addr);
    setSelectedAddressId(addr.id);
  };

  const update = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (k === "address" || k === "city" || k === "name" || k === "phone") {
      setSelectedAddressId(null);
    }
  };

  const isInfoValid =
    form.name.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.address.trim();

  const isPaymentValid = () => {
    if (!paymentMethod) return false;
    if (!paymentProofUrl) return false;
    return true;
  };

  const canProceed = () => {
    if (step === 1) return isInfoValid;
    if (step === 2) return !!delivery;
    if (step === 3) return isPaymentValid();
    return true;
  };

  const handleNext = () => {
    if (!canProceed()) return;
    setStep((s) => Math.min(s + 1, 4));
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  /* ============================================================
     PLACE ORDER — via Edge Function (server-validated)
     ============================================================ */
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (step !== 4) return;
    if (!isInfoValid || !isPaymentValid() || count === 0) return;

    setSubmitting(true);
    setError("");

    try {
      const order = await createOrder({
        customer: form,
        items,
        delivery,
        payment: paymentMethod,
        paymentProofUrl,
        paymentReference: paymentReference.trim() || null,
      });

      try {
        sessionStorage.setItem(
          "bv-last-order",
          JSON.stringify({ orderNumber: order.orderNumber })
        );
      } catch {
        /* ignore */
      }

      clear();
      navigate("/order-confirmation", { replace: true });
    } catch (err) {
      console.error("Order failed:", err);
      setError(err.message || "Failed to place order. Try again.");
      setSubmitting(false);
    }
  };

  /* ============================================================
     EMPTY CART GUARD
     ============================================================ */
  if (count === 0 && !submitting) {
    return (
      <section className="checkout">
        <div className="container checkout-empty">
          <p className="section-eyebrow">CHECKOUT</p>
          <h1 className="checkout-empty-title">
            YOUR BAG
            <br />
            IS EMPTY.
          </h1>
          <p className="checkout-empty-sub">
            Add a piece before you check out.
          </p>
          <Link to="/shop" className="btn btn-primary">
            SHOP THE DROP →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout">
      <div className="container">
        <nav className="pdp-breadcrumb checkout-breadcrumb">
          <Link to="/">HOME</Link>
          <span className="pdp-breadcrumb-sep">/</span>
          <Link to="/shop">SHOP</Link>
          <span className="pdp-breadcrumb-sep">/</span>
          <span className="pdp-breadcrumb-current">CHECKOUT</span>
        </nav>

        {!user && (
          <div className="checkout-signin-prompt">
            <p>
              Already have an account?{" "}
              <Link to="/login">Sign in</Link> for faster checkout.
            </p>
          </div>
        )}

        <div className="checkout-inner">
          <form className="checkout-form" onSubmit={handlePlaceOrder}>
            <header className="checkout-head">
              <p className="section-eyebrow">SECURE CHECKOUT</p>
              <h1 className="checkout-title">
                COMPLETE
                <br />
                YOUR ORDER.
              </h1>

              <div className="checkout-steps">
                {STEPS.map((s) => (
                  <button
                    type="button"
                    key={s.n}
                    className={`checkout-step ${
                      step >= s.n ? "is-active" : ""
                    } ${step === s.n ? "is-current" : ""}`}
                    onClick={() => {
                      if (s.n < step) setStep(s.n);
                    }}
                    disabled={s.n > step}
                  >
                    <span className="checkout-step-num">0{s.n}</span>
                    <span className="checkout-step-label">{s.label}</span>
                  </button>
                ))}
              </div>
            </header>

            {/* ============================================
                STEP 1 — INFO
                ============================================ */}
            {step === 1 && (
              <div className="checkout-section">
                <p className="checkout-section-title">
                  01 — CONTACT & ADDRESS
                </p>

                {user && addresses.length > 0 && (
                  <div className="checkout-addresses">
                    <p className="checkout-addresses-title">
                      SAVED ADDRESSES
                    </p>
                    <div className="checkout-addresses-list">
                      {addresses.map((a) => (
                        <button
                          type="button"
                          key={a.id}
                          className={`checkout-address-card ${
                            selectedAddressId === a.id ? "is-active" : ""
                          }`}
                          onClick={() => handleSelectAddress(a)}
                        >
                          <div className="checkout-address-head">
                            <span className="checkout-address-label">
                              {a.label}
                            </span>
                            {a.is_default && (
                              <span className="checkout-address-badge">
                                DEFAULT
                              </span>
                            )}
                          </div>
                          <p className="checkout-address-body">
                            <strong>{a.name}</strong>
                            <br />
                            {a.address}
                            <br />
                            {a.city}
                            <br />
                            {a.phone}
                          </p>
                        </button>
                      ))}
                    </div>
                    <p className="checkout-addresses-hint">
                      Or edit below to use a different address.
                    </p>
                  </div>
                )}

                <div className="checkout-field">
                  <label className="checkout-label" htmlFor="name">
                    FULL NAME
                  </label>
                  <input
                    id="name"
                    className="checkout-input"
                    type="text"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="AUNG AUNG"
                    required
                  />
                </div>

                <div className="checkout-row">
                  <div className="checkout-field">
                    <label className="checkout-label" htmlFor="email">
                      EMAIL
                    </label>
                    <input
                      id="email"
                      className="checkout-input"
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@email.com"
                      required
                    />
                  </div>
                  <div className="checkout-field">
                    <label className="checkout-label" htmlFor="phone">
                      PHONE
                    </label>
                    <input
                      id="phone"
                      className="checkout-input"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="09 xxx xxx xxx"
                      required
                    />
                  </div>
                </div>

                <div className="checkout-field">
                  <label className="checkout-label" htmlFor="address">
                    ADDRESS
                  </label>
                  <input
                    id="address"
                    className="checkout-input"
                    type="text"
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    placeholder="No. 123, Street, Township"
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label className="checkout-label" htmlFor="city">
                    CITY
                  </label>
                  <input
                    id="city"
                    className="checkout-input"
                    type="text"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                  />
                </div>

                <div className="checkout-field">
                  <label className="checkout-label" htmlFor="notes">
                    NOTES (OPTIONAL)
                  </label>
                  <textarea
                    id="notes"
                    className="checkout-input checkout-textarea"
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    placeholder="Delivery instructions, landmark..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* ============================================
                STEP 2 — DELIVERY
                ============================================ */}
            {step === 2 && (
              <div className="checkout-section">
                <p className="checkout-section-title">02 — DELIVERY</p>

                <div className="checkout-options">
                  {Object.values(DELIVERY).map((d) => (
                    <label
                      key={d.id}
                      className={`checkout-option ${
                        delivery === d.id ? "is-active" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value={d.id}
                        checked={delivery === d.id}
                        onChange={() => setDelivery(d.id)}
                      />
                      <span className="checkout-option-radio" />
                      <span className="checkout-option-info">
                        <span className="checkout-option-label">
                          {d.label}
                        </span>
                        <span className="checkout-option-note">
                          {d.note}
                        </span>
                      </span>
                      <span className="checkout-option-price">
                        {d.price === 0
                          ? "FREE"
                          : formatPrice(d.price, "MMK")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* ============================================
                STEP 3 — PAYMENT
                ============================================ */}
            {step === 3 && (
              <div className="checkout-section">
                <p className="checkout-section-title">03 — PAYMENT</p>

                {/* Payment methods */}
                <div className="checkout-options">
                  {Object.values(PAYMENT_CONFIG).map((p) => (
                    <label
                      key={p.id}
                      className={`checkout-option ${
                        paymentMethod === p.id ? "is-active" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={p.id}
                        checked={paymentMethod === p.id}
                        onChange={() => {
                          setPaymentMethod(p.id);
                          setPaymentProofUrl(null);
                        }}
                      />
                      <span className="checkout-option-radio" />
                      <span className="checkout-option-info">
                        <span className="checkout-option-label">
                          {p.label}
                        </span>
                        <span className="checkout-option-note">
                          {p.description}
                        </span>
                      </span>
                      <span className="checkout-option-price">
                        {p.type === "deposit"
                          ? formatPrice(p.depositAmount, "MMK")
                          : formatPrice(total, "MMK")}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Account info + Proof upload */}
                {paymentMethod && (
                  <div className="checkout-payment-detail">
                    <div className="checkout-payment-accounts">
                      <p className="checkout-payment-accounts-title">
                        {isCod ? "SEND DEPOSIT TO" : "SEND PAYMENT TO"}
                      </p>

                      {PAYMENT_CONFIG[paymentMethod].accounts.map(
                        (acc, i) => (
                          <div
                            key={i}
                            className="checkout-payment-account"
                          >
                            <span className="checkout-payment-account-name">
                              {acc.name}
                            </span>
                            <span className="checkout-payment-account-phone">
                              {acc.phone}
                            </span>
                            <span className="checkout-payment-account-holder">
                              {acc.holder}
                            </span>
                          </div>
                        )
                      )}

                      <div className="checkout-payment-amount">
                        <span>AMOUNT TO TRANSFER</span>
                        <strong>{formatPrice(amountToPay, "MMK")}</strong>
                      </div>

                      {isCod && (
                        <p className="checkout-payment-note">
                          This is a deposit. The remaining{" "}
                          <strong>
                            {formatPrice(total - depositAmount, "MMK")}
                          </strong>{" "}
                          will be paid on delivery.
                        </p>
                      )}
                    </div>

                    {/* Proof upload */}
                    <PaymentProofUpload
                      value={paymentProofUrl}
                      onChange={setPaymentProofUrl}
                      label={
                        isCod
                          ? "DEPOSIT SCREENSHOT *"
                          : "PAYMENT SCREENSHOT *"
                      }
                    />

                    <div className="checkout-field">
                      <label
                        className="checkout-label"
                        htmlFor="paymentReference"
                      >
                        TRANSACTION ID / NOTE (OPTIONAL)
                      </label>
                      <input
                        id="paymentReference"
                        className="checkout-input"
                        type="text"
                        value={paymentReference}
                        onChange={(e) =>
                          setPaymentReference(e.target.value)
                        }
                        placeholder="e.g. 1234567890"
                      />
                    </div>
                  </div>
                )}

                <p className="checkout-note">
                  We'll verify your payment within 24 hours. Your order
                  will be processed once confirmed.
                </p>
              </div>
            )}

            {/* ============================================
                STEP 4 — REVIEW
                ============================================ */}
            {step === 4 && (
              <div className="checkout-section">
                <p className="checkout-section-title">04 — REVIEW</p>

                <div className="checkout-review">
                  <div className="checkout-review-block">
                    <p className="checkout-review-key">SHIP TO</p>
                    <p className="checkout-review-val">
                      {form.name}
                      <br />
                      {form.address}
                      <br />
                      {form.city}
                      <br />
                      {form.phone}
                    </p>
                  </div>

                  <div className="checkout-review-block">
                    <p className="checkout-review-key">DELIVERY</p>
                    <p className="checkout-review-val">
                      {DELIVERY[delivery].label}
                      <br />
                      <span className="checkout-review-muted">
                        {DELIVERY[delivery].note}
                      </span>
                    </p>
                  </div>

                  <div className="checkout-review-block">
                    <p className="checkout-review-key">PAYMENT</p>
                    <p className="checkout-review-val">
                      {PAYMENT_CONFIG[paymentMethod]?.label}
                      <br />
                      <span className="checkout-review-muted">
                        {isCod
                          ? `Deposit ${formatPrice(depositAmount, "MMK")} now · Rest on delivery`
                          : `Full ${formatPrice(total, "MMK")}`}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Proof preview */}
                {paymentProofUrl && (
                  <div className="checkout-review-proof">
                    <p className="checkout-review-key">
                      PAYMENT SCREENSHOT
                    </p>
                    <img
                      src={paymentProofUrl}
                      alt="Payment proof"
                      className="checkout-review-proof-img"
                    />
                  </div>
                )}

                {error && <p className="admin-form-error">{error}</p>}
              </div>
            )}

            {/* Nav */}
            <div className="checkout-nav">
              {step > 1 && (
                <button
                  type="button"
                  className="checkout-back"
                  onClick={handleBack}
                  disabled={submitting}
                >
                  ← BACK
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  className="btn btn-primary checkout-next"
                  onClick={handleNext}
                  disabled={!canProceed()}
                >
                  <span>CONTINUE</span>
                  <span className="checkout-arrow">→</span>
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary checkout-next"
                  disabled={submitting}
                >
                  <span>
                    {submitting ? "PLACING ORDER..." : "PLACE ORDER"}
                  </span>
                  {!submitting && (
                    <span className="checkout-arrow">→</span>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* ============================================
              SUMMARY
              ============================================ */}
          <aside className="checkout-summary">
            <div className="checkout-summary-head">
              <p className="checkout-summary-title">ORDER SUMMARY</p>
              <p className="checkout-summary-count">
                {count} ITEM{count > 1 ? "S" : ""}
              </p>
            </div>

            <ul className="checkout-summary-list">
              {items.map((item) => (
                <li key={item.key} className="checkout-summary-item">
                  <div className="checkout-summary-image">
                    <img src={item.image} alt={item.name} />
                    <span className="checkout-summary-qty">
                      {item.qty}
                    </span>
                  </div>
                  <div className="checkout-summary-info">
                    <p className="checkout-summary-name">{item.name}</p>
                    <p className="checkout-summary-meta">
                      SIZE {item.size}
                    </p>
                  </div>
                  <p className="checkout-summary-price">
                    {formatPrice(item.price * item.qty, item.currency)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="checkout-summary-foot">
              <div className="checkout-summary-row">
                <span>SUBTOTAL</span>
                <span>{formatPrice(subtotal, "MMK")}</span>
              </div>
              <div className="checkout-summary-row checkout-summary-row--muted">
                <span>DELIVERY</span>
                <span>
                  {deliveryFee === 0
                    ? "FREE"
                    : formatPrice(deliveryFee, "MMK")}
                </span>
              </div>
              <div className="checkout-summary-row checkout-summary-row--total">
                <span>TOTAL</span>
                <span>{formatPrice(total, "MMK")}</span>
              </div>

              {isCod && paymentMethod && (
                <div className="checkout-summary-row checkout-summary-row--deposit">
                  <span>DEPOSIT NOW</span>
                  <span>{formatPrice(depositAmount, "MMK")}</span>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}