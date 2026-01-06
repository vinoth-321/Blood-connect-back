import express from "express";
import { loginDonor } from "../controllers/loginController.js";

const router = express.Router();

router.post("/", loginDonor);

export default router;