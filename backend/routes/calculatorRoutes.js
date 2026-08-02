import express from "express";
import { getAverage, getExamGrade, getGradePrediction} from "../controllers/calculatorController.js"
import { authenticateToken } from "../middleware/authorization.js";

const router = express.Router();

router.post("/average", authenticateToken, getAverage);
router.post("/exam-grade", authenticateToken, getExamGrade);
router.post("/grade-predictor", authenticateToken, getGradePrediction);

export default router;