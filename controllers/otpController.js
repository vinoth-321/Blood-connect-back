// controllers/otpController.js
import Donor from "../models/donor.js";

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const donor = await Donor.findOne({ email });
    if (!donor) return res.status(404).json({ msg: "User not found" });

    if (
      donor.otp.code !== otp ||
      donor.otp.expiresAt < Date.now()
    ) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    donor.emailVerified = true;
    donor.otp = undefined;
    await donor.save();

    res.json({ msg: "Email verified successfully" });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
