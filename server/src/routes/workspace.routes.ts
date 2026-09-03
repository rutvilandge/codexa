import { Router } from "express";

import {
  getWorkspaceTree,
  getFile,
  saveFile,
  createFolder,
  deleteWorkspacePath,
  searchWorkspace,
} from "../controllers/workspace.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.get("/:projectId/tree", protect, getWorkspaceTree);

router.get("/:projectId/file", protect, getFile);

router.post("/:projectId/file", protect, saveFile);
router.post("/:projectId/folder", protect, createFolder);
router.delete("/:projectId/path", protect, deleteWorkspacePath);
router.get("/:projectId/search", protect, searchWorkspace);

export default router;
