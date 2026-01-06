import Donor from "../models/donor.js";
import { sendEmail } from "../utils/sendEmail.js";

/**
 * Notify nearest eligible donors
 * @param {Object} request - BloodRequest document
 * @param {Object} hospitalLocation - GeoJSON Point
 */
export const notifyNearestDonors = async (request, hospitalLocation) => {
  if (
    !hospitalLocation ||
    !hospitalLocation.coordinates ||
    hospitalLocation.coordinates.length !== 2
  ) {
    console.log("❌ Hospital location invalid, skipping donor search");
    return 0;
  }

  const radiusMeters = request.radiusKm * 1000;

  const donors = await Donor.find({
    bloodType: request.bloodGroup,
    availability: "not_available",

    // Exclude already notified donors
    _id: { $nin: request.notifiedDonors },

    // Ensure donor has location
    location: { $exists: true },

    // Geo query
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: hospitalLocation.coordinates,
        },
        $maxDistance: radiusMeters,
      },
    },
  }).limit(10);

  if (donors.length === 0) {
    console.log("⚠️ No donors found in current radius");
    return 0;
  }

  for (const donor of donors) {
    // 📧 Send email
    await sendEmail(
      donor.email,
      "🩸 Urgent Blood Requirement",
      `
        <h2>Urgent Blood Request</h2>
        <p><b>Blood Group:</b> ${request.bloodGroup}</p>
        <p><b>Units Required:</b> ${request.units}</p>
        <p>Please open the <b>MyBlood</b> app to accept the request.</p>
      `
    );

    // Track notified donors
    request.notifiedDonors.push(donor._id);
  }

  await request.save();

  console.log(`✅ Notified ${donors.length} donors`);
  return donors.length;
};
