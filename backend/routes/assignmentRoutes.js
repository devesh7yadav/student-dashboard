import express from "express"
import { getAllAssignments, getCourseAssignments, createAssignment, deleteAssignment, editAssignment, completeAssignment } from "../controllers/assignmentController.js";

const router = express.Router();

router.get("/", getAllAssignments);
router.get("/:id", getCourseAssignments);
router.post("/:id", createAssignment);
router.delete("/:id", deleteAssignment);
router.put("/:id", editAssignment);
router.patch("/:id/complete", completeAssignment);

export default router;