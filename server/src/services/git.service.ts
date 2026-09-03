import { execFile } from "child_process";
import { promisify } from "util";

import { getAccessibleWorkspace } from "./project-access.service";

const executeFile = promisify(execFile);

async function getWorkspace(projectId: string, ownerId: string) {
  return getAccessibleWorkspace(projectId, ownerId);
}

async function git(projectId: string, ownerId: string, args: string[]) {
  const workspacePath = await getAccessibleWorkspace(projectId, ownerId, true);
  return executeFile("git", args, { cwd: workspacePath, maxBuffer: 1024 * 1024 });
}

export async function getGitSummary(projectId: string, ownerId: string) {
  const workspacePath = await getWorkspace(projectId, ownerId);
  const [status, branch, history, branches] = await Promise.all([
    executeFile("git", ["status", "--short"], { cwd: workspacePath }).catch(() => ({ stdout: "" })),
    executeFile("git", ["branch", "--show-current"], { cwd: workspacePath }).catch(() => ({ stdout: "" })),
    executeFile("git", ["log", "--oneline", "-10"], { cwd: workspacePath }).catch(() => ({ stdout: "" })),
    executeFile("git", ["branch", "--format=%(refname:short)"], { cwd: workspacePath }).catch(() => ({ stdout: "" })),
  ]);
  return {
    initialized: Boolean(branch.stdout.trim() || history.stdout.trim() || branches.stdout.trim()),
    branch: branch.stdout.trim() || null,
    status: status.stdout.split("\n").filter(Boolean),
    history: history.stdout.split("\n").filter(Boolean),
    branches: branches.stdout.split("\n").filter(Boolean),
  };
}

export async function initializeRepository(projectId: string, ownerId: string) { await git(projectId, ownerId, ["init"]); }
export async function createBranch(projectId: string, ownerId: string, name: string) { await git(projectId, ownerId, ["switch", "-c", name]); }
export async function switchBranch(projectId: string, ownerId: string, name: string) { await git(projectId, ownerId, ["switch", name]); }
export async function commitChanges(projectId: string, ownerId: string, message: string) {
  await git(projectId, ownerId, ["add", "-A"]);
  await git(projectId, ownerId, ["commit", "-m", message]);
}
export async function mergeBranch(projectId: string, ownerId: string, name: string) { await git(projectId, ownerId, ["merge", name]); }
export async function syncRemote(projectId: string, ownerId: string, action: "pull" | "push") { await git(projectId, ownerId, [action]); }

function safeFilePath(filePath: string) {
  if (!filePath || filePath.startsWith("/") || filePath.includes("\\") || filePath.split("/").includes("..")) throw new Error("A project-relative file path is required");
  return filePath;
}

export async function getFileHistory(projectId: string, ownerId: string, filePath: string) {
  const result = await git(projectId, ownerId, ["log", "--format=%H%x09%h%x09%an%x09%ad%x09%s", "--date=short", "--", safeFilePath(filePath)]);
  return result.stdout.split("\n").filter(Boolean).map((line) => {
    const [hash, shortHash, author, date, subject] = line.split("\t");
    return { hash, shortHash, author, date, subject };
  });
}

export async function getFileDiff(projectId: string, ownerId: string, filePath: string) {
  const result = await git(projectId, ownerId, ["diff", "--", safeFilePath(filePath)]);
  return result.stdout;
}
