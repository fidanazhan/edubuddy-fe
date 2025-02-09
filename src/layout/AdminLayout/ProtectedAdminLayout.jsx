import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/JWTContext.jsx";

const AdminProtectedRoute = () => {
  const { user, loading } = useAuth();

  // If data is still loading, display a loading spinner or prevent access
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

  if (!user || user.roles !== "ADMIN") {
    return <Navigate to="/forbidden" replace />; // Redirect non-admins to forbidden page
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
