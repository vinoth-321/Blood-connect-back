import express from "express";
import {
  acceptBloodRequest,
  completeRequest,getDonorRequests,getDonorActiveRequest,submitDonorLocation,getDonationHistory
} from "../controllers/donorRequestController.js";

import { protectDonor } from "../middleware/donorAuth.js";
import { protectHospital } from "../middleware/hospitalAuth.js";


const router = express.Router();

// Donor accepts a blood request
router.post(
  "/requests/:requestId/accept",
  protectDonor,
  acceptBloodRequest
);

// Hospital/system marks request completed
router.post(
  "/requests/:requestId/complete",
  protectHospital,
  completeRequest
);



// Donor views assigned blood requests
router.get(
  "/requests",
  protectDonor,
  getDonorRequests
);


router.get(
  "/requests/active",
  protectDonor,
  getDonorActiveRequest
);

router.get(
  "/history",
  protectDonor,
  getDonationHistory
);

router.post(
  "/requests/:requestId/location",
  protectDonor,
  submitDonorLocation
);
export default router;
