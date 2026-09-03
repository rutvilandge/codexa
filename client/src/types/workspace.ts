export interface WorkspaceNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: WorkspaceNode[];
}