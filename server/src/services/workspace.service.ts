import fs from "fs/promises";
import path from "path";

import { buildFileTree } from "../utils/fileTree";
import { ensurePathInsideWorkspace } from "./project-workspace.service";
import { getAccessibleWorkspace } from "./project-access.service";

async function getOwnedWorkspace(projectId: string, ownerId: string) {
  return getAccessibleWorkspace(projectId, ownerId);
}

export async function getWorkspaceTree(projectId: string, ownerId: string) {
  return buildFileTree(await getOwnedWorkspace(projectId, ownerId));
}

export async function getFile(projectId: string, ownerId: string, filePath: string) {
  const workspacePath = await getOwnedWorkspace(projectId, ownerId);
  return fs.readFile(ensurePathInsideWorkspace(workspacePath, filePath), "utf8");
}

export async function saveFile(projectId: string, ownerId: string, filePath: string, content: string) {
  const workspacePath = await getAccessibleWorkspace(projectId, ownerId, true);
  const resolvedPath = ensurePathInsideWorkspace(workspacePath, filePath);
  await fs.mkdir(path.dirname(resolvedPath), { recursive: true });
  await fs.writeFile(resolvedPath, content, "utf8");
}

export async function createFolder(projectId: string, ownerId: string, folderPath: string) {
  const workspacePath = await getAccessibleWorkspace(projectId, ownerId, true);
  await fs.mkdir(ensurePathInsideWorkspace(workspacePath, folderPath), { recursive: true });
}

export async function deleteWorkspacePath(projectId: string, ownerId: string, workspacePath: string) {
  const root = await getAccessibleWorkspace(projectId, ownerId, true);
  const target = ensurePathInsideWorkspace(root, workspacePath);
  if (target === path.resolve(root)) throw new Error("The workspace root cannot be deleted");
  await fs.rm(target, { recursive: true, force: false });
}

export async function searchWorkspace(projectId: string, userId: string, query: string) {
  const workspacePath = await getAccessibleWorkspace(projectId, userId);
  const nodes = await getWorkspaceTree(projectId, userId);
  const matches: Array<{ path: string; line: number; preview: string }> = [];
  async function visit(items: Awaited<ReturnType<typeof getWorkspaceTree>>) {
    for (const item of items) {
      if (matches.length >= 100) return;
      if (item.type === "folder" && item.children) await visit(item.children);
      if (item.type === "file") {
        try {
          const content = await fs.readFile(ensurePathInsideWorkspace(workspacePath, item.path), "utf8");
          content.split("\n").forEach((line, index) => {
            if (matches.length < 100 && line.toLowerCase().includes(query.toLowerCase())) matches.push({ path: item.path, line: index + 1, preview: line.trim().slice(0, 200) });
          });
        } catch { /* binary and unreadable files are skipped */ }
      }
    }
  }
  await visit(nodes);
  return matches;
}
