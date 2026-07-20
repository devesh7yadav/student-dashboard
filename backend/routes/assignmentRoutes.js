import express from "express"
import { getAllAssignments, createAssignment, deleteAssignment, editAssignment, completeAssignment } from "../controllers/assignmentController.js";

const router = express.Router();

router.get("/:id", getAllAssignments);
router.post("/:id", createAssignment);
router.delete("/:id", deleteAssignment);
router.put("/:id", editAssignment);
router.patch("/:id/complete", completeAssignment);

export default router;