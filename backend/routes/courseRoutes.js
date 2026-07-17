import express from "express";
import { getAllCourses, createCourse, deleteCourse, editCourse } from "../controllers/courseController.js"

const router = express.Router();

router.get("/courses", getAllCourses);
router.post("/courses",  createCourse);
router.delete("/courses/:id", deleteCourse);
router.put("/courses/:id", editCourse);

export default router;