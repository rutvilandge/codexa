import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import workspaceRoutes from "./routes/workspace.routes";
import aiRoutes from "./routes/ai.routes";
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import terminalRoutes from "./routes/terminal.routes";
import gitRoutes from "./routes/git.routes";
import collaborationRoutes from "./routes/collaboration.routes";
import { rateLimit } from "./middleware/rate-limit.middleware";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL ?? "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(rateLimit(240));

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Codexa Backend Running 🚀",
  });
});

app.use("/api/workspace", workspaceRoutes);
app.use("/api/ai", rateLimit(30), aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/terminal", terminalRoutes);
app.use("/api/git", gitRoutes);
app.use("/api/projects", collaborationRoutes);

app.use((_req, res) => res.status(404).json({ message: "API route not found" }));

export default app;
