import express from "express";
import { getAllCourses, createCourse, deleteCourse, editCourse } from "../controllers/courseController.js"
import { authenticateToken } from "../middleware/authorization.js";

const router = express.Router();

router.get("/", authenticateToken, getAllCourses);
router.post("/", authenticateToken, createCourse);
router.delete("/:id", authenticateToken, deleteCourse);
router.put("/:id", authenticateToken, editCourse);

export default router;