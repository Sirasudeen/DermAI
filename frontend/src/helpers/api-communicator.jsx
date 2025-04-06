import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
axios.defaults.withCredentials = true; // Ensures cookies are sent with every request

console.log(`Axios Base URL: ${axios.defaults.baseURL}`);

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error("Unauthorized access - Redirecting to login.");
            window.location.href = "/login"; // Uncomment to enable redirect
        }
        return Promise.reject(error);
    }
);


export const loginUser = async (email, password) => {
    try {
        const { data } = await axios.post("/user/login", { email, password });
        return data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Unable to login");
        } else {
            throw new Error("Unable to login");
        }
    }
};


export const signupUser = async (name, email, password) => {
    try {
        const { data } = await axios.post("/user/signup", { name, email, password });
        return data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Unable to sign up");
        } else {
            throw new Error("Unable to sign up");
        }
    }
};


export const checkAuthStatus = async () => {
    try {
        const { data } = await axios.get("/user/auth-status");
        return data;
    } catch (error) {
        throw new Error("Unable to authenticate");
    }
};


export const sendChatRequest = async (message) => {
    try {
        console.log(`Sending message: ${message}`);
        const { data } = await axios.post("/chat/new", { message });
        return data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Unable to send chat");
        } else {
            throw new Error("Unable to send chat");
        }
    }
};


export const getUserChats = async () => {
    try {
        const { data } = await axios.get("/chat/all-chats");
        return data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Unable to retrieve chats");
        } else {
            throw new Error("Unable to retrieve chats");
        }
    }
};


export const deleteUserChats = async () => {
    try {
        const { data } = await axios.delete("/chat/delete");
        return data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Unable to delete chats");
        } else {
            throw new Error("Unable to delete chats");
        }
    }
};


export const logoutUser = async () => {
    try {
        const { data } = await axios.post("/user/logout");
        return data;
    } catch (error) {
        throw new Error("Unable to log out");
    }
};
