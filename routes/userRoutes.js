import express from "express";
import {  viewProfile,
  getDoners,
  deleteDonor,
  updateProfile,
  deleteProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/me/:id", viewProfile);

// GET /api/profile/donors
router.get("/donors", getDoners); 

// DELETE /api/profile/me/:id
router.delete("/delete/:id", deleteDonor);

// PUT /api/profile/update/:id
router.put("/update/:id", updateProfile);

// POST /api/profile/delete
router.post("/delete", deleteProfile);


export default router;
