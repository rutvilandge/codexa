import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";

import AmbientBackground from "./AmbientBackground";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import Editor from "./Editor";
import RightPanel from "./RightPanel";
import Terminal from "./Terminal";
import StatusBar from "./StatusBar";

export default function Workspace() {
  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-[#0B0B0C] text-white">
      {/* Animated Ambient Background */}
      <AmbientBackground />

      {/* Keep workspace above background */}
      <div className="relative z-10 flex h-full flex-col">
        <Topbar />

        <PanelGroup direction="vertical">
          <Panel defaultSize={82}>
            <PanelGroup direction="horizontal">
              {/* Sidebar */}
              <Panel defaultSize={20} minSize={15}>
                <Sidebar />
              </Panel>

              <PanelResizeHandle className="w-[2px] bg-zinc-800 transition-all duration-300 hover:bg-violet-500" />

              {/* Editor */}
              <Panel defaultSize={60}>
                <Editor />
              </Panel>

              <PanelResizeHandle className="w-[2px] bg-zinc-800 transition-all duration-300 hover:bg-violet-500" />

              {/* AI Panel */}
              <Panel defaultSize={20} minSize={15}>
                <RightPanel />
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="h-[2px] bg-zinc-800 transition-all duration-300 hover:bg-violet-500" />

          {/* Terminal */}
          <Panel defaultSize={18} minSize={10}>
            <Terminal />
          </Panel>
        </PanelGroup>

        <StatusBar />
      </div>
    </div>
  );
}