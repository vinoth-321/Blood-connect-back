import Hospital from "../models/hospital.js";

// GET blood stock
export const getBloodStock = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.hospital._id).select("bloodStock name");
    if (!hospital) return res.status(404).json({ message: "Hospital not found" });

    res.json(hospital.bloodStock);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE blood stock
export const updateBloodStock = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.hospital._id);
    if (!hospital) return res.status(404).json({ message: "Hospital not found" });

    hospital.bloodStock = {
      ...hospital.bloodStock,
      ...req.body, // expects blood group keys
    };

    await hospital.save();

    res.json({
      message: "Blood stock updated successfully",
      bloodStock: hospital.bloodStock,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
