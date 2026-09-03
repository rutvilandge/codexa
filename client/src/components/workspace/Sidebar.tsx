import { useEffect, useState } from "react";
import { FilePlus2, FolderPlus } from "lucide-react";
import FileTree from "./FileTree";
import GitPanel from "./GitPanel";
import CollaborationPanel from "./CollaborationPanel";

import type { WorkspaceNode } from "@/types/workspace";
import { createWorkspaceFolder, deleteWorkspacePath, getWorkspaceTree, saveWorkspaceFile } from "@/services/workspaceApi";

export default function Sidebar({ projectId }: { projectId: string }) {
  const [tree, setTree] =useState<WorkspaceNode[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadWorkspace() {
    try {
      const data = await getWorkspaceTree(projectId);
      setTree(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("Workspace Error:", err);
    } finally { setLoading(false); }
  }

  useEffect(() => {
    void loadWorkspace();
  }, [projectId]);

  async function createFile() {
    const path = window.prompt("New file path (relative to the project)");
    if (!path?.trim()) return;
    try { await saveWorkspaceFile(projectId, path.trim(), ""); await loadWorkspace(); } catch { window.alert("Unable to create that file."); }
  }

  async function createFolder() {
    const path = window.prompt("New folder path (relative to the project)");
    if (!path?.trim()) return;
    try { await createWorkspaceFolder(projectId, path.trim()); await loadWorkspace(); } catch { window.alert("Unable to create that folder."); }
  }

  async function removePath(path: string) {
    if (!window.confirm(`Delete ${path}? This cannot be undone.`)) return;
    try { await deleteWorkspacePath(projectId, path); await loadWorkspace(); } catch { window.alert("Unable to delete that path."); }
  }

  return (
    <aside className="flex h-full flex-col overflow-hidden border-r border-white/10 bg-[#0D0D12]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">
          Explorer
        </h2>
        <div className="flex gap-1"><button type="button" onClick={() => void createFile()} className="rounded p-1 text-zinc-400 hover:bg-white/10 hover:text-white" title="New file"><FilePlus2 size={15} /></button><button type="button" onClick={() => void createFolder()} className="rounded p-1 text-zinc-400 hover:bg-white/10 hover:text-white" title="New folder"><FolderPlus size={15} /></button></div>
      </div>

      <div className="flex-1 overflow-auto p-3">
        {loading ? (
          <div className="text-zinc-500">Loading...</div>
        ) : (
          tree.map((node) => (
            <FileTree key={node.path} node={node} projectId={projectId} onDelete={(path) => void removePath(path)} />
          ))
        )}
      </div>
      <GitPanel projectId={projectId} />
      <CollaborationPanel projectId={projectId} />
    </aside>
  );
}
