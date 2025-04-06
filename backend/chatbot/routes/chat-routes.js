import { Router } from "express";
import { verifyJWT } from "../middleware/authMiddleware.js";
import { chatCompletionValidator, validate } from "../utils/validators.js";
import {
    deleteChats,
    generateChatCompletion,
    sendChatsToUser,
} from "../controllers/chat-Controllers.js";

const chatRoutes = Router();

chatRoutes.post(
    "/new",
    validate(chatCompletionValidator),
    verifyJWT,
    generateChatCompletion
);
chatRoutes.get("/all-chats", verifyJWT, sendChatsToUser);
chatRoutes.delete("/delete", verifyJWT, deleteChats);

export default chatRoutes;
