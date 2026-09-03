import type { Response } from "express";
import * as workspaceService from "../services/workspace.service";
import type { AuthRequest } from "../middleware/auth.middleware";

export async function getWorkspaceTree(
  req: AuthRequest,
  res: Response
) {
  try {
    const projectId = req.params.projectId as string;
    const tree = await workspaceService.getWorkspaceTree(projectId, req.user!.id);

    res.json(tree);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load workspace",
    });
  }
}

export async function getFile(
  req: AuthRequest,
  res: Response
) {
  try {
    const filePath = req.query.path as string;

    if (!filePath) {
      return res.status(400).json({
        message: "Path is required",
      });
    }

    const projectId = req.params.projectId as string;
    const content = await workspaceService.getFile(projectId, req.user!.id, filePath);

    res.json({
      content,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to open file",
    });
  }
}

export async function saveFile(
  req: AuthRequest,
  res: Response
) {
  try {
    const { path, content } = req.body as { path?: unknown; content?: unknown };

    if (typeof path !== "string" || typeof content !== "string") {
      return res.status(400).json({ message: "Path and content are required" });
    }

    await workspaceService.saveFile(req.params.projectId as string, req.user!.id, path, content);

    res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to save file",
    });
  }
}

export async function createFolder(req: AuthRequest, res: Response) {
  const { path } = req.body as { path?: unknown };
  if (typeof path !== "string" || !path.trim()) return res.status(400).json({ message: "Folder path is required" });

  try {
    await workspaceService.createFolder(req.params.projectId as string, req.user!.id, path);
    return res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create folder" });
  }
}

export async function deleteWorkspacePath(req: AuthRequest, res: Response) {
  const { path } = req.body as { path?: unknown };
  if (typeof path !== "string" || !path.trim()) return res.status(400).json({ message: "Path is required" });

  try {
    await workspaceService.deleteWorkspacePath(req.params.projectId as string, req.user!.id, path);
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error instanceof Error ? error.message : "Failed to delete path" });
  }
}

export async function searchWorkspace(req: AuthRequest, res: Response) {
  const query = req.query.q;
  if (typeof query !== "string" || query.trim().length < 2 || query.length > 200) return res.status(400).json({ message: "Use a search query between 2 and 200 characters" });
  try { return res.json({ matches: await workspaceService.searchWorkspace(req.params.projectId as string, req.user!.id, query.trim()) }); }
  catch (error) { return res.status(400).json({ message: error instanceof Error ? error.message : "Search failed" }); }
}
