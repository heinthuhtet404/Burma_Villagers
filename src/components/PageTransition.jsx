import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const TRANSITION_MS = 480;

export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [stage, setStage] = useState("idle");

  useEffect(() => {
    if (location.pathname === displayLocation.pathname) {
      // Same route — no transition
      return;
    }

    // 1. Start exit
    setStage("out");

    // 2. Swap content + start enter
    const t1 = setTimeout(() => {
      setDisplayLocation(location);
      setStage("in");
    }, TRANSITION_MS);

    // 3. Return to idle (after enter animation finishes)
    const t2 = setTimeout(() => {
      setStage("idle");
    }, TRANSITION_MS + 380); // enter animation is 420ms → wait a bit longer

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