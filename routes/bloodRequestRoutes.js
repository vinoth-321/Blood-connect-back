// backend/routes/bloodRequestRoutes.js
import express from "express";
import {
  createBloodRequest,
  getHospitalRequests,
  deleteBloodRequest,submitHospitalLocation
  
} from "../controllers/bloodRequestController.js";

import { protectHospital } from "../middleware/hospitalAuth.js";


const router = express.Router();

// Hospital
router.post("/", protectHospital, createBloodRequest);
router.get("/", protectHospital, getHospitalRequests);

router.delete(
  "/:requestId",
  protectHospital,
  deleteBloodRequest
);

router.post(
  "/:requestId/location",
  protectHospital,
  submitHospitalLocation
);
export default router;
