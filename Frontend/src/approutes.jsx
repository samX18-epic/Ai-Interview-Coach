import { createBrowserRouter } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import { ProtectedRoute } from "./features/auth/components/protected";
import Home from "./features/interview/page/Home.jsx";
import Interview from "./features/interview/page/interview.jsx";
import InterviewList from "./features/interview/page/InterviewList.jsx";
import ErrorBoundary from "./components/ErrorBoundary";
import { ErrorPage } from "./components/ErrorPage";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
        errorElement: <ErrorPage />
    },
    {
        path: "/register",
        element: <Register />,
        errorElement: <ErrorPage />
    },
    {
        path: "/",
        element: (
            <ErrorBoundary>
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
            </ErrorBoundary>
        ),
        errorElement: <ErrorPage />
    },
    {
        path: "/interview",
        element: (
            <ErrorBoundary>
                <ProtectedRoute>
                    <InterviewList />
                </ProtectedRoute>
            </ErrorBoundary>
        ),
        errorElement: <ErrorPage />
    },
    {
        path:"/interview/:interviewId",
        element:(
            <ErrorBoundary>
                <ProtectedRoute>
                    <Interview />
                </ProtectedRoute>
            </ErrorBoundary>
        ),
        errorElement: <ErrorPage />
    }
]);