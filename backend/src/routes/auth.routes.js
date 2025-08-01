import express from "express";
import { register, login, logout, check } from "../controllers/auth.controller.js"; // Importing the controller functions
import { authMiddleware } from "../middleware/auth.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);


authRoutes.post("/login", login);


authRoutes.post("/logout", authMiddleware ,logout);


authRoutes.get("/check",authMiddleware , check);

export default authRoutes;

// this provides all routes
