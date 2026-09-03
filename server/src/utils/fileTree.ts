import fs from "fs/promises";
import path from "path";
import { WorkspaceNode } from "../types/workspace.types";

const IGNORE = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  ".next",
]);

export async function buildFileTree(
  dir: string,
  workspaceRoot = dir
): Promise<WorkspaceNode[]> {
  const entries = await fs.readdir(dir, {
    withFileTypes: true,
  });

  const result: WorkspaceNode[] = [];

  for (const entry of entries) {
    if (IGNORE.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      result.push({
        name: entry.name,
        path: path.relative(workspaceRoot, fullPath),
        type: "folder",
        children: await buildFileTree(fullPath, workspaceRoot),
      });
    } else {
      result.push({
        name: entry.name,
        path: path.relative(workspaceRoot, fullPath),
        type: "file",
      });
    }
  }

  return result.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === "folder" ? -1 : 1;
  });
}
