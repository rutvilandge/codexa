import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWorkspaceStore } from "@/store/workspaceStore";

import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import Editor from "./Editor";
import RightPanel from "./RightPanel";
import Terminal from "./Terminal";
import StatusBar from "./StatusBar";
import { getGitSummary } from "@/services/gitApi";
import { joinProjectRoom } from "@/services/collaborationApi";

export default function Workspace() {
  const { projectId } = useParams();
  const setProjectId = useWorkspaceStore((state) => state.setProjectId);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(true);
  const [branch, setBranch] = useState<string | null>(null);
  const [collaborators, setCollaborators] = useState(0);
  const replaceFileContent = useWorkspaceStore((state) => state.replaceFileContent);
  useEffect(() => { if (projectId) setProjectId(projectId); }, [projectId, setProjectId]);
  useEffect(() => {
    if (!projectId) return;
    void getGitSummary(projectId).then((summary) => setBranch(summary.branch)).catch(() => setBranch(null));
  }, [projectId]);
  useEffect(() => {
    if (!projectId) return;
    return joinProjectRoom(projectId, {
      onFileChange: ({ path, content }) => replaceFileContent(path, content, false),
      onPresence: (users) => setCollaborators(users.length),
    });
  }, [projectId, replaceFileContent]);
  if (!projectId) return null;

  return (
    <div className="flex h-screen flex-col bg-[#0B0B0C]">
      <Topbar
        isAiPanelOpen={isAiPanelOpen}
        onToggleAiPanel={() => setIsAiPanelOpen((isOpen) => !isOpen)}
        onRun={() => window.dispatchEvent(new Event("codexa:run"))}
        branch={branch}
        collaborators={collaborators}
      />

      <PanelGroup direction="vertical">
        <Panel defaultSize={82}>
          <PanelGroup direction="horizontal">
            <Panel defaultSize={20} minSize={15}>
              <Sidebar projectId={projectId} />
            </Panel>

            <PanelResizeHandle className="w-[2px] bg-zinc-800 hover:bg-blue-500 transition-colors" />

            <Panel defaultSize={isAiPanelOpen ? 60 : 80}>
              <Editor />
            </Panel>

            {isAiPanelOpen && (
              <>
                <PanelResizeHandle className="w-[2px] bg-zinc-800 transition-colors hover:bg-violet-500" />

                <Panel defaultSize={20} minSize={15}>
                  <RightPanel onClose={() => setIsAiPanelOpen(false)} projectId={projectId} />
                </Panel>
              </>
            )}
          </PanelGroup>
        </Panel>

        <PanelResizeHandle className="h-[2px] bg-zinc-800 hover:bg-blue-500 transition-colors" />

        <Panel defaultSize={18} minSize={10}>
          <Terminal projectId={projectId} />
        </Panel>
      </PanelGroup>

      <StatusBar />
    </div>
  );
}
