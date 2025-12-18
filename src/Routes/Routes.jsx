import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../Pages/HomePage";
import LoginPage from "../Pages/LoginPage";
import UserPostsPage from "../Pages/UserPostsPage";
import RankingsPage from "../Pages/RankingsPage";
import SignUpPage from "../Pages/SignUpPage";
import CreateRankEventPage from "../Pages/CreateRankEventPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "login", element: <LoginPage /> },
            { path: "signup", element: <SignUpPage /> },
            { path: "user/posts", element: <UserPostsPage /> },
            { path: "rankings", element: <RankingsPage /> },
            { path: "rank-event", element: <CreateRankEventPage />}
        ]
    },
    {
        path: "/home-page",
        element: <HomePage />
    }
]);
