import express from "express";
import { getAllCourses, createCourse, deleteCourse, editCourse } from "../controllers/courseController.js"
import { getCourseAssignments, getAverage, createItem, updateGrades, getCourseInfo } from "../controllers/gradebookController.js"; 
import { authenticateToken } from "../middleware/authorization.js";

const router = express.Router();

router.get("/", authenticateToken, getAllCourses);
router.post("/", authenticateToken, createCourse);
router.delete("/:id", authenticateToken, deleteCourse);
router.put("/:id", authenticateToken, editCourse);

//Gradebook Routes
//Id = course id
router.get("/:id/grades/info", authenticateToken, getCourseInfo);
router.get("/:id/grades/average", authenticateToken, getAverage);
router.get("/:id/grades", authenticateToken, getCourseAssignments);
router.put("/:id/grades", authenticateToken, updateGrades);
router.post("/:id/grades/create", authenticateToken, createItem);

export default router;