import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const TRANSITION_MS = 480;

export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [stage, setStage] = useState("idle");

  useEffect(() => {
    if (location.pathname === displayLocation.pathname) {
      return;
    }

    // 1. Start exit
    setStage("out");

    // 2. Swap content + start enter
    const t1 = setTimeout(() => {
      setDisplayLocation(location);
      setStage("in");
    }, TRANSITION_MS);

    // 3. Return to idle + force reveal any missed grids
    const t2 = setTimeout(() => {
      setStage("idle");

      // 🎯 Force reveal any reveal elements currently in viewport
      requestAnimationFrame(() => {
        document
          .querySelectorAll(".reveal, .reveal-stagger")
          .forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
              el.classList.add("is-revealed");
            }
          });
      });
    }, TRANSITION_MS + 380);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [location, displayLocation.pathname]);

  return (
    <>
      <div
        className={`page-content ${
          stage === "out" ? "is-exiting" : ""
        } ${stage === "in" ? "is-entering" : ""}`}
      >
        {children}
      </div>

      <div
        className={`page-curtain ${
          stage === "out" ? "is-covering" : ""
        } ${stage === "in" ? "is-uncovering" : ""}`}
        aria-hidden="true"
      >
        <div className="page-curtain-inner">
          <span className="page-curtain-mark">BURMA VILLAGERS</span>
        </div>
      </div>
    </>
  );
}