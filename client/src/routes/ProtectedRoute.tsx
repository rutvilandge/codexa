import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthStore } from "@/store/authStore";

export default function ProtectedRoute() {
  const { isAuthenticated, isRestoringSession } = useAuthStore();
  const location = useLocation();

  if (isRestoringSession) {
    return <div className="min-h-screen bg-[#07070B]" />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}
