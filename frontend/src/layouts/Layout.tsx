import { Navigate, Outlet } from "react-router";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
