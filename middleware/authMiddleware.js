import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";

export const protect = async (req, res, next) => {
  console.log("======== NEW REQUEST ========");
  console.log("REQ HEADERS:", req.headers);

  let token;

  const authHeader = req.headers.authorization || req.headers.Authorization;

  console.log("AUTH HEADER FOUND =", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  if (authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  console.log("TOKEN EXTRACTED =", token);

  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select("-password");

    console.log("TOKEN DECODED SUCCESS:", decoded);

    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};
