import jwt from "jsonwebtoken";
import Donor from "../models/donor.js";

export const protectDonor = async (req, res, next) => {
  let token;

  const authHeader =
    req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Not authorized, donor token missing",
    });
  }

  token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const donor = await Donor.findById(decoded.id).select("-password");

    if (!donor) {
      return res.status(401).json({ message: "Donor not found" });
    }

    req.donor = donor; // 🔥 THIS IS IMPORTANT
    next();
  } catch (error) {
    console.error("DONOR AUTH ERROR:", error.message);
    return res.status(401).json({
      message: "Token invalid or expired",
    });
  }
};
