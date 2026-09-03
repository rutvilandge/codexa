import { type FormEvent, useEffect, useRef, useState } from "react";
import { TerminalSquare } from "lucide-react";

export default function Terminal({ projectId }: { projectId: string }) {
  const [command, setCommand] = useState("");
  const [lines, setLines] = useState<string[]>(["Codexa project terminal ready."]);
  const [running, setRunning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  async function execute(event?: FormEvent, requestedCommand?: string) {
    event?.preventDefault(); const submitted = requestedCommand ?? command.trim(); if (!submitted || running) return;
    setLines((items) => [...items, `$ ${submitted}`]); setCommand(""); setRunning(true);
    const controller = new AbortController(); abortRef.current = controller;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL ?? "http://localhost:5000/api"}/terminal/${projectId}/execute`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ command: submitted }), signal: controller.signal });
      if (!response.ok || !response.body) throw new Error("Terminal request failed");
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = "";
      while (true) { const { value, done } = await reader.read(); if (done) break; buffer += decoder.decode(value, { stream: true }); const events = buffer.split("\n\n"); buffer = events.pop() ?? ""; events.forEach((entry) => { const data = entry.split("\n").find((line) => line.startsWith("data: "))?.slice(6); if (data) { const parsed = JSON.parse(data); setLines((items) => [...items, typeof parsed === "string" ? parsed : `Process exited with code ${parsed.exitCode}`]); } }); }
    } catch (error) { if ((error as Error).name !== "AbortError") setLines((items) => [...items, "Terminal command failed."]); } finally { setRunning(false); abortRef.current = null; }
  }
  useEffect(() => {
    const runDefault = () => { void execute(undefined, "npm run dev"); };
    window.addEventListener("codexa:run", runDefault);
    return () => window.removeEventListener("codexa:run", runDefault);
  });
  return <div className="flex h-full flex-col bg-[#09090B]"><div className="flex items-center justify-between border-b border-white/10 px-4 py-2"><div className="flex items-center gap-2"><TerminalSquare size={16} className="text-violet-400" /><span className="text-sm font-medium text-white">Terminal</span></div>{running && <button type="button" onClick={() => abortRef.current?.abort()} className="text-xs text-red-300 hover:text-red-200">Stop</button>}</div><div className="flex-1 overflow-auto p-4 font-mono text-sm whitespace-pre-wrap">{lines.map((line, index) => <div key={index} className="mb-1 text-zinc-300">{line}</div>)}</div><form onSubmit={(event) => void execute(event)} className="flex border-t border-white/10 p-3"><span className="mr-2 text-emerald-400">$</span><input value={command} onChange={(event) => setCommand(event.target.value)} disabled={running} className="flex-1 bg-transparent outline-none" placeholder="npm run dev" /></form></div>;
}
