"use client";

import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";
import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // true on the client, false during server rendering: avoids a theme hydration mismatch
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle theme"
      className="text-muted-foreground hover:text-primary transition-colors"
    >
      {theme === "light" ? (
        <FiMoon className="w-5 h-5" />
      ) : (
        <FiSun className="w-5 h-5" />
      )}
    </button>
  );
}
