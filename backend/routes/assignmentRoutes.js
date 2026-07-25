import express from "express"
import { getAllAssignments, getCourseAssignments, createAssignment, deleteAssignment, editAssignment, completeAssignment } from "../controllers/assignmentController.js";
import { authenticateToken } from "../middleware/authorization.js";

const router = express.Router();

router.get("/", authenticateToken, getAllAssignments);
router.get("/:id", authenticateToken, getCourseAssignments);
router.post("/:id", authenticateToken, createAssignment);
router.delete("/:id", authenticateToken, deleteAssignment);
router.put("/:id", authenticateToken, editAssignment);
router.patch("/:id/complete", authenticateToken, completeAssignment);

export default router;