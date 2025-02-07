import { Link, Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <div className="min-h-screen">
      <Link className="inline-block font-bold text-lg p-4" to="/">
        the tour diary
      </Link>
      <main className="pt-6 pb-6 px-12">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
