import express from "express";
import {
  getHospitalProfile,
  updateHospitalProfile
} from "../controllers/hospitalProfileController.js";

import { protectHospital } from "../middleware/hospitalAuth.js";

const router = express.Router();

router.get("/profile", protectHospital, getHospitalProfile);
router.put("/profile", protectHospital, updateHospitalProfile);

export default router;
