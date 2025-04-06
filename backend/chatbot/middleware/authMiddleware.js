import { verifyToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

export const verifyJWT = (req, res, next) => {
    const token = req.cookies[COOKIE_NAME];

    if (!token || token.trim() === "") {
        return res.status(401).json({ message: "Access Denied: No Token Provided!" });
    }

    const jwtData = verifyToken(token);

    if (!jwtData) {
        return res.status(401).json({ message: "Invalid Token" });
    }

    res.jwtData = jwtData;
    next();
};
