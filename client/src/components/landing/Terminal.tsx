import { useEffect, useState } from "react";

const lines = [
  "> npm install @codexa/core",
  "✔ Packages installed",
  "",
  "> Generating AI Workspace...",
  "✔ Components Generated",
  "✔ API Routes Created",
  "✔ Database Connected",
  "",
  "> Starting development server...",
  "✔ http://localhost:5173",
];

export default function Terminal() {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (lineIndex >= lines.length) return;

    const line = lines[lineIndex];

    if (charIndex < line.length) {
      const timeout = setTimeout(() => {
        setCurrentLine(line.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      }, 30);

      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setVisibleLines((prev) => [...prev, line]);
      setCurrentLine("");
      setCharIndex(0);

      if (lineIndex === lines.length - 1) {
        setTimeout(() => {
          setVisibleLines([]);
          setLineIndex(0);
        }, 2500);
      } else {
        setLineIndex((i) => i + 1);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [charIndex, lineIndex]);

  return (
    <div className="overflow-hidden rounded-3xl border border-green-500/20 bg-[#050505] shadow-2xl">

      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">

        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
        </div>

        <span className="text-sm text-zinc-400">
          terminal
        </span>

      </div>

      <div className="h-[240px] overflow-hidden p-6 font-mono text-sm">

        {visibleLines.map((line, index) => (
          <p
            key={index}
            className={
              line.startsWith("✔")
                ? "text-green-400"
                : line.startsWith(">")
                ? "text-cyan-400"
                : "text-zinc-400"
            }
          >
            {line}
          </p>
        ))}

        <p className="text-cyan-400">
          {currentLine}
          <span className="animate-pulse">|</span>
        </p>

      </div>
    </div>
  );
}