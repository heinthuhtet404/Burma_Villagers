export default function SplitText({
  text,
  className = "",
  delay = 0,
  stagger = 40,
}) {
  const lines = text.split("\n");

  return (
    <span className={className} style={{ display: "inline-block" }}>
      {lines.map((line, li) => (
        <span
          key={li}
          style={{ display: "block", overflow: "hidden" }}
        >
          {line.split("").map((ch, ci) => (
            <span
              key={ci}
              className="split-char"
              style={{
                animationDelay: `${delay + (li * 400) + (ci * stagger)}ms`,
              }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}