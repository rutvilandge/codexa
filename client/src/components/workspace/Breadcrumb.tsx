import { ChevronRight } from "lucide-react";
import { useWorkspaceStore } from "@/store/workspaceStore";

export default function Breadcrumb() {
  const file = useWorkspaceStore((s) => s.activeFile);

  return (
    <div className="flex h-9 items-center gap-2 border-b border-white/10 bg-[#111116] px-4 text-xs text-zinc-400">
      <span>src</span>

      <ChevronRight size={14} />

      <span>components</span>

      <ChevronRight size={14} />

      <span className="text-violet-400">
        {file?.name ?? "No File"}
      </span>
    </div>
  );
}