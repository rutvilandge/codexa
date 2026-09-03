import express from "express";
import {
  createFile,
  getFile,
  updateFile,
  deleteFile,
} from "../controllers/file.controller";

import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", protect, createFile);

router.get("/:id", protect, getFile);

router.patch("/:id", protect, updateFile);

router.delete("/:id", protect, deleteFile);

export default router;