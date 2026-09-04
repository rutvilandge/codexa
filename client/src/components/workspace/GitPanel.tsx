import { useEffect, useState } from "react";
import { GitBranch, RefreshCw } from "lucide-react";

import {
  getGitSummary,
  gitAction,
  initializeGit,
  type GitSummary,
} from "@/services/gitApi";

export default function GitPanel({ projectId }: { projectId: string }) {
  const [summary, setSummary] = useState<GitSummary | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    try {
      setError("");
      setSummary(await getGitSummary(projectId));
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Git is unavailable for this project."
      );
    }
  };

  useEffect(() => {
    void refresh();
  }, [projectId]);

  const run = async (operation: () => Promise<void>) => {
    setBusy(true);

    try {
      setError("");
      await operation();
      await refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Git action failed."
      );
    } finally {
      setBusy(false);
    }
  };

  const commit = () => {
    const message = window.prompt("Commit message");

    if (message?.trim()) {
      void run(() =>
        gitAction(projectId, "commit", {
          message: message.trim(),
        })
      );
    }
  };

  const newBranch = () => {
    const branch = window.prompt("New branch name");

    if (branch?.trim()) {
      void run(() =>
        gitAction(projectId, "createBranch", {
          branch: branch.trim(),
        })
      );
    }
  };

  const switchBranch = () => {
    const branch = window.prompt(
      `Branch to switch to:\n\n${
        summary?.branches.join("\n") || "No branches"
      }`
    );

    if (branch?.trim()) {
      void run(() =>
        gitAction(projectId, "switchBranch", {
          branch: branch.trim(),
        })
      );
    }
  };

  return (
    <section className="border-t border-white/10 p-3">
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-zinc-300">
        <span className="flex items-center gap-1.5">
          <GitBranch
            size={14}
            className="text-violet-400"
          />

          {summary?.branch ?? "Git"}
        </span>

        <button
          type="button"
          onClick={() => void refresh()}
          disabled={busy}
          className="text-zinc-500 hover:text-white disabled:opacity-50"
          title="Refresh Git status"
        >
          <RefreshCw size={13} />
        </button>
      </div>

      {!summary?.initialized ? (
        <button
          type="button"
          disabled={busy}
          onClick={() =>
            void run(() => initializeGit(projectId))
          }
          className="w-full rounded bg-white/5 px-2 py-1.5 text-xs text-zinc-300 hover:bg-white/10 disabled:opacity-50"
        >
          Initialize repository
        </button>
      ) : (
        <div className="space-y-2">
          <p className="truncate text-[11px] text-zinc-500">
            {summary.status.length
              ? `${summary.status.length} changed file${
                  summary.status.length === 1 ? "" : "s"
                }`
              : "Working tree clean"}
          </p>

          <div className="flex flex-wrap gap-1">
            <button
              type="button"
              disabled={busy || !summary.status.length}
              onClick={commit}
              className="rounded bg-violet-600/80 px-2 py-1 text-[11px] text-white hover:bg-violet-500 disabled:opacity-50"
            >
              Commit
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={newBranch}
              className="rounded bg-white/5 px-2 py-1 text-[11px] text-zinc-300 hover:bg-white/10 disabled:opacity-50"
            >
              Branch
            </button>

            <button
              type="button"
              disabled={busy || summary.branches.length < 2}
              onClick={switchBranch}
              className="rounded bg-white/5 px-2 py-1 text-[11px] text-zinc-300 hover:bg-white/10 disabled:opacity-50"
            >
              Switch
            </button>

            <button
              type="button"
              disabled
              title="Connect a remote repository first"
              className="cursor-not-allowed rounded bg-white/5 px-2 py-1 text-[11px] text-zinc-500 opacity-60"
            >
              Pull
            </button>

            <button
              type="button"
              disabled
              title="Connect a remote repository first"
              className="cursor-not-allowed rounded bg-white/5 px-2 py-1 text-[11px] text-zinc-500 opacity-60"
            >
              Push
            </button>
          </div>

          {summary.branches.length > 0 && (
            <div className="text-[10px] text-zinc-600">
              {summary.branches.join(" • ")}
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-[11px] text-red-300">
          {error}
        </p>
      )}
    </section>
  );
}