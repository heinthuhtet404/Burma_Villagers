import { useEffect, useRef } from "react";

export default function useTilt({ max = 8, scale = 1.02 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let raf = 0;
    let target = { rx: 0, ry: 0, s: 1 };
    let current = { rx: 0, ry: 0, s: 1 };

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const ry = (px - 0.5) * 2 * max;
      const rx = -(py - 0.5) * 2 * max;
      target = { rx, ry, s: scale };
    };

    const handleLeave = () => {
      target = { rx: 0, ry: 0, s: 1 };
    };

    const loop = () => {
      current.rx += (target.rx - current.rx) * 0.12;
      current.ry += (target.ry - current.ry) * 0.12;
      current.s  += (target.s  - current.s ) * 0.12;
      el.style.transform = `perspective(900px) rotateX(${current.rx.toFixed(2)}deg) rotateY(${current.ry.toFixed(2)}deg) scale(${current.s.toFixed(3)})`;
      raf = requestAnimationFrame(loop);
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
  }, [max, scale]);

  return ref;
}