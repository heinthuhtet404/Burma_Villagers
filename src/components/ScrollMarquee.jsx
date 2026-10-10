export default function ScrollMarquee({
  items = [
    "BUILT FOR EVERYDAY",
    "350 GSM",
    "BURMA VILLAGERS",
    "HEAVY. CLEAN. HONEST.",
  ],
  speed = 40, // seconds per full loop
}) {
  // Duplicate items so the loop is seamless
  const loop = [...items, ...items];

  return (
    <div className="marquee" aria-hidden="true">
      <div
        className="marquee-track"
        style={{ animationDuration: `${speed}s` }}
      >
        {loop.map((text, i) => (
          <span key={i} className="marquee-item">
            {text}
            <span className="marquee-dot">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}