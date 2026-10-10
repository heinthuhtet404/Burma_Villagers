import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../data/products";

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

const PAYMENT = {
  cod: { id: "cod", label: "CASH ON DELIVERY" },
  bank: { id: "bank", label: "BANK TRANSFER" },
  kpay: { id: "kpay", label: "KPAY / WAVE PAY" },
};

const STEPS = [
  { n: 1, label: "INFO" },
  { n: 2, label: "DELIVERY" },
  { n: 3, label: "PAYMENT" },
  { n: 4, label: "REVIEW" },
];

export default function Checkout() {
  const { items, subtotal, count, clear } = useCart();
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
  const [delivery, setDelivery] = useState("standard");
  const [payment, setPayment] = useState(null); // ← no default — user must select
  const [submitting, setSubmitting] = useState(false);

  const deliveryFee = DELIVERY[delivery].price;
  const total = subtotal + deliveryFee;

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const isInfoValid =
    form.name.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.address.trim();

  const canProceed = () => {
    if (step === 1) return isInfoValid;
    if (step === 2) return !!delivery;
    if (step === 3) return !!payment; // ← require payment selection
    return true;
  };

  const handleNext = () => {
    if (!canProceed()) return;
    setStep((s) => Math.min(s + 1, 4));
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (step !== 4) return;
    if (!isInfoValid || !payment || count === 0) return;

    setSubmitting(true);

    const order = {
      id: `BV-${Date.now().toString().slice(-8)}`,
      items,
      subtotal,
      deliveryFee,
      total,
      form,
      delivery,
      payment,
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      try {
        sessionStorage.setItem("bv-last-order", JSON.stringify(order));
      } catch {
        /* ignore */
      }
      clear();
      navigate("/order-confirmation");
    }, 700);
  };

  // Empty cart guard
  if (count === 0) {
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

        <div className="checkout-inner">
          <form className="checkout-form" onSubmit={handlePlaceOrder}>
            <header className="checkout-head">
              <p className="section-eyebrow">SECURE CHECKOUT</p>
              <h1 className="checkout-title">
                COMPLETE
                <br />
                YOUR ORDER.
              </h1>

              {/* Step indicator — 4 steps */}
              <div className="checkout-steps">
                {STEPS.map((s) => (
                  <button
                    type="button"
                    key={s.n}
                    className={`checkout-step ${
                      step >= s.n ? "is-active" : ""
                    } ${step === s.n ? "is-current" : ""}`}
                    onClick={() => {
                      // Can only jump back to previous steps
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

            {/* STEP 1 — INFO */}
            {step === 1 && (
              <div className="checkout-section">
                <p className="checkout-section-title">
                  01 — CONTACT & ADDRESS
                </p>

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

            {/* STEP 2 — DELIVERY */}
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

            {/* STEP 3 — PAYMENT */}
            {step === 3 && (
              <div className="checkout-section">
                <p className="checkout-section-title">03 — PAYMENT</p>

                <div className="checkout-options">
                  {Object.values(PAYMENT).map((p) => (
                    <label
                      key={p.id}
                      className={`checkout-option ${
                        payment === p.id ? "is-active" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={p.id}
                        checked={payment === p.id}
                        onChange={() => setPayment(p.id)}
                      />
                      <span className="checkout-option-radio" />
                      <span className="checkout-option-info">
                        <span className="checkout-option-label">
                          {p.label}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>

                <p className="checkout-note">
                  All orders are packed in Yangon. Free returns within
                  7 days.
                </p>
              </div>
            )}

            {/* STEP 4 — REVIEW */}
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
                      {PAYMENT[payment]?.label}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Nav */}
            <div className="checkout-nav">
              {step > 1 && (
                <button
                  type="button"
                  className="checkout-back"
                  onClick={handleBack}
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

          {/* Summary */}
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
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}