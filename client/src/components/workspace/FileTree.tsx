import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  FileCode2,
  FileJson,
  FileText,
  Trash2,
} from "lucide-react";

import type { WorkspaceNode } from "@/types/workspace";
import { openWorkspaceFile } from "@/services/workspaceApi";
import { useWorkspaceStore } from "@/store/workspaceStore";

interface Props {
  node: WorkspaceNode;
  projectId: string;
  onDelete?: (path: string) => void;
}

export default function FileTree({ node, projectId, onDelete }: Props) {
  const [open, setOpen] = useState(true);

  const openFile = useWorkspaceStore((s) => s.openFile);
  const activeFile = useWorkspaceStore((s) => s.activeFile);

  const handleOpen = async () => {
    if (node.type === "folder") return;

    try {
      const content = await openWorkspaceFile(projectId, node.path);

      openFile({
        id: node.path,
        path: node.path,
        name: node.name,
        language: node.name.split(".").pop() ?? "text",
        content,
        dirty: false,
      });
    } catch (err) {
      console.error("Failed to open file", err);
    }
  };

  if (node.type === "folder") {
    return (
      <div>
        <div
          onClick={() => setOpen(!open)}
          className="group flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-zinc-300 hover:bg-white/5"
        >
          {open ? (
            <ChevronDown size={14} />
          ) : (
            <ChevronRight size={14} />
          )}

          {open ? (
            <FolderOpen
              size={16}
              className="text-violet-400"
            />
          ) : (
            <Folder
              size={16}
              className="text-violet-400"
            />
          )}

          <span>{node.name}</span>
          <button type="button" onClick={(event) => { event.stopPropagation(); onDelete?.(node.path); }} className="ml-auto hidden rounded p-1 text-zinc-500 hover:bg-red-500/15 hover:text-red-300 group-hover:block" aria-label={`Delete ${node.name}`}><Trash2 size={13} /></button>
        </div>

        {open && (
          <div className="ml-5 border-l border-white/5 pl-3">
            {node.children?.map((child) => (
              <FileTree
                key={child.path}
                node={child}
                projectId={projectId}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ x: 3 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleOpen}
      className={`group flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm transition-all ${
        activeFile?.id === node.path
          ? "border border-violet-500/30 bg-gradient-to-r from-violet-500/25 to-fuchsia-500/10 text-white shadow-[0_0_20px_rgba(139,92,246,.15)]"
          : "text-zinc-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      {node.name.endsWith(".json") ? (
        <FileJson
          size={16}
          className="text-yellow-400"
        />
      ) : node.name.endsWith(".css") ? (
        <FileText
          size={16}
          className="text-sky-400"
        />
      ) : (
        <FileCode2
          size={16}
          className="text-blue-400"
        />
      )}

      <span>{node.name}</span>
      <span role="button" tabIndex={0} onClick={(event) => { event.stopPropagation(); onDelete?.(node.path); }} onKeyDown={(event) => { if (event.key === "Enter") onDelete?.(node.path); }} className="ml-auto hidden rounded p-1 text-zinc-500 hover:bg-red-500/15 hover:text-red-300 group-hover:block" aria-label={`Delete ${node.name}`}><Trash2 size={13} /></span>
    </motion.button>
  );
}
