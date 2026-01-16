import {createBrowserRouter, Navigate} from "react-router-dom";
import App from "../App";
import HomePage from "../Pages/HomePage";
import LoginPage from "../Pages/LoginPage";
import UserPostsPage from "../Pages/UserPostsPage";
import RankingsPage from "../Pages/RankingsPage";
import SignUpPage from "../Pages/SignUpPage";
import CreateRankEventPage from "../Pages/CreateRankEventPage";
import {ProtectedRoute} from "../Pages/ProtectedRoute";

export const router = createBrowserRouter([
    // Public Routes (Accessible without token)
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/signup",
        element: <SignUpPage />
    },

    // Protected Routes
    {
        element: <ProtectedRoute />, // 1. Check Token
        children: [
            {
                path: "/",
                element: <App />, // 2. Render Layout (Navbar)
                children: [
                    // 3. Render Pages
                    { path: "", element: <Navigate to="/home-page" replace /> }, // Default redirect
                    { path: "home-page", element: <HomePage /> },
                    { path: "user/posts", element: <UserPostsPage /> },
                    { path: "rankings", element: <RankingsPage /> },
                    { path: "rank-event", element: <CreateRankEventPage /> }
                ]
            }
        ]
    }
]);
