import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import * as git from "../services/git.service";

function validBranch(value: unknown): value is string { return typeof value === "string" && /^[A-Za-z0-9._/-]+$/.test(value) && !value.includes(".."); }

export async function summary(req: AuthRequest, res: Response) {
  try { return res.json(await git.getGitSummary(req.params.projectId as string, req.user!.id)); }
  catch (error) { return res.status(400).json({ message: error instanceof Error ? error.message : "Unable to read Git status" }); }
}
export async function initialize(req: AuthRequest, res: Response) {
  try { await git.initializeRepository(req.params.projectId as string, req.user!.id); return res.status(201).json({ success: true }); }
  catch (error) { return res.status(400).json({ message: error instanceof Error ? error.message : "Unable to initialize Git" }); }
}
export async function action(req: AuthRequest, res: Response) {
  const { action: actionName, branch, message } = req.body as { action?: unknown; branch?: unknown; message?: unknown };
  const projectId = req.params.projectId as string;
  try {
    if (actionName === "commit" && typeof message === "string" && message.trim()) await git.commitChanges(projectId, req.user!.id, message.trim());
    else if (actionName === "createBranch" && validBranch(branch)) await git.createBranch(projectId, req.user!.id, branch);
    else if (actionName === "switchBranch" && validBranch(branch)) await git.switchBranch(projectId, req.user!.id, branch);
    else if (actionName === "merge" && validBranch(branch)) await git.mergeBranch(projectId, req.user!.id, branch);
    else if (actionName === "pull" || actionName === "push") await git.syncRemote(projectId, req.user!.id, actionName);
    else return res.status(400).json({ message: "Invalid Git action" });
    return res.json({ success: true });
  } catch (error) { return res.status(400).json({ message: error instanceof Error ? error.message : "Git action failed" }); }
}

export async function fileHistory(req: AuthRequest, res: Response) {
  const filePath = req.query.path;
  if (typeof filePath !== "string") return res.status(400).json({ message: "Path is required" });
  try { return res.json({ history: await git.getFileHistory(req.params.projectId as string, req.user!.id, filePath) }); }
  catch (error) { return res.status(400).json({ message: error instanceof Error ? error.message : "Unable to load file history" }); }
}

export async function fileDiff(req: AuthRequest, res: Response) {
  const filePath = req.query.path;
  if (typeof filePath !== "string") return res.status(400).json({ message: "Path is required" });
  try { return res.json({ diff: await git.getFileDiff(req.params.projectId as string, req.user!.id, filePath) }); }
  catch (error) { return res.status(400).json({ message: error instanceof Error ? error.message : "Unable to load file diff" }); }
}
