import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import {
  getProjectAiResponse,
  getProjectConversation,
  type AiTool,
} from "../services/ai.service";

const MAX_MESSAGE_LENGTH = 20_000;

const VALID_TOOLS: AiTool[] = [
  "chat",
  "explain",
  "generate",
  "refactor",
  "fix",
  "optimize",
  "document",
  "test",
  "rename",
];

type FileContext = {
  path: string;
  content: string;
};

function isFileContext(value: unknown): value is FileContext {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const file = value as {
    path?: unknown;
    content?: unknown;
  };

  return (
    typeof file.path === "string" &&
    typeof file.content === "string"
  );
}

export async function chat(
  req: AuthRequest,
  res: Response
) {
  const {
    message,
    projectId,
    tool,
    currentFile,
    openFiles,
    selectedCode,
  } = req.body as {
    message?: unknown;
    projectId?: unknown;
    tool?: unknown;
    currentFile?: unknown;
    openFiles?: unknown;
    selectedCode?: unknown;
  };

  if (
    typeof message !== "string" ||
    !message.trim() ||
    typeof projectId !== "string" ||
    !projectId.trim()
  ) {
    return res.status(400).json({
      message:
        "A non-empty message and valid project ID are required",
    });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({
      message: `Message must be at most ${MAX_MESSAGE_LENGTH} characters`,
    });
  }

  const selectedTool: AiTool =
    typeof tool === "string" &&
    VALID_TOOLS.includes(tool as AiTool)
      ? (tool as AiTool)
      : "chat";

  const validCurrentFile = isFileContext(currentFile)
    ? currentFile
    : undefined;

  const validOpenFiles = Array.isArray(openFiles)
    ? openFiles
        .filter(isFileContext)
        .slice(0, 6)
    : undefined;

  const validSelectedCode =
    typeof selectedCode === "string"
      ? selectedCode.slice(0, 12_000)
      : undefined;

  try {
    const response = await getProjectAiResponse({
      projectId: projectId.trim(),
      ownerId: req.user!.id,
      message: message.trim(),
      tool: selectedTool,
      currentFile: validCurrentFile,
      openFiles: validOpenFiles,
      selectedCode: validSelectedCode,
    });

    return res.json({
      response,
    });
  } catch (error) {
    console.error("AI chat request failed:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown AI service error";

    console.error("AI error details:", {
      message: errorMessage,
      projectId,
      tool: selectedTool,
      hasGroqKey: Boolean(process.env.GROQ_API_KEY),
    });

    return res.status(502).json({
      message: "Unable to get a response from the AI service",
      ...(process.env.NODE_ENV !== "production"
        ? { error: errorMessage }
        : {}),
    });
  }
}

export async function conversation(
  req: AuthRequest,
  res: Response
) {
  const projectId = req.params.projectId as string;

  if (!projectId) {
    return res.status(400).json({
      message: "Project ID is required",
    });
  }

  try {
    const messages = await getProjectConversation(
      projectId,
      req.user!.id
    );

    return res.json({
      messages,
    });
  } catch (error) {
    console.error(
      "AI conversation request failed:",
      error
    );

    return res.status(404).json({
      message:
        error instanceof Error
          ? error.message
          : "Conversation not found",
    });
  }
}