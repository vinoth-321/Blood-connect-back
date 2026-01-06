// controllers/authController.js
import bcrypt from "bcryptjs";
import Donor from "../models/donor.js";
import { sendEmail } from "../utils/sendEmail.js";

export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const existingUser = await Donor.findOne({ email });

    // 🔢 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    // ✅ CASE 1: Email exists & verified → BLOCK
    if (existingUser && existingUser.emailVerified) {
      return res.status(400).json({
        msg: "Email already registered and verified",
      });
    }

    // 🔁 CASE 2: Email exists but NOT verified → RESEND OTP
    if (existingUser && !existingUser.emailVerified) {
      existingUser.otp = {
        code: otp,
        expiresAt: otpExpiry,
      };
      await existingUser.save();

      await sendEmail(
        email,
        "MyBlood Email Verification",
        `<h2>Your OTP: ${otp}</h2><p>Valid for 5 minutes</p>`
      );

      return res.json({ msg: "OTP resent to email" });
    }

    // ✅ CASE 3: New user
    const hashedPassword = await bcrypt.hash(password, 10);

    await Donor.create({
      name,
      email,
      phone,
      password: hashedPassword,
      emailVerified: false,
      otp: {
        code: otp,
        expiresAt: otpExpiry,
      },
    });

    await sendEmail(
      email,
      "MyBlood Email Verification",
      `<h2>Your OTP: ${otp}</h2><p>Valid for 5 minutes</p>`
    );

    res.status(201).json({ msg: "OTP sent to email" });

  } catch (err) {
    console.error("REGISTER ERROR:", err);

    // 🔐 Duplicate safety
    if (err.code === 11000) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    res.status(500).json({
      msg: "Internal Server Error",
      error: err.message,
    });
  }
};
