import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  return <button type="button" onClick={() => setTheme(isDark ? "light" : "dark")} className="rounded-lg border border-white/10 p-2 text-zinc-400 hover:text-white" aria-label="Toggle theme">{isDark ? <Sun size={16} /> : <Moon size={16} />}</button>;
}
