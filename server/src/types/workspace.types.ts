export interface WorkspaceNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: WorkspaceNode[];
}

export interface FileResponse {
  content: string;
}

export interface SaveFileRequest {
  path: string;
  content: string;
}