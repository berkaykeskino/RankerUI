import {createBrowserRouter, Navigate} from "react-router-dom";
import App from "../App";
import HomePage from "../Pages/HomePage";
import LoginPage from "../Pages/LoginPage";
import UserPostsPage from "../Pages/UserPostsPage";
import RankingsPage from "../Pages/RankingsPage";
import SignUpPage from "../Pages/SignUpPage";
import CreateRankEventPage from "../Pages/CreateRankEventPage";
import AddFriendsPage from "../Pages/AddFriendsPage"; // <--- 1. IMPORT THIS
import {ProtectedRoute} from "../Pages/ProtectedRoute";
import PendingRequestsPage from "../Pages/PendingRequestsPage";
import MyFriendsPage from "../Pages/MyFriendsPage";

export const router = createBrowserRouter([
    // Public Routes
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
        element: <ProtectedRoute />,
        children: [
            {
                path: "/",
                element: <App />,
                children: [
                    { path: "", element: <Navigate to="/home-page" replace /> },
                    { path: "home-page", element: <HomePage /> },
                    { path: "user/posts", element: <UserPostsPage /> },
                    { path: "rankings", element: <RankingsPage /> },
                    { path: "rank-event", element: <CreateRankEventPage /> },
                    { path: "add-friends", element: <AddFriendsPage /> },
                    { path: "friend-requests", element: <PendingRequestsPage /> },
                    { path: "my-friends", element: <MyFriendsPage /> },
                ]
            }
        ]
    }
]);