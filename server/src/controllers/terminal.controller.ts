import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import { runProjectCommand } from "../services/terminal.service";

export async function executeCommand(req: AuthRequest, res: Response) {
  const { command } = req.body as { command?: unknown };
  if (typeof command !== "string" || !command.trim()) return res.status(400).json({ message: "Command is required" });
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
  const send = (event: string, data: unknown) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  try {
    const exitCode = await runProjectCommand(req.params.projectId as string, req.user!.id, command, (output) => send("output", output));
    send("complete", { exitCode });
  } catch (error) {
    send("error", error instanceof Error ? error.message : "Unable to execute command");
  } finally { res.end(); }
}
