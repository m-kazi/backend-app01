// require("dotenv").config({ path: "/.env" });
import dotenv from "dotenv";

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
import connectDB from "./db/db.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

// when async method completes, a promise has to return
connectDB()
  .then(() => {
    // running from Express - app.js
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
      app.on("error", (error) => {
        console.log("ERROR: ", error);
        throw error;
      });
    });
  })
  .catch((err) => {
    console.log("⚙️ MongoDB connection Failed !!", err);
  });

// Another way to connect to the Database

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
