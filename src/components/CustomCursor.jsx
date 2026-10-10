import { useEffect, useRef } from "react";
import useCursorLabel from "../hooks/useCursor";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const labelRef = useRef(null);
  const label = useCursorLabel();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const dot = dotRef.current;
    const labelEl = labelRef.current;
    if (!dot || !labelEl) return;

    let mx = -100;
    let my = -100;
    let lx = -100;
    let ly = -100;
    let needsUpdate = false;
    let raf = 0;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      needsUpdate = true;

      // Dot: instant, no lag → feels light
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
    };

    const onLeave = () => {
      dot.style.opacity = "0";
      labelEl.style.opacity = "0";
    };
    const onEnter = () => {
      dot.style.opacity = "1";
    };

    const loop = () => {
      // Only run smoothing while pointer has moved recently
      lx += (mx - lx) * 0.22;
      ly += (my - ly) * 0.22;
      labelEl.style.transform = `translate3d(${lx}px, ${ly}px, 0) translate(-50%, -50%)`;

      // Stop loop when label has caught up
      if (Math.abs(mx - lx) < 0.1 && Math.abs(my - ly) < 0.1) {
        needsUpdate = false;
      }
      raf = needsUpdate ? requestAnimationFrame(loop) : 0;
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    // Hook the loop kick into pointer movement
    const onMoveKick = (e) => {
      onMove(e);
      kick();
    };

    window.addEventListener("mousemove", onMoveKick, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMoveKick);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div
        ref={labelRef}
        className={`cursor-label ${label ? "is-visible" : ""}`}
        aria-hidden="true"
      >
        {label}
      </div>
    </>
  );
}