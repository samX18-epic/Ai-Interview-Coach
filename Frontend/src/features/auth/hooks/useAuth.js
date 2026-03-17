import { useContext } from "react";
import { AuthContext } from "../auth.context";

export const useAuth = () => {
    const { user, setUser, loading, setLoading, error, register, login, logout, isInitialized } = useContext(AuthContext);

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        const result = await login({ email, password });
        setLoading(false);
        return result;
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        const result = await register({ username, email, password });
        setLoading(false);
        return result;
    };

    const handleLogout = async () => {
        setLoading(true);
        await logout();
        setLoading(false);
    };

    return { user, loading, error, handleLogin, handleRegister, handleLogout, isInitialized };
};