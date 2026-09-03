import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useWorkspaceStore } from "@/store/workspaceStore";

export default function EditorTabs() {
  const files = useWorkspaceStore((s) => s.files);
  const active = useWorkspaceStore((s) => s.activeFile);
  const setActive = useWorkspaceStore((s) => s.setActiveFile);
  const close = useWorkspaceStore((s) => s.closeFile);

  return (
    <div className="flex h-11 overflow-x-auto border-b border-white/10 bg-[#111116]">
      <AnimatePresence>
        {files.map((file) => (
          <motion.button
            key={file.id}
            layout
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActive(file.id)}
            className={`group flex items-center gap-2 border-r border-white/10 px-4 text-sm transition-all

            ${
              active?.id === file.id
                ? "bg-gradient-to-r from-violet-500/20 to-fuchsia-500/10 text-white"
                : "text-zinc-400 hover:bg-white/5"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-violet-400" />

            <div className="flex items-center gap-2">
  <span>{file.name}</span>

  {file.dirty && (
    <span className="text-yellow-400 text-xs">●</span>
  )}
</div>

            <X
              size={14}
              onClick={(e) => {
                e.stopPropagation();
                close(file.id);
              }}
              className="opacity-0 transition group-hover:opacity-100"
            />
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}