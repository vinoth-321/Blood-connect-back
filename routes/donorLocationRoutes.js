import express from "express";
import { updateDonorLocation } from "../controllers/donorController.js";
import {protectDonor } from "../middleware/donorAuth.js";

const router = express.Router();

router.put("/", protectDonor, updateDonorLocation);


export default router;
