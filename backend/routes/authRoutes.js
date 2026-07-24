import express from "express";
import { getUsers, createUser, loginUser, refreshUserToken, logoutUser } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authorization.js";

const router = express.Router();

router.get("/", authenticateToken, getUsers);
router.post('/create', createUser);
router.post('/login', loginUser);
router.get('/refresh', refreshUserToken);
router.delete('/logout', logoutUser);

export default router;
