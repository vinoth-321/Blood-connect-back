import jwt from "jsonwebtoken";
import Hospital from "../models/hospital.js";

export const protectHospital = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    token = token.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.hospital = await Hospital.findById(decoded.id).select("-password");

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
