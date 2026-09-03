import express from "express";
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller";

import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", protect, createProject);

router.get("/", protect, getProjects);

router.get("/:id", protect, getProject);

router.patch("/:id", protect, updateProject);

router.delete("/:id", protect, deleteProject);

export default router;