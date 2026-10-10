import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let target = 0;
    let current = 0;

    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      target = h > 0 ? window.scrollY / h : 0;
    };

    const loop = () => {
      current += (target - current) * 0.15;
      el.style.transform = `scaleX(${current.toFixed(4)})`;
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
  }, []);

  return <div ref={ref} className="scroll-progress" aria-hidden="true" />;
}