import Donor from "../models/donor.js";

/* ==========================
   UPDATE DONOR LOCATION
========================== */
export const updateDonorLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ msg: "Latitude and longitude required" });
    }

    await Donor.findByIdAndUpdate(req.donor._id, {
      location: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)], // [lng, lat]
      },
      lastActiveAt: new Date(),
    });

    res.json({ msg: "Location updated successfully" });
  } catch (err) {
    console.error("UPDATE LOCATION ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};



