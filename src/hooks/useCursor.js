import { useEffect, useState } from "react";

export default function useCursorLabel() {
  const [label, setLabel] = useState("");

  useEffect(() => {
    const handleEnter = (e) => {
      const el = e.target.closest("[data-cursor]");
      if (el) setLabel(el.getAttribute("data-cursor") || "");
    };
    const handleLeave = (e) => {
      const el = e.target.closest("[data-cursor]");
      if (el) setLabel("");
    };

    document.addEventListener("mouseover", handleEnter);
    document.addEventListener("mouseout", handleLeave);
    return () => {
      document.removeEventListener("mouseover", handleEnter);
      document.removeEventListener("mouseout", handleLeave);
    };
  }, []);

  return label;
}