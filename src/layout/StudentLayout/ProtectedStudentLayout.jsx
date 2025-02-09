import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/JWTContext";
import StudentLayout from "./index";

const ProtectedStudentLayout = () => {
    const { user, loading } = useAuth();

    if (loading) {
      return <div>Loading...</div>; // Avoid checking `user` while still loading
    }
  
    if (!user) {
      return <Navigate to="/login" replace />;
    }
  
    return <StudentLayout />;
  };

export default ProtectedStudentLayout;