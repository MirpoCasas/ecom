import "./theme-toggle-styles.css";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="toggle-container">
      <div className="daynight">
        <label htmlFor="checkbox">
          <input
            type="checkbox"
            id="checkbox"
            checked={theme === "dark"}
            onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
          />
          <div className="toggle">
            <div className="cloud"></div>
            <div className="star"></div>
            <div className="sea"></div>
            <div className="mountains"></div>
          </div>
        </label>
      </div>
    </div>
  );
}
