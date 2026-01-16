import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
    // Check if token exists in localStorage
    // In a real app, you might also check expiry here
    const token = localStorage.getItem("userToken");

    // If no token, redirect to Login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If token exists, render the child routes (The App Layout)
    return <Outlet />;
};