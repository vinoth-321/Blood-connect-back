import express from "express";
import { completeProfile } from "../controllers/profileController.js";
import { protectDonor } from "../middleware/donorAuth.js";

const router = express.Router();

// POST /api/profile/complete
router.post("/complete", protectDonor, completeProfile);

export default router;

