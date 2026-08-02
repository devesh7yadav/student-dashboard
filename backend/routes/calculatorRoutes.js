import express from "express";
import { getAverage, getExamGrade, getGradePrediction} from "../controllers/calculatorController.js"
import { authenticateToken } from "../middleware/authorization.js";

const router = express.Router();

router.get("/average", authenticateToken, getAverage);
router.get("/exam-grade", authenticateToken, getExamGrade);
router.get("/grade-prediction", authenticateToken, getGradePrediction);

export default router;