import express from "express";
import { register } from "../controllers/registerController.js";
import { verifyOtp } from "../controllers/otpController.js";

const router = express.Router();

router.post("/",register);
router.post("/verify-otp", verifyOtp);

export default router;