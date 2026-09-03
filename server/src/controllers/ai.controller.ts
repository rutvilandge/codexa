import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import { getProjectAiResponse, getProjectConversation, type AiTool } from "../services/ai.service";

const MAX_MESSAGE_LENGTH = 20_000;

export async function chat(req: AuthRequest, res: Response) {
  const { message, projectId, tool, currentFile, openFiles, selectedCode } = req.body as { message?: unknown; projectId?: unknown; tool?: unknown; currentFile?: unknown; openFiles?: unknown; selectedCode?: unknown };

  if (typeof message !== "string" || !message.trim() || typeof projectId !== "string") {
    return res.status(400).json({ message: "A non-empty message is required" });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({
      message: `Message must be at most ${MAX_MESSAGE_LENGTH} characters`,
    });
  }

  try {
    const response = await getProjectAiResponse({
      projectId, ownerId: req.user!.id, message: message.trim(),
      tool: ["chat", "explain", "generate", "refactor", "fix", "optimize", "document", "test", "rename"].includes(String(tool)) ? tool as AiTool : "chat",
      currentFile: typeof currentFile === "object" && currentFile !== null ? currentFile as { path: string; content: string } : undefined,
      openFiles: Array.isArray(openFiles) ? openFiles.filter((file): file is { path: string; content: string } => typeof file === "object" && file !== null && typeof (file as { path?: unknown }).path === "string" && typeof (file as { content?: unknown }).content === "string") : undefined,
      selectedCode: typeof selectedCode === "string" ? selectedCode : undefined,
    });

    return res.json({ response });
  } catch (error) {
    console.error("AI chat request failed", error);

    return res.status(502).json({
      message: "Unable to get a response from the AI service",
    });
  }
}

export async function conversation(req: AuthRequest, res: Response) {
  try {
    const messages = await getProjectConversation(req.params.projectId as string, req.user!.id);
    return res.json({ messages });
  } catch (error) {
    return res.status(404).json({ message: error instanceof Error ? error.message : "Conversation not found" });
  }
}
