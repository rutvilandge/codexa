import { Router } from "express";
import { invite, listMembers, removeMember, updateMember } from "../controllers/collaboration.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();
router.get("/:projectId/members", protect, listMembers);
router.post("/:projectId/members", protect, invite);
router.patch("/:projectId/members/:memberId", protect, updateMember);
router.delete("/:projectId/members/:memberId", protect, removeMember);
export default router;
