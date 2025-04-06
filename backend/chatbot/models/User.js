
import mongoose, { Schema, model } from "mongoose";
import { randomUUID } from "crypto";

const chatSchema = new Schema({
    id: {
        type: String,
        default: () => randomUUID(),
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "assistant"],
    },
    content: {
        type: String,
        required: true,
    },
});

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    chats: {
        type: [chatSchema],
        default: [],
    },
});

export default model("User", userSchema);
