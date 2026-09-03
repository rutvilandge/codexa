import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import folderRoutes from "./routes/folder.routes";
import fileRoutes from "./routes/file.routes";

const app = express();

// ======================
// Middlewares
// ======================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ======================
// Routes
// ======================

app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/folders", folderRoutes);

app.use("/api/files", fileRoutes);

// ======================
// Health Check
// ======================

app.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Codexa Backend Running Successfully",
  });
});

// ======================
// 404 Route
// ======================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

export default app;