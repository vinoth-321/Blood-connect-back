import Donor from "../models/donor.js";

export const completeProfile = async (req, res) => {
  const { address, city, state, pincode, bloodType, weight, dob } = req.body;

  const age =
    new Date().getFullYear() - new Date(dob).getFullYear();

  try {
    await Donor.findByIdAndUpdate(req.donor._id, {
      address,
      city,
      state,
      pincode,
      bloodType,
      weight,
      dob,
      age,
      profileCompleted: true,
    });

    res.json({ msg: "Profile Completed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error updating profile" });
  }
};
