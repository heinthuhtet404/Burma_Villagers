import { useEffect, useRef } from "react";

export default function useScrollReveal({
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
  once = true,
  watchChildren = false,
  fallbackDelay = 900,
} = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reveal = (target) => target.classList.add("is-revealed");

    const revealAll = () => {
      reveal(el);
      el.querySelectorAll(".reveal, .reveal-stagger").forEach(reveal);
    };

    // Reduced motion → instant
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            entry.target.classList.remove("is-revealed");
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);

    // Watch children (for async grids)
    if (watchChildren) {
      const children = el.children;
      for (let i = 0; i < children.length; i++) observer.observe(children[i]);
    }

    // Watch for new children
    let mutationObserver;
    if (watchChildren && typeof MutationObserver !== "undefined") {
      mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) observer.observe(node);
          });
        });
      });
      mutationObserver.observe(el, { childList: true });
    }

    // 🛡️ Fallback — reveal after delay regardless
    const fallback = setTimeout(() => {
      if (!el.classList.contains("is-revealed")) revealAll();
    }, fallbackDelay);

    return () => {
      observer.disconnect();
      mutationObserver?.disconnect();
      clearTimeout(fallback);
    };
  }, [threshold, rootMargin, once, watchChildren, fallbackDelay]);

  return ref;
}