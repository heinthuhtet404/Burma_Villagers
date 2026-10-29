import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useScrollReveal from "../hooks/useScrollReveal";
import { supabase } from "../lib/supabase";

/* ============================================================
   DROP CONFIG — Coming Soon
   ============================================================ */
const NEXT_DROP = {
  number: "002",
  name: "350 GSM AIR LAYER — PART II",
  tagline: "HEAVY. CLEAN. EVERYDAY.",
  description:
    "The next chapter from Burma Villagers. New colorways, new cuts, same heavy-weight fabric. Drop 002 arrives soon.",
  // ⚠️ သင့် drop ရက်စွဲ ထည့် — ဥပမာ 30 days from now
  releaseDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
};

/* ============================================================
   Countdown — days / hours / minutes / seconds
   ============================================================ */
function useCountdown(targetDate) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(targetDate.getTime() - now, 0);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isLive: diff === 0 };
}

export default function NewDrop() {
  const headerRef = useScrollReveal();
  const countdownRef = useScrollReveal({ threshold: 0.2 });
  const notifyRef = useScrollReveal({ threshold: 0.2 });
  const teaserRef = useScrollReveal({ threshold: 0.2 });

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { days, hours, minutes, seconds, isLive } = useCountdown(
    NEXT_DROP.releaseDate
  );

  const pad = (n) => String(n).padStart(2, "0");

  const handleNotify = async (e) => {
    e.preventDefault();

    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;

    setSubmitting(true);
    setError("");

    try {
      const { error: sbError } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: trimmed, source: "new-drop" });

      // 23505 = unique violation (email ရှိပြီးသား)
      // ဒါကို error မပြဘဲ success ပြမယ်
      if (sbError && sbError.code !== "23505") {
        throw sbError;
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Subscribe failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="new-drop-page new-drop-coming">
      {/* ============================================
          TICKER
          ============================================ */}
      <div className="drop-ticker" aria-hidden="true">
        <div className="drop-ticker-track">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="drop-ticker-item">
              DROP {NEXT_DROP.number}
              <span className="drop-ticker-dot">•</span>
              {isLive ? "LIVE NOW" : "COMING SOON"}
              <span className="drop-ticker-dot">•</span>
              {NEXT_DROP.name}
              <span className="drop-ticker-dot">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* ============================================
          HERO — Coming Soon
          ============================================ */}
      <div ref={headerRef} className="container drop-coming-hero reveal">
        <div className="drop-coming-status">
          <span className="drop-coming-status-dot" />
          {isLive ? "LIVE NOW" : "COMING SOON"}
        </div>

        <p className="drop-coming-eyebrow">
          DROP {NEXT_DROP.number} — {NEXT_DROP.name}
        </p>

        <h1 className="drop-coming-title">
          <span>SOON.</span>
          <span className="drop-coming-title-outline">
            VERY SOON.
          </span>
        </h1>

        <p className="drop-coming-desc">
          {NEXT_DROP.description}
        </p>

        <div className="drop-coming-actions">
          <Link to="/shop" className="btn btn-primary drop-coming-cta">
            <span>SHOP CURRENT DROP</span>
            <span className="drop-coming-cta-arrow">→</span>
          </Link>
        </div>
      </div>

      {/* ============================================
          COUNTDOWN (commented out — လိုအပ်ရင် ပြန်ဖွင့်ပါ)
          ============================================ */}
      {/* <div
        ref={countdownRef}
        className="container drop-coming-countdown reveal"
      >
        <p className="drop-coming-countdown-label">
          {isLive ? "DROP IS LIVE" : "NEXT DROP IN"}
        </p>

        <div className="drop-countdown">
          <div className="drop-countdown-cell">
            <span className="drop-countdown-num">{pad(days)}</span>
            <span className="drop-countdown-unit">DAYS</span>
          </div>
          <span className="drop-countdown-sep">:</span>
          <div className="drop-countdown-cell">
            <span className="drop-countdown-num">{pad(hours)}</span>
            <span className="drop-countdown-unit">HRS</span>
          </div>
          <span className="drop-countdown-sep">:</span>
          <div className="drop-countdown-cell">
            <span className="drop-countdown-num">{pad(minutes)}</span>
            <span className="drop-countdown-unit">MIN</span>
          </div>
          <span className="drop-countdown-sep">:</span>
          <div className="drop-countdown-cell">
            <span className="drop-countdown-num">{pad(seconds)}</span>
            <span className="drop-countdown-unit">SEC</span>
          </div>
        </div>

        <p className="drop-coming-countdown-date">
          {NEXT_DROP.releaseDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div> */}

      {/* ============================================
          TEASER — Editorial
          ============================================ */}
      <div ref={teaserRef} className="container drop-coming-teaser reveal">
        <div className="drop-coming-teaser-grid">
          <div className="drop-coming-teaser-item">
            <span className="drop-coming-teaser-num">01</span>
            <p className="drop-coming-teaser-title">HEAVY</p>
            <p className="drop-coming-teaser-text">
              Weight you can feel.
            </p>
          </div>
          <div className="drop-coming-teaser-item">
            <span className="drop-coming-teaser-num">02</span>
            <p className="drop-coming-teaser-title">CLEAN</p>
            <p className="drop-coming-teaser-text">
              Nothing extra.
            </p>
          </div>
          <div className="drop-coming-teaser-item">
            <span className="drop-coming-teaser-num">03</span>
            <p className="drop-coming-teaser-title">EVERYDAY</p>
            <p className="drop-coming-teaser-text">
              Made to be worn.
            </p>
          </div>
        </div>
      </div>

      {/* ============================================
          NOTIFY — Email signup
          ============================================ */}
      <div ref={notifyRef} className="drop-notify reveal reveal--story">
        <div className="container drop-notify-inner">
          <div>
            <p className="section-eyebrow">BE FIRST TO KNOW</p>
            <h2 className="drop-notify-title">
              JOIN THE
              <br />
              WAITLIST.
            </h2>
          </div>

          {submitted ? (
            <div className="drop-notify-success">
              <p className="drop-notify-success-title">
                ✓ YOU'RE ON THE LIST
              </p>
              <p className="drop-notify-success-text">
                We'll email you when Drop {NEXT_DROP.number} goes live.
              </p>
            </div>
          ) : (
            <form className="drop-notify-form" onSubmit={handleNotify}>
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="drop-notify-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={submitting}
              />
              <button
                type="submit"
                className="btn btn-primary drop-notify-btn"
                disabled={submitting}
              >
                <span>{submitting ? "SENDING…" : "NOTIFY ME"}</span>
                <span className="drop-notify-arrow">→</span>
              </button>
              {error && <p className="drop-notify-error">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}