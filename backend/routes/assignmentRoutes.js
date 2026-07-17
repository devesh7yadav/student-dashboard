import express from "express"
import { getAllAssignments, createAssignment, deleteAssignment, editAssignment } from "../controllers/assignmentController.js";

const router = express.Router();

router.get("/:id", getAllAssignments);
router.post("/:id", createAssignment);
router.delete("/:id", deleteAssignment);
router.put("/:id", editAssignment);

export default router;