import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <nav>
      <ul className="flex p-4 gap-2 bg-green-200">
        <li className="font-bold">
          <Link to="/">the tour diary</Link>
        </li>
        {isAuthenticated && user ? (
          <li className="ml-auto" onClick={handleLogout}>
            {user.id.slice(0, 5)}
          </li>
        ) : (
          <li className="ml-auto">
            <Link to="/auth/login">Log in</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
