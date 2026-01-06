import express from "express";
import { protectHospital } from "../middleware/hospitalAuth.js";

const router = express.Router();

router.get("/dashboard", protectHospital, (req, res) => {
  res.json({
    message: "Hospital Dashboard Access Granted",
    hospital: req.hospital,
  });
});

export default router;
