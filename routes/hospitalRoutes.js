import express from "express";
import {
  createHospital,
  getHospitals,
  getHospitalById,
  deleteHospital
} from "../controllers/hospitalController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createHospital);
router.get("/", protect, getHospitals);
router.get("/:id", protect, getHospitalById);
router.delete("/:id", protect, deleteHospital);

export default router;
