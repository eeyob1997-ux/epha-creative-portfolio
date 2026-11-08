"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  // Read the theme that was already applied to <html> by the layout script
  useEffect(() => {
    const current =
      document.documentElement.getAttribute("data-theme") === "light"
        ? "light"
        : "dark";
    setTheme(current);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);

    if (next === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    try {
      localStorage.setItem("theme", next);
    } catch {
      // ignore storage errors (private mode etc.)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      title={theme === "dark" ? "Light mode" : "Dark mode"}
      className="theme-toggle flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white transition hover:border-[#c9ff27] hover:text-[#c9ff27]"
    >
      {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
