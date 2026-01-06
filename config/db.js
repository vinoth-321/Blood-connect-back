import mongoose from "mongoose";

const connectDB=async () =>{
    try{
        console.log("👉 MONGO_URI =", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    }
    catch (err) {
    console.error(err);
    process.exit(1);
  }
}

export default connectDB;
