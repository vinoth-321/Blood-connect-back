import Donor from "../models/donor.js";
import BloodRequest from "../models/BloodRequest.js";

/* =========================================
   DONOR ACCEPTS A BLOOD REQUEST
========================================= */
export const acceptBloodRequest = async (req, res) => {
  try {
    const donorId = req.donor._id;
    const { requestId } = req.params;
    

    

    // 1️⃣ Fetch request
    const request = await BloodRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Blood request not found" });
    }

    // 2️⃣ Ensure request is still searching
    if (request.status !== "searching") {
      return res.status(400).json({
        message: "This request is no longer available",
      });
    }

    // 3️⃣ Assign donor + update request
    request.acceptedDonor = donorId;
    request.status = "accepted";
   
    await request.save();

    // 4️⃣ Update donor availability
    await Donor.findByIdAndUpdate(donorId, {
      availability: "available",
      lastActiveAt: new Date(),
    });

    res.json({ message: "Blood request accepted successfully" });
  } catch (err) {
    console.error("ACCEPT REQUEST ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================
   COMPLETE BLOOD REQUEST (HOSPITAL)
========================================= */
export const completeRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    // 1️⃣ Get request with donor + hospital
    const request = await BloodRequest.findById(requestId)
      .populate("acceptedDonor")
      .populate("hospital");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "accepted") {
      return res.status(400).json({
        message: "Only accepted requests can be completed",
      });
    }

    const donor = request.acceptedDonor;

    if (!donor) {
      return res.status(400).json({
        message: "No donor assigned to this request",
      });
    }

    // 2️⃣ ADD DONATION HISTORY
    donor.donationHistory.push({
      hospital: request.hospital._id,
      bloodGroup: request.bloodGroup,
      units: request.units,
      donatedAt: new Date(),
    });

    // 3️⃣ UPDATE DONOR STATUS
    donor.availability = "not_available";
    donor.lastDonationDate = new Date();

    await donor.save();

    // 4️⃣ COMPLETE REQUEST
    request.status = "completed";
    await request.save();

    res.json({
      message: "Donation completed successfully",
    });
  } catch (err) {
    console.error("COMPLETE REQUEST ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
/* =========================================
   GET BLOOD REQUESTS FOR DONOR
========================================= */
export const getDonorRequests = async (req, res) => {
  try {
    const donor = req.donor;

    const requests = await BloodRequest.find({
      status: "searching",
      acceptedDonor: null,
      notifiedDonors: donor._id,
      bloodGroup: donor.bloodType,
      expiresAt: { $gt: new Date() },
    })
      .populate("hospital", "name phone address location")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error("GET DONOR REQUESTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDonorActiveRequest = async (req, res) => {
  const donorId = req.donor._id;

  const request = await BloodRequest.findOne({
    acceptedDonor: donorId,
    status: { $in: ["accepted"] },
  }).populate("hospital");

  res.json(request); // null if none
};

export const submitDonorLocation = async (req, res) => {
  const donorId = req.donor._id;
  const { liveLocation } = req.body;

  const request = await BloodRequest.findOne({
    _id: req.params.id,
    acceptedDonor: donorId,
  });

  request.donorLiveLocation = liveLocation;
  await request.save();

  res.json({ message: "Donor location saved" });
};

/* =========================================
   GET DONOR DONATION HISTORY
========================================= */
export const getDonationHistory = async (req, res) => {
  try {
    const donorId = req.donor._id;

    const history = await BloodRequest.find({
      acceptedDonor: donorId,
      status: "completed",
    })
      .populate("hospital", "name address")
      .sort({ updatedAt: -1 });

    const formatted = history.map((req) => ({
      _id: req._id,
      bloodGroup: req.bloodGroup.replace("_", " "),
      units: req.units,
      hospital: req.hospital,
      donatedAt: req.updatedAt,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("DONOR HISTORY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

