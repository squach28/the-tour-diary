import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  return loading ? null : isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/login" />
  );
};

export default ProtectedRoute;
