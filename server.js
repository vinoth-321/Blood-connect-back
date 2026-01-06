import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import registerRoute from "./routes/register.js";    
import loginRoute from "./routes/login.js";           
import profileRoute from "./routes/profile.js";
import userRoutes from "./routes/userRoutes.js";
import donorRequestRoutes from "./routes/donorRequestRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import hospitalAuthRoutes from "./routes/hospitalAuthRoutes.js";
import hospitalDashboardRoutes from "./routes/hospitalDashboardRoutes.js";
import hospitalProfileRoutes from "./routes/hospitalProfileRoutes.js";
import hospitalStockRoutes from "./routes/hospitalStockRoutes.js";
import bloodRequestRoutes from "./routes/bloodRequestRoutes.js";
import  locationRoutes from "./routes/donorLocationRoutes.js";


dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/register", registerRoute);
app.use("/api/login", loginRoute);
app.use("/api/profile",profileRoute);
app.use("/api/user", userRoutes);
app.use("/api/donor", donorRequestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/hospital", hospitalAuthRoutes);
app.use("/api/hospital", hospitalDashboardRoutes);
app.use("/api/hospital", hospitalProfileRoutes);
app.use("/api/hospital", hospitalStockRoutes);
app.use("/api/blood-requests", bloodRequestRoutes);
app.use("/api/location",locationRoutes);


app.listen(5000, () => console.log("Server running on port 5000"));