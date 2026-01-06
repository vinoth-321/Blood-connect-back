import Hospital from "../models/hospital.js";

/* ===============================
   CREATE HOSPITAL (ADMIN)
================================ */
export const createHospital = async (req, res) => {
  try {
    const {
      name,
      password,
      confirmPassword,
      phone,
      street,
      city,
      state,
      pincode,
      latitude,
      longitude,
    } = req.body;

    /* ---------------------------
       VALIDATION
    --------------------------- */
    if (
      !name ||
      !password ||
      !confirmPassword ||
      !phone ||
      !street ||
      !city ||
      !state ||
      !pincode ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        message: "All fields including location are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const exists = await Hospital.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Hospital already exists" });
    }

    /* ---------------------------
       CREATE HOSPITAL WITH LOCATION
    --------------------------- */
    const hospital = await Hospital.create({
      name,
      password,
      phone,
      address: {
        street,
        city,
        state,
        pincode,
      },
      location: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)], // [lng, lat]
      },
    });

    res.status(201).json({
      message: "Hospital created successfully",
      hospital,
    });
  } catch (err) {
    console.error("HOSPITAL CREATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   UPDATE HOSPITAL LOCATION
================================ */
export const updateHospitalLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: "Location required" });
    }

    await Hospital.findByIdAndUpdate(req.hospital._id, {
      location: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
      },
    });

    res.json({ message: "Location updated successfully" });
  } catch (err) {
    console.error("UPDATE LOCATION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET ALL HOSPITALS (ADMIN)
================================ */
export const getHospitals = async (req, res) => {
  const hospitals = await Hospital.find().sort({ createdAt: -1 });
  res.json(hospitals);
};

/* ===============================
   GET SINGLE HOSPITAL (ADMIN)
================================ */
export const getHospitalById = async (req, res) => {
  const hospital = await Hospital.findById(req.params.id);

  if (!hospital) {
    return res.status(404).json({ message: "Hospital not found" });
  }

  res.json(hospital);
};

/* ===============================
   DELETE HOSPITAL (ADMIN)
================================ */
export const deleteHospital = async (req, res) => {
  const hospital = await Hospital.findByIdAndDelete(req.params.id);

  if (!hospital) {
    return res.status(404).json({ message: "Hospital not found" });
  }

  res.json({ message: "Hospital deleted successfully" });
};
