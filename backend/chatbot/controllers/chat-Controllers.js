import axios from 'axios';
import User from '../models/User.js';

export const generateChatCompletion = async (req, res, next) => {
    const { message } = req.body;
    console.log(message);
    try {
        const user = await User.findById(res.jwtData?.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered OR Token malfunctioned" });
        }

        const chatHistory = user.chats;
        console.log(chatHistory);
        chatHistory.push({ content: message, role: "user" });
        console.log(chatHistory);

        const response = await axios.post(process.env.RAG_SERVICE_URL, {
            text: message,
            history: chatHistory.map((chat) => ({
                role: chat.role,
                content: chat.content
            })),
        });

        const botMessage = response.data.data;

        chatHistory.push({ content: botMessage, role: "assistant" });
        user.chats = chatHistory;
        await user.save();

        return res.status(200).json({ chats: chatHistory });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

export const sendChatsToUser = async (req, res, next) => {
    try {
        const user = await User.findById(res.jwtData?.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered OR Token malfunctioned" });
        }
        if (user._id.toString() !== res.jwtData?.id) {
            return res.status(401).json({ message: "Permissions didn't match" });
        }
        return res.status(200).json({ message: "OK", chats: user.chats });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

export const deleteChats = async (req, res, next) => {
    try {
        const user = await User.findById(res.jwtData?.id).exec();

        if (!user) {
            return res.status(401).json({
                message: 'User not registered OR Token malfunctioned',
            });
        }

        if (user._id.toString() !== res.jwtData?.id) {
            return res.status(401).json({
                message: "Permissions didn't match",
            });
        }

        user.chats = [];
        await user.save();

        return res.status(200).json({
            message: 'OK',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Something went wrong',
            error: error.message,
        });
    }
};
