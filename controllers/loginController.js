import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Donor from "../models/donor.js";

export const loginDonor = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Find donor
    const donor = await Donor.findOne({ email });
    if (!donor) {
      return res.status(404).json({ msg: "Donor not found" });
    }

    // 2️⃣ Email verification check
    if (!donor.emailVerified) {
      return res.status(403).json({ msg: "Verify email first" });
    }

    // 3️⃣ Password check
    const match = await bcrypt.compare(password, donor.password);
    if (!match) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    // 4️⃣ Generate JWT (🔥 FIXED)
    const token = jwt.sign(
      { id: donor._id },          // ✅ STANDARD
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5️⃣ Response
    res.json({
      msg: "Login successful",
      token,
      userId: donor._id,
      profileCompleted: donor.profileCompleted,
    });

  } catch (err) {
    console.error("DONOR LOGIN ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
