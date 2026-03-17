import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/auth",
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
        console.log(error?.response?.data || error.message);
        throw error;
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
        console.log(error?.response?.data || error.message);
        throw error;
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

