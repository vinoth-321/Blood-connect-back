import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const HospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },

    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: false,
        validate: {
          validator: (v) => !v || v.length === 2,
          message: "Coordinates must be [longitude, latitude]",
        },
      },
    },

    bloodStock: {
      A_Positive: { type: Number, default: 0 },
      A_Negative: { type: Number, default: 0 },
      B_Positive: { type: Number, default: 0 },
      B_Negative: { type: Number, default: 0 },
      AB_Positive: { type: Number, default: 0 },
      AB_Negative: { type: Number, default: 0 },
      O_Positive: { type: Number, default: 0 },
      O_Negative: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

HospitalSchema.index({ location: "2dsphere" });

HospitalSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

HospitalSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Hospital", HospitalSchema);
