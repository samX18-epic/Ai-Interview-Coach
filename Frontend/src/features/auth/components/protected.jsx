import React from "react"
import "../auth.form.scss"
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export const ProtectedRoute = ({ children }) => {
    const { user, isInitialized } = useAuth()
    console.log("ProtectedRoute user:", user, "isInitialized:", isInitialized)

    if (!isInitialized) {
        return (
            <main>
                <div className="form-container">
                    <div className="logo">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="20" cy="20" r="20" fill="#111" />
                            <circle cx="20" cy="20" r="8" fill="white" />
                        </svg>
                    </div>
                    <div className="loading-text">Loading your account...</div>
                </div>
            </main>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children || <Outlet />
}

export default ProtectedRoute

