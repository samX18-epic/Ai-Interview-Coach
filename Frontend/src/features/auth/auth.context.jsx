import { createContext, useState, useEffect } from "react";
import { register as registerApi, login as loginApi, logout as logoutApi, getMe as getMeApi } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Restore user session on app load
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const data = await getMeApi();
                setUser(data?.user || data?.data);
            } catch (err) {
                console.log("No active session");
                setUser(null);
            } finally {
                setIsInitialized(true);
            }
        };
        restoreSession();
    }, []);

    const register = async ({ username, email, password }) => {
        try {
            const data = await registerApi({ username, email, password });
            const userData = data?.user || data?.data || data;
            setUser(userData);
            return data;
        } catch (err) {
            setError(err.message);
        }
    };

    const login = async ({ email, password }) => {
        try {
            const data = await loginApi({ email, password });
            const userData = data?.user || data?.data || data;
            setUser(userData);
            return data;
        } catch (err) {
            setError(err.message);
        }
    };

    const logout = async () => {
        try {
            const data = await logoutApi();
            setUser(null);
            return data;
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, error, register, login, logout, isInitialized }}>
            {children}
        </AuthContext.Provider>
    );
};