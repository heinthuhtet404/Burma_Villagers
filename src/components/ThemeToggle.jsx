import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      className="navbar-theme"
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span className="navbar-theme-icon" aria-hidden="true">
        {isDark ? (
          // Sun
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="8"
              cy="8"
              r="3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <line x1="8" y1="1" x2="8" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="8" y1="13" x2="8" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="1" y1="8" x2="3" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="13" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="3" y1="3" x2="4.5" y2="4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="11.5" y1="11.5" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="3" y1="13" x2="4.5" y2="11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="11.5" y1="4.5" x2="13" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ) : (
          // Moon
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.5 9.5C12.5 11.5 10.5 13 8 13C5.5 13 3 10.5 3 8C3 5.5 4.5 3.5 6.5 2.5C5.5 4 5 5.5 5 7C5 10 7 12 10 12C11 12 12.5 11 13.5 9.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        )}
      </span>
    </button>
  );
}