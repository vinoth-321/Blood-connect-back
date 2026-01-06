import Admin from "../models/admin.js";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// @desc Login admin
export const loginAdmin = async (req, res) => {
  try {
    const { name, password } = req.body;

    const admin = await Admin.findOne({ name });

    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login Successful",
      token: generateToken(admin._id),
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
