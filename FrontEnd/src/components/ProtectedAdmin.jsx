import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { api } from "../utils/api";

export default function ProtectedAdmin({ children }) {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const location = useLocation();
    const [status, setStatus] = useState("checking");

    useEffect(() => {
        let cancelled = false;

        async function verifyAdmin() {
            if (!isAuthenticated) {
                setStatus("unauth");
                return;
            }

            // If user already has role from Redux, check directly
            if (user?.role === "admin") {
                setStatus("admin");
                return;
            }

            // Otherwise, fetch fresh profile to verify role
            try {
                const profile = await api("/profile");
                if (cancelled) return;

                if (profile.role === "admin") {
                    setStatus("admin");
                } else {
                    setStatus("forbidden");
                }
            } catch {
                if (!cancelled) setStatus("unauth");
            }
        }

        verifyAdmin();
        return () => { cancelled = true; };
    }, [isAuthenticated, user]);

    if (status === "checking") {
        return (
            <div className="min-h-screen grid place-items-center pt-24">
                <span className="loading loading-spinner loading-lg text-emerald-600"></span>
            </div>
        );
    }

    if (status === "unauth") {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (status === "forbidden") {
        return (
            <div className="min-h-screen grid place-items-center pt-24 px-4">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600 mb-6">Admin privileges required to view this page</p>
                    <a href="/home" className="btn btn-primary bg-emerald-500 border-none">
                        Go to Home
                    </a>
                </div>
            </div>
        );
    }

    return children;
}