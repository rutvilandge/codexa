import { Router } from "express";
import { action, fileDiff, fileHistory, initialize, summary } from "../controllers/git.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();
router.get("/:projectId", protect, summary);
router.post("/:projectId/init", protect, initialize);
router.post("/:projectId/action", protect, action);
router.get("/:projectId/history", protect, fileHistory);
router.get("/:projectId/diff", protect, fileDiff);
export default router;
