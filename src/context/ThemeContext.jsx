import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext = createContext(null);

const STORAGE_KEY = "bv-theme";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // 1. Saved preference
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") return saved;
    } catch {
      /* ignore */
    }

    // 2. System preference
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }

    // 3. Default
    return "light";
  });

  // Apply to <html> attribute
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  // Follow system changes if user hasn't chosen manually
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) setTheme(e.matches ? "dark" : "light");
      } catch {
        /* ignore */
      }
    };

    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  const toggle = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  const set = (next) => setTheme(next);

  return (
    <ThemeContext.Provider value={{ theme, toggle, set }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}