import mongoose from "mongoose";
import Admin from "./models/admin.js";

mongoose.connect("mongodb://127.0.0.1:27017/blood");

async function createAdmin() {
  const admin = await Admin.create({
    name: "Vinothkumar",
    password: "Vinoth@321",
  });

  console.log("Admin created:", admin);
  process.exit();
}

createAdmin();
