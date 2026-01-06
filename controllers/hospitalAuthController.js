import Hospital from "../models/hospital.js";
import jwt from "jsonwebtoken";


// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Hospital Login
export const hospitalLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Username in your model is "name"
    const hospital = await Hospital.findOne({ name: username });

    if (!hospital)
      return res.status(400).json({ message: "Hospital not found" });

    const passwordMatch = await hospital.matchPassword(password);

    if (!passwordMatch)
      return res.status(400).json({ message: "Incorrect password" });

    res.json({
      message: "Login successful",
      token: generateToken(hospital._id),
      hospital: {
        id: hospital._id,
        name: hospital.name,
        phone: hospital.phone,
        address: hospital.address,
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
