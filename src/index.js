// require("dotenv").config({ path: "/.env" });
import dotenv from "dotenv";

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
import connectDB from "./db/db.js";

dotenv.config({
  path: "./env",
});

connectDB();

/* import express from "express";
const app = express();
// DB connection
// Efi
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("ERROR: ", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`App is listening on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("ERROR: ", err);
    throw err;
  }
})(); */