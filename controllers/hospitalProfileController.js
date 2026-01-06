import Hospital from "../models/hospital.js";

// GET logged-in hospital profile
export const getHospitalProfile = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.hospital._id).select("-password");

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    res.json(hospital);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE phone + address ONLY
export const updateHospitalProfile = async (req, res) => {
  try {
    const { phone, street, city, state, pincode } = req.body;

    const hospital = await Hospital.findById(req.hospital._id);

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Allowed updates only
    hospital.phone = phone || hospital.phone;
    hospital.address.street = street || hospital.address.street;
    hospital.address.city = city || hospital.address.city;
    hospital.address.state = state || hospital.address.state;
    hospital.address.pincode = pincode || hospital.address.pincode;

    await hospital.save();

    res.json({
      message: "Profile updated successfully",
      hospital
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
