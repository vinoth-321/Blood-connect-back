import mongoose from "mongoose";

const DonorSchema = new mongoose.Schema(
  {
  
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      
    },

    password: {
      type: String,
      required: true,
    },

    emailVerified: {
    type: Boolean,
    default: false,
  },

  otp: {
    code: String,
    expiresAt: Date,
  }, 

    address: String,
    city: String,
    state: String,
    pincode: String,

    bloodType: {
  type: String,
  enum: [
    "A_Positive", "A_Negative",
    "B_Positive", "B_Negative",
    "AB_Positive", "AB_Negative",
    "O_Positive", "O_Negative",
  ],
}
,
donationHistory: [
  {
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    },
    bloodGroup: String,
    units: Number,
    donatedAt: {
      type: Date,
      default: Date.now,
    },
  },
],


    weight: {
      type: Number,
      min: 50,
    },

    dob: Date,
    age: Number,

    lastDonationDate: {
      type: Date,
      default: null,
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

     availability: {
      type: String,
      enum: ["available", "not_available"],
      default: "not_available",
    },


  
    location: {
  type: {
    type: String,
    enum: ["Point"],
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
  },
},

    lastActiveAt: {
      type: Date,
      default: Date.now,
    },

    profilePhoto: {
      url: String,
      publicId: String,         
    },
  },
  { timestamps: true }
);

DonorSchema.index({ location: "2dsphere" });

export default mongoose.model("Donor", DonorSchema);
