import express from "express";
import { getAllCourses, createCourse, deleteCourse, editCourse } from "../controllers/courseController.js"

const router = express.Router();

router.get("/", getAllCourses);
router.post("/",  createCourse);
router.delete("/:id", deleteCourse);
router.put("/:id", editCourse);

export default router;