import { useEffect, useRef } from "react";

export default function useMagnetic({
  strength = 0.35,
  radius = 90,
  cursorPull = 0.15,
} = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let raf = 0;
    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };
    let isInside = false; // ← track state

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const zone = radius + Math.max(rect.width, rect.height) / 2;

      if (dist < zone) {
        target.x = dx * strength;
        target.y = dy * strength;

        // Only dispatch when entering — not every frame
        if (!isInside) {
          isInside = true;
          window.dispatchEvent(
            new CustomEvent("magnetic:enter", {
              detail: {
                x: cx,
                y: cy,
                pull: cursorPull,
                width: rect.width,
                height: rect.height,
              },
            })
          );
        }
      } else {
        target.x = 0;
        target.y = 0;

        if (isInside) {
          isInside = false;
          window.dispatchEvent(new CustomEvent("magnetic:leave"));
        }
      }
    };

    const handleLeave = () => {
      target.x = 0;
      target.y = 0;

      if (isInside) {
        isInside = false;
        window.dispatchEvent(new CustomEvent("magnetic:leave"));
      }
    };

    const loop = () => {
      current.x += (target.x - current.x) * 0.15;
      current.y += (target.y - current.y) * 0.15;

      el.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0)`;

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
  }, [strength, radius, cursorPull]);

  return ref;
}