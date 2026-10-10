import { useEffect, useState } from "react";

function diff(target) {
  const now = Date.now();
  const d = Math.max(target - now, 0);
  return {
    days: Math.floor(d / (1000 * 60 * 60 * 24)),
    hours: Math.floor((d / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((d / (1000 * 60)) % 60),
    seconds: Math.floor((d / 1000) % 60),
  };
}

export default function Countdown({ target }) {
  const [t, setT] = useState(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="countdown" role="timer" aria-live="polite">
      <div className="countdown-cell">
        <span className="countdown-num">{pad(t.days)}</span>
        <span className="countdown-label">DAYS</span>
      </div>
      <span className="countdown-sep">:</span>
      <div className="countdown-cell">
        <span className="countdown-num">{pad(t.hours)}</span>
        <span className="countdown-label">HRS</span>
      </div>
      <span className="countdown-sep">:</span>
      <div className="countdown-cell">
        <span className="countdown-num">{pad(t.minutes)}</span>
        <span className="countdown-label">MIN</span>
      </div>
      <span className="countdown-sep">:</span>
      <div className="countdown-cell">
        <span className="countdown-num">{pad(t.seconds)}</span>
        <span className="countdown-label">SEC</span>
      </div>
    </div>
  );
}