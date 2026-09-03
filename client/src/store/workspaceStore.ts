import { create } from "zustand";
import { saveWorkspaceFile } from "@/services/workspaceApi";
import { broadcastFileChange } from "@/services/collaborationApi";

export interface OpenFile {
  id: string;
  path: string;
  name: string;
  language: string;
  content: string;
  dirty: boolean;
}

interface WorkspaceStore {
  files: OpenFile[];
  activeFile: OpenFile | null;
  projectId: string | null;
  selectedCode: string;
  setProjectId: (projectId: string) => void;

  openFile: (file: OpenFile) => void;
  setActiveFile: (id: string) => void;
  closeFile: (id: string) => void;

  updateContent: (content: string) => void;
  setSelectedCode: (content: string) => void;
  replaceFileContent: (path: string, content: string, dirty?: boolean) => void;
  markSaved: () => void;

  saveActiveFile: () => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  files: [],
  activeFile: null,
  projectId: null,
  selectedCode: "",
  setProjectId: (projectId) => set({ projectId, files: [], activeFile: null, selectedCode: "" }),

  openFile: (file) =>
    set((state) => {
      const existing = state.files.find((f) => f.id === file.id);

      if (existing) {
        return {
          activeFile: existing,
        };
      }

      return {
        files: [...state.files, file],
        activeFile: file,
      };
    }),

  setActiveFile: (id) =>
    set((state) => ({
      activeFile: state.files.find((f) => f.id === id) ?? null,
    })),

  closeFile: (id) =>
    set((state) => {
      const files = state.files.filter((f) => f.id !== id);

      return {
        files,
        activeFile:
          state.activeFile?.id === id
            ? files[files.length - 1] ?? null
            : state.activeFile,
      };
    }),

  updateContent: (content) =>
    set((state) => {
      if (!state.activeFile) return state;

      const updated = {
        ...state.activeFile,
        content,
        dirty: true,
      };

      return {
        activeFile: updated,
        files: state.files.map((f) =>
          f.id === updated.id ? updated : f
        ),
      };
    }),

  setSelectedCode: (content) => set({ selectedCode: content }),

  replaceFileContent: (path, content, dirty = true) =>
    set((state) => {
      const existing = state.files.find((file) => file.path === path);
      if (!existing) return state;
      const updated = { ...existing, content, dirty };
      return {
        files: state.files.map((file) => file.path === path ? updated : file),
        activeFile: state.activeFile?.path === path ? updated : state.activeFile,
      };
    }),

  markSaved: () =>
    set((state) => {
      if (!state.activeFile) return state;

      const updated = {
        ...state.activeFile,
        dirty: false,
      };

      return {
        activeFile: updated,
        files: state.files.map((f) =>
          f.id === updated.id ? updated : f
        ),
      };
    }),

  saveActiveFile: async () => {
    const file = get().activeFile;
    const projectId = get().projectId;

    if (!file || !projectId) {
      console.log("❌ No active file");
      return;
    }

    try {
      console.log("📁 Saving file:", file.path);

      await saveWorkspaceFile(projectId, file.path, file.content);
      broadcastFileChange(projectId, file.path, file.content);

      console.log("✅ Saved successfully!");

      get().markSaved();
    } catch (err) {
      console.error("❌ Save failed:", err);
    }
  },
}));
