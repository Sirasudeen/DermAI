import User from "../models/User.js";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { validate, signupValidator, loginValidator } from "../utils/validators.js";
import { COOKIE_NAME } from "../utils/constants.js";

export const userSignup = [
    validate(signupValidator),
    async (req, res, next) => {
        try {
            const { name, email, password } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(409).json({ message: "User already registered" });

            const hashedPassword = await hash(password, 10);

            const user = new User({ name, email, password: hashedPassword });
            await user.save();

            const token = createToken(user._id.toString(), user.email, "7d");

            res.cookie(COOKIE_NAME, token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: "/",
            });

            return res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            console.error("Signup Error:", error);
            return res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }
];

export const userLogin = [
    validate(loginValidator),
    async (req, res, next) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            const isMatch = await compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            const token = createToken(user._id.toString(), user.email, "7d");

            res.cookie(COOKIE_NAME, token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: "/",
            });

            return res.status(200).json({ message: "Login successful" });
        } catch (error) {
            console.error("Login Error:", error);
            return res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }
];

export const verifyUser = async (req, res, next) => {
    try {
        const jwtData = res.jwtData;

        const user = await User.findById(jwtData.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "Authenticated", user });
    } catch (error) {
        console.error("Auth Status Verification Error:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const userLogout = async (req, res, next) => {
    try {
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            secure: true,
            path: "/",
        });

        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password");
        return res.status(200).json({ message: "OK", users });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
