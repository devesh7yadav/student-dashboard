import express from "express";
import { getCourseAssignments, getAverage } from "../controllers/gradebookController.js"; 
import { authenticateToken } from "../middleware/authorization.js";

const router = express.Router();

//Id = course id
router.get("/:id", authenticateToken, getCourseAssignments);
router.get("/:id/average", authenticateToken, getAverage);

export default router;