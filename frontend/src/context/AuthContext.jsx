import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { checkAuthStatus, loginUser, logoutUser, signupUser } from "../helpers/api-communicator";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    console.log(isLoggedIn);

    useEffect(() => {
        const publicRoutes = ["/login", "/signup", "/features", "/"];
        if (publicRoutes.includes(location.pathname)) {
            setLoading(false);
            return;
        }

        async function checkStatus() {
            try {
                const data = await checkAuthStatus();
                if (data && data.user) {
                    setUser({ email: data.user.email, name: data.user.name });
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.error("Authentication check failed:", error);
                setIsLoggedIn(false);
                setUser(null);
                if (!publicRoutes.includes(location.pathname)) {
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        }
        checkStatus();
    }, [location.pathname, navigate]);

    const login = async (email, password) => {
        try {
            await loginUser(email, password);
            const authData = await checkAuthStatus();
            if (authData && authData.user) {
                setUser({ email: authData.user.email, name: authData.user.name });
                setIsLoggedIn(true);
                navigate("/chat");
            }
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const signup = async (name, email, password) => {
        try {
            await signupUser(name, email, password);
            const authData = await checkAuthStatus();
            if (authData && authData.user) {
                setUser({ email: authData.user.email, name: authData.user.name });
                setIsLoggedIn(true);
                navigate("/chat");
            }
        } catch (error) {
            console.error("Signup failed:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await logoutUser();
            setIsLoggedIn(false);
            setUser(null);
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
            throw error;
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, logout, signup }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
