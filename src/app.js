import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// cors configuration - middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// for JSON data limit
app.use(express.json({ limit: "16kb" }));

// URL configuration
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// for public assets (files, images)
app.use(express.static("public"));

// for cookie-parser
app.use(cookieParser());

// routes import
import userRouter from "./routes/user.routes.js";

// routes declaration-middleware
app.use("/api/v1/users", userRouter);

// example URL: http://localhost:8000/api/v1/users/register
export { app };
