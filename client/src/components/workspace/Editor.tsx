import EditorTabs from "./EditorTabs";
import MonacoEditor from "./MonacoEditor";
import EmptyEditor from "./EmptyEditor";
import Breadcrumb from "./Breadcrumb";
import { useWorkspaceStore } from "@/store/workspaceStore";

export default function Editor() {
  const active = useWorkspaceStore((s) => s.activeFile);

  return (
    <div className="flex h-full flex-col bg-[#0E0E11]">
      <EditorTabs />

      <Breadcrumb />

      <div className="flex-1 overflow-hidden">
        {active ? <MonacoEditor /> : <EmptyEditor />}
      </div>
    </div>
  );
}