import { useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { broadcastCursor } from "@/services/collaborationApi";

export default function MonacoEditor() {
  const file = useWorkspaceStore((state) => state.activeFile);

  const updateContent = useWorkspaceStore(
    (state) => state.updateContent
  );

  const saveActiveFile = useWorkspaceStore(
    (state) => state.saveActiveFile
  );
  const setSelectedCode = useWorkspaceStore((state) => state.setSelectedCode);
  const projectId = useWorkspaceStore((state) => state.projectId);

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();

        await saveActiveFile();

        console.log("✅ File Saved");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [saveActiveFile]);

  return (
    <Editor
      height="100%"
      theme="vs-dark"
      language={file?.language ?? "typescript"}
      value={file?.content ?? ""}
      onChange={(value) => updateContent(value ?? "")}
      onMount={(editor) => {
        const updateSelection = () => {
          setSelectedCode(editor.getModel()?.getValueInRange(editor.getSelection()!) ?? "");
          if (projectId && file) broadcastCursor(projectId, file.path, editor.getSelection());
        };
        editor.onDidChangeCursorSelection(updateSelection);
        updateSelection();
      }}
      options={{
        fontSize: 14,
        fontFamily: "Geist Mono, Consolas, monospace",

        minimap: {
          enabled: false,
        },

        automaticLayout: true,

        smoothScrolling: true,

        cursorBlinking: "smooth",

        cursorSmoothCaretAnimation: "on",

        renderLineHighlight: "all",

        roundedSelection: true,

        scrollBeyondLastLine: false,

        wordWrap: "on",

        padding: {
          top: 20,
        },

        scrollbar: {
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
        },

        lineNumbers: "on",

        folding: true,

        bracketPairColorization: {
          enabled: true,
        },

        guides: {
          bracketPairs: true,
          indentation: true,
        },
      }}
    />
  );
}
