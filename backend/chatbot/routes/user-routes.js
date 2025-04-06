import { Router } from "express";
import {
    getAllUsers,
    userLogin,
    userLogout,
    userSignup,
    verifyUser,
} from "../controllers/user-Controllers.js";
import { loginValidator, signupValidator, validate } from "../utils/validators.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

const userRoutes = Router();

// Public Routes
userRoutes.post("/signup", validate(signupValidator), userSignup);
userRoutes.post("/login", validate(loginValidator), userLogin);

// Protected Routes
userRoutes.get("/auth-status", verifyJWT, verifyUser);
userRoutes.post("/logout", verifyJWT, userLogout);
userRoutes.get("/", verifyJWT, getAllUsers);

export default userRoutes;
