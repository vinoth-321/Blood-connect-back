import express from "express";
import { hospitalLogin } from "../controllers/hospitalAuthController.js";

const router = express.Router();

// Hospital Login
router.post("/login", hospitalLogin);

export default router;
