import { useEffect, useRef } from "react";

export default function useParallax({ speed = 0.15 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let current = 0;
    let target = 0;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // -1..1 as element passes through viewport
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
      target = -progress * 100 * speed;
    };

    const loop = () => {
      current += (target - current) * 0.12;
      el.style.transform = `translate3d(0, ${current.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, [speed]);

  return ref;
}