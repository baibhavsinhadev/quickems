import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    const refreshSession = async () => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            setUser(null);
            setToken(null);
            setLoading(false);
            return;
        };

        try {
            const { data } = await api.get("/auth/session");
            setUser(data.user);
        } catch (error) {
            // Token is invalid, clean it
            localStorage.removeItem("token");
            setUser(null);
            setToken(null);
        } finally {
            setLoading(false);
        };
    };

    const login = async (email, password, role_type) => {
        try {
            const { data } = await api.post("/auth/login", { email, password, role_type });
            localStorage.setItem("token", data.token);
            setToken(data.token);
            setUser(data.user);
            return data.user;
        } catch (error) {
            throw new Error(
                error.response?.data?.message || "Login failed"
            );
        } finally {
            setLoading(false);
        };
    };

    const logout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        toast.success("Logged out successfully");
    }

    useEffect(() => {
        refreshSession();
    }, [])

    const value = { user, token, loading, logout, login, refreshSession }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthProvider = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuthProvider must be used within AuthProvider");

    return context;
};