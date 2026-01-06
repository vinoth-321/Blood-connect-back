import BloodRequest from "../models/BloodRequest.js";
import Donor from "../models/donor.js";
import { notifyNearestDonors } from "../services/donorSearchService.js";

/* ===============================
   CREATE BLOOD REQUEST
================================ */
export const createBloodRequest = async (req, res) => {
  try {
    const { bloodGroup, units, urgency,hospitalLiveLocation } = req.body;

    const hospital = req.hospital;

    // ❗ Hospital must have coordinates
    if (!hospital.location) {
      return res.status(400).json({
        message: "Hospital location not set",
      });
    }
    if (!hospitalLiveLocation) {
      return res.status(400).json({ message: "Hospital location required" });
    }
    const request = await BloodRequest.create({
      hospital: hospital._id,
      bloodGroup,
      units,
      urgency,
      hospitalLiveLocation,
    });

    await notifyNearestDonors(request, hospital.location);

    res.status(201).json({
      message: "Blood request created and donors notified",
      request,
    });
  } catch (err) {
    console.error("CREATE REQUEST ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET HOSPITAL REQUESTS
================================ */
export const getHospitalRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find({
      hospital: req.hospital._id,
    })
      .populate("acceptedDonor", "name phone email location lastActiveAt")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error("GET HOSPITAL REQUESTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteBloodRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await BloodRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // If donor accepted, reset donor
    if (request.acceptedDonor) {
      await Donor.findByIdAndUpdate(request.acceptedDonor, {
        availability: "not_available",
      });
    }

    await request.deleteOne();

    res.json({ message: "Blood request deleted successfully" });
  } catch (err) {
    console.error("DELETE REQUEST ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const submitHospitalLocation = async (req, res) => {
  const { liveLocation } = req.body;

  await BloodRequest.findByIdAndUpdate(req.params.id, {
    hospitalLiveLocation: liveLocation,
  });

  res.json({ message: "Hospital location saved" });
};


