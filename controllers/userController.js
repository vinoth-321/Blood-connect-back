import Donor from "../models/donor.js";
import bcrypt from "bcryptjs";

// VIEW PROFILE
export const viewProfile = async (req, res) => {
  try {
    const user = await Donor.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Error fetching profile" });
  }
};

// Read Donors
export const getDoners = async (req, res) => {
  const Donors = await Donor.find().sort({ createdAt: -1 });
  res.json(Donors);
};

// Delete Hospital 
export const deleteDonor = async (req, res) => {
  const donor = await Donor.findByIdAndDelete(req.params.id);

  if (!donor) return res.status(404).json({ message: "Donor not found" });

  res.json({ message: "Donor deleted successfully" });
};


// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  const userId = req.params.id;
  const { name, phone, address, city, state, pincode, bloodType, weight } = req.body;

  try {
    await Donor.findByIdAndUpdate(userId, {
      name,
      phone,
      address,
      city,
      state,
      pincode,
      bloodType,
      weight,
    });

    return res.json({ msg: "Profile updated successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Failed to update profile" });
  }
};

// DELETE PROFILE (PASSWORD REQUIRED)
export const deleteProfile = async (req, res) => {
  const { userId, password } = req.body;

  try {
    const user = await Donor.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // PASSWORD CHECK
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ msg: "Incorrect password" });

    await Donor.findByIdAndDelete(userId);

    return res.json({ msg: "Account deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Failed to delete account" });
  }
};
