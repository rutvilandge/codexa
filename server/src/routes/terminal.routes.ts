import { Router } from "express";
import { executeCommand } from "../controllers/terminal.controller";
import { protect } from "../middleware/auth.middleware";
const router = Router();
router.post("/:projectId/execute", protect, executeCommand);
export default router;
