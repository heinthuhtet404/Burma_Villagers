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

    let magneticTarget = null;
    let needsUpdate = false;
    let raf = 0;

    // --- Define loop + kick FIRST so events can reference them ---
    const loop = () => {
      lx += (mx - lx) * 0.22;
      ly += (my - ly) * 0.22;
      labelEl.style.transform = `translate3d(${lx}px, ${ly}px, 0) translate(-50%, -50%)`;

      if (Math.abs(mx - lx) < 0.1 && Math.abs(my - ly) < 0.1) {
        needsUpdate = false;
      }
      raf = needsUpdate ? requestAnimationFrame(loop) : 0;
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    // --- Event handlers ---
    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      needsUpdate = true;

      let tx = mx;
      let ty = my;

      if (magneticTarget) {
        tx = mx + (magneticTarget.x - mx) * magneticTarget.pull;
        ty = my + (magneticTarget.y - my) * magneticTarget.pull;
      }

      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;
    };

    const onMoveKick = (e) => {
      onMove(e);
      kick();
    };

    const onLeave = () => {
      dot.style.opacity = "0";
      labelEl.style.opacity = "0";
    };

    const onEnter = () => {
      dot.style.opacity = "1";
    };

    const onMagneticEnter = (e) => {
      magneticTarget = {
        x: e.detail.x,
        y: e.detail.y,
        pull: e.detail.pull ?? 0.15,
      };
      needsUpdate = true;
      kick();
    };

    const onMagneticLeave = () => {
      magneticTarget = null;
      needsUpdate = true;
      kick();
    };

    // --- Register ---
    window.addEventListener("mousemove", onMoveKick, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    window.addEventListener("magnetic:enter", onMagneticEnter);
    window.addEventListener("magnetic:leave", onMagneticLeave);

    return () => {
      window.removeEventListener("mousemove", onMoveKick);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("magnetic:enter", onMagneticEnter);
      window.removeEventListener("magnetic:leave", onMagneticLeave);
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