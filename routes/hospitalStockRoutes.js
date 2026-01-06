import express from "express";
import {
  getBloodStock,
  updateBloodStock,
} from "../controllers/hospitalStockController.js";
import { protectHospital } from "../middleware/hospitalAuth.js";

const router = express.Router();

router.get("/stock", protectHospital, getBloodStock);
router.put("/stock", protectHospital, updateBloodStock);

export default router;
