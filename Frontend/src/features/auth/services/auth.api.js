import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth`;
console.log("🚀 Auth API trying to reach:", BASE_URL);

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});


export async function register({ username, email, password }) {
    try {
        const response = await api.post(
            "/register",
            { username, email, password },
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        const url = error?.config?.url || 'unknown URL';
        const message = error?.response?.data?.message || err.message || error?.message || 'Registration failed';
        console.error('Registration error:', message);
        throw new Error(`${message} (Attempted to reach: ${url})`);
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post(
            "/login",
            { email, password },
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        const url = error?.config?.url || 'unknown URL';
        const message = error?.response?.data?.message || err.message || error?.message || 'Login failed';
        console.error('Login error:', message);
        throw new Error(`${message} (Attempted to reach: ${url})`);
    }
}

export async function logout() {
    try {
        const response = await api.get(
            "/logout",
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.log(error?.response?.data || error.message);
        throw error;
    }
}

export async function getMe() {
    try {
        const response = await api.get(
            "/get-me",
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.log(error?.response?.data || error.message);
        throw error;
    }
}

