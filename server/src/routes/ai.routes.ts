import { Router } from "express";

import { chat, conversation } from "../controllers/ai.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/chat", protect, chat);
router.get("/:projectId/conversation", protect, conversation);

export default router;
