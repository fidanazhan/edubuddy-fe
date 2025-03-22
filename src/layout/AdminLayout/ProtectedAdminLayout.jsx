import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/JWTContext.jsx";

const AdminProtectedRoute = () => {
  const { user, loading } = useAuth();
  const [isLargeScreen, setIsLargeScreen] = useState(true); // Default to true to avoid flicker

  useEffect(() => {
    const checkScreenSize = () => setIsLargeScreen(window.innerWidth >= 768);

    checkScreenSize(); // Check on mount
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          {/* Animated Spinner */}
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Redirect non-admin users
  if (!user || user.roles !== "ADMIN") {
    return <Navigate to="/forbidden" replace />;
  }

  // Redirect admin users if they are on mobile (screen width < 768px)
  // if (!isLargeScreen) {
  //   return <Navigate to="/forbidden" replace />;
  // }

  return <Outlet />;
};

export default AdminProtectedRoute;
