import mongoose from "mongoose";

const BloodRequestSchema = new mongoose.Schema(
  {
    /* =====================
       HOSPITAL INFO
    ===================== */
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },

    /* =====================
       BLOOD DETAILS
    ===================== */
    bloodGroup: {
      type: String,
      enum: [
        "A_Positive", "A_Negative",
        "B_Positive", "B_Negative",
        "AB_Positive", "AB_Negative",
        "O_Positive", "O_Negative",
      ],
      required: true,
    },

    hospitalLiveLocation: {
    type: String,
    default: null,
  },

  donorLiveLocation: {
    type: String,
    default: null,
  },

    units: {
      type: Number,
      required: true,
      min: 1,
    },

    urgency: {
      type: String,
      enum: ["normal", "emergency"],
      default: "normal",
    },

    /* =====================
       SEARCH CONTROL
    ===================== */
    radiusKm: {
      type: Number,
      default: 5, // start with 5km
    },

    /* =====================
       REQUEST STATUS
    ===================== */
    status: {
      type: String,
      enum: [
        "searching",   // looking for donors
        "accepted",    // donor accepted
        "completed",   // donation done
        "expired",     // no donor found
      ],
      default: "searching",
    },

     notifiedDonors: {
  type: [mongoose.Schema.Types.ObjectId],
  ref: "Donor",
  default: [],
},

    /* =====================
       DONOR ASSIGNMENT
    ===================== */
    acceptedDonor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      default: null,
    },

    /* =====================
       EXPIRY
    ===================== */
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
  },
  { timestamps: true }
);

export default mongoose.model("BloodRequest", BloodRequestSchema);
