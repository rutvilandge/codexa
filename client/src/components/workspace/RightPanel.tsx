import {
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, Check, Copy, Send, Sparkles, Wand2, X } from "lucide-react";

import { getConversation, sendChatMessage, type AiTool } from "@/services/aiApi";
import { saveWorkspaceFile } from "@/services/workspaceApi";
import { useWorkspaceStore } from "@/store/workspaceStore";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  edits?: AiEdit[];
};

type AiEdit = { path: string; content: string };

const editsPattern = /```codexa-edits\s*([\s\S]*?)```/i;

function extractEdits(content: string): { content: string; edits?: AiEdit[] } {
  const match = content.match(editsPattern);
  if (!match) return { content };
  try {
    const parsed = JSON.parse(match[1]) as { files?: unknown };
    const edits = Array.isArray(parsed.files)
      ? parsed.files.filter((file): file is AiEdit => typeof file === "object" && file !== null && typeof (file as AiEdit).path === "string" && typeof (file as AiEdit).content === "string" && !/(^|[\\/])\.\.([\\/]|$)/.test((file as AiEdit).path) && !(file as AiEdit).path.startsWith("/"))
      : [];
    return { content: content.replace(editsPattern, "").trim(), edits: edits.length ? edits : undefined };
  } catch { return { content }; }
}

interface RightPanelProps {
  onClose: () => void;
  projectId: string;
}

function CodeBlock({ children }: { children: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const codeElement = Array.isArray(children) ? children[0] : children;
  const code =
    typeof codeElement === "object" &&
    codeElement !== null &&
    "props" in codeElement
      ? String((codeElement as { props: { children?: ReactNode } }).props.children ?? "")
      : String(codeElement ?? "");
  const language =
    typeof codeElement === "object" &&
    codeElement !== null &&
    "props" in codeElement
      ? String((codeElement as { props: { className?: string } }).props.className ?? "")
          .replace("language-", "")
      : "";

  async function copyCode() {
    await navigator.clipboard.writeText(code.replace(/\n$/, ""));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1_800);
  }

  return (
    <div className="my-3 overflow-hidden rounded-lg border border-white/10 bg-[#08080b]">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-3 py-1.5">
        <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
          {language || "code"}
        </span>
        <button
          type="button"
          onClick={() => void copyCode()}
          className="flex items-center gap-1 text-[11px] text-zinc-400 transition-colors hover:text-white"
        >
          {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 text-xs leading-5 text-zinc-200">{children}</pre>
    </div>
  );
}

function AssistantMessage({ content }: { content: string }) {
  return (
    <div className="markdown-content text-sm leading-6 text-zinc-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
          code: ({ className, children, ...props }) => (
            <code
              className={className ?? "rounded bg-white/10 px-1 py-0.5 font-mono text-[0.85em] text-violet-200"}
              {...props}
            >
              {children}
            </code>
          ),
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noreferrer" className="text-violet-300 underline underline-offset-2">
              {children}
            </a>
          ),
          ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>,
          p: ({ children }) => <p className="my-2 first:mt-0 last:mb-0">{children}</p>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default function RightPanel({ onClose, projectId }: RightPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const currentFile = useWorkspaceStore((state) => state.activeFile);
  const openFiles = useWorkspaceStore((state) => state.files);
  const selectedCode = useWorkspaceStore((state) => state.selectedCode);
  const openFile = useWorkspaceStore((state) => state.openFile);
  const replaceFileContent = useWorkspaceStore((state) => state.replaceFileContent);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  useEffect(() => {
    let active = true;
    void getConversation(projectId)
      .then((history) => { if (active) setMessages(history.map((message) => ({ ...message, ...(message.role === "assistant" ? extractEdits(message.content) : {}) }))); })
      .catch(() => { if (active) setMessages([]); });
    return () => { active = false; };
  }, [projectId]);

  useEffect(() => {
    const handleAction = (event: Event) => {
      const tool = (event as CustomEvent<AiTool>).detail;
      if (!tool || !["explain", "generate", "fix"].includes(tool)) return;
      const message = tool === "explain" ? "Explain the selected code or current file." : tool === "fix" ? "Find and safely fix errors in the current file." : "Generate a React component appropriate for this project. Return an edit proposal.";
      void submitMessage(undefined, { tool, message });
    };
    window.addEventListener("codexa:ai-action", handleAction);
    return () => window.removeEventListener("codexa:ai-action", handleAction);
  });

  async function submitMessage(event?: FormEvent<HTMLFormElement>, request?: { message: string; tool: AiTool }) {
    event?.preventDefault();
    const message = request?.message ?? draft.trim();

    if (!message || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };

    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage({
        message,
        projectId,
        tool: request?.tool,
        currentFile: currentFile ? { path: currentFile.path, content: currentFile.content } : undefined,
        openFiles: openFiles.filter((file) => file.path !== currentFile?.path).map((file) => ({ path: file.path, content: file.content })),
        selectedCode: selectedCode || undefined,
      });
      const parsedResponse = extractEdits(response);
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: "assistant", ...parsedResponse },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "I couldn't reach the AI service. Please confirm the backend is running and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  async function applyEdits(edits: AiEdit[]) {
    try {
      for (const edit of edits) {
        await saveWorkspaceFile(projectId, edit.path, edit.content);
        const existing = openFiles.find((file) => file.path === edit.path);
        if (existing) replaceFileContent(edit.path, edit.content, false);
        else openFile({ id: edit.path, path: edit.path, name: edit.path.split("/").pop() ?? edit.path, language: edit.path.split(".").pop() ?? "text", content: edit.content, dirty: false });
      }
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", content: `Applied ${edits.length} file change${edits.length === 1 ? "" : "s"} to your workspace.` }]);
    } catch {
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", content: "I couldn't apply all proposed changes. Please check your workspace connection and try again." }]);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submitMessage();
    }
  }

  return (
    <aside className="flex h-full min-w-0 flex-col border-l border-white/10 bg-[#0b0b0c]/90 backdrop-blur-xl">
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-600/25">
            <Sparkles size={16} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Codexa AI</h2>
            <p className="text-[11px] text-emerald-400">Ready to help</p>
          </div>
        </div>
        <button type="button" onClick={onClose} title="Close AI chat" aria-label="Close AI chat" className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-white/10 hover:text-white">
          <X size={16} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        {messages.length === 0 && (
          <div className="mt-4 rounded-xl border border-dashed border-violet-400/20 bg-violet-500/[0.04] p-4 text-sm text-zinc-400">
            <Bot size={20} className="mb-3 text-violet-300" />
            <p className="font-medium text-zinc-200">Your coding copilot is ready.</p>
            <p className="mt-1 text-xs leading-5">Ask Codexa to explain code, investigate a bug, or sketch an implementation.</p>
          </div>
        )}

        <div className="mb-4 flex flex-wrap gap-2">
          <button type="button" disabled={!currentFile || isLoading} onClick={() => void submitMessage(undefined, { tool: "explain", message: selectedCode ? "Explain the selected code." : "Explain the current file." })} className="rounded-md border border-white/10 px-2 py-1 text-[11px] text-zinc-300 hover:border-violet-400/50 disabled:opacity-40">Explain</button>
          <button type="button" disabled={!currentFile || isLoading} onClick={() => void submitMessage(undefined, { tool: "fix", message: "Find likely bugs in the current file and propose a safe fix." })} className="rounded-md border border-white/10 px-2 py-1 text-[11px] text-zinc-300 hover:border-violet-400/50 disabled:opacity-40">Fix errors</button>
          <button type="button" disabled={!currentFile || isLoading} onClick={() => void submitMessage(undefined, { tool: "refactor", message: "Refactor the current file for clarity and maintainability. Return an edit proposal." })} className="rounded-md border border-white/10 px-2 py-1 text-[11px] text-zinc-300 hover:border-violet-400/50 disabled:opacity-40">Refactor</button>
          <button type="button" disabled={!currentFile || isLoading} onClick={() => void submitMessage(undefined, { tool: "test", message: "Create focused unit tests for the current file. Return an edit proposal." })} className="rounded-md border border-white/10 px-2 py-1 text-[11px] text-zinc-300 hover:border-violet-400/50 disabled:opacity-40">Tests</button>
        </div>

        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={message.role === "user" ? "flex justify-end" : "flex gap-2.5"}>
              {message.role === "assistant" && <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-violet-500/15 text-violet-300"><Bot size={14} /></div>}
              <div className={message.role === "user" ? "max-w-[88%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-violet-600 to-fuchsia-600 px-3.5 py-2.5 text-sm leading-6 text-white shadow-md shadow-violet-950/30" : "min-w-0 flex-1 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3.5 py-2.5"}>
                {message.role === "user" ? <span className="whitespace-pre-wrap">{message.content}</span> : <AssistantMessage content={message.content} />}
                {message.role === "assistant" && message.edits && (
                  <button type="button" onClick={() => void applyEdits(message.edits!)} className="mt-3 flex items-center gap-1.5 rounded-md bg-violet-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-violet-500"><Wand2 size={13} />Apply {message.edits.length} change{message.edits.length === 1 ? "" : "s"}</button>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2.5 text-sm text-zinc-400">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-500/15 text-violet-300"><Bot size={14} /></div>
              <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2">
                <span>Codexa is thinking</span>
                <span className="flex gap-1"><i className="h-1 w-1 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.3s]" /><i className="h-1 w-1 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.15s]" /><i className="h-1 w-1 animate-bounce rounded-full bg-violet-400" /></span>
              </div>
            </div>
          )}
        </div>
        <div ref={scrollAnchorRef} />
      </div>

      <form onSubmit={(event) => void submitMessage(event)} className="border-t border-white/10 p-3">
        <div className="rounded-xl border border-white/10 bg-[#121216] p-2 transition-colors focus-within:border-violet-500/50">
          <textarea value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={handleKeyDown} rows={2} placeholder="Ask Codexa AI..." className="block w-full resize-none bg-transparent px-1 text-sm leading-5 text-white outline-none placeholder:text-zinc-500" />
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="hidden text-[10px] text-zinc-500 sm:block"><kbd className="rounded bg-white/5 px-1 py-0.5">Enter</kbd> send · <kbd className="rounded bg-white/5 px-1 py-0.5">Shift + Enter</kbd> newline</span>
            <button type="submit" disabled={isLoading || !draft.trim()} className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40" aria-label="Send message">
              {isLoading ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Send size={15} />}
            </button>
          </div>
        </div>
      </form>
    </aside>
  );
}
