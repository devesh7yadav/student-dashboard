import express from "express";
import { getUsers, createUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

router.get("/", getUsers);
router.post('/create', createUser);
router.post('/login', loginUser);

export default router;
