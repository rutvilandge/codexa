import express from "express";
import {
  createFolder,
  getFolders,
  updateFolder,
  deleteFolder,
} from "../controllers/folder.controller";

import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", protect, createFolder);

router.get("/:projectId", protect, getFolders);

router.patch("/:id", protect, updateFolder);

router.delete("/:id", protect, deleteFolder);

export default router;