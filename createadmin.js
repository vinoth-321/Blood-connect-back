import mongoose from "mongoose";
import Admin from "./models/admin.js";

mongoose.connect("mongodb+srv://vinothkumar15122005_db_user:Vinoth321@cluster0.1xwwrga.mongodb.net/blood?retryWrites=true&w=majority");

async function createAdmin() {
  const admin = await Admin.create({
    name: "Vinothkumar",
    password: "Vinoth@321",
  });

  console.log("Admin created:", admin);
  process.exit();
}

createAdmin();
