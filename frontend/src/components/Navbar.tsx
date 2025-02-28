import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const [showSideNavBar, setShowSideNavBar] = useState(false);

  const toggleSideNavBar = () => {
    setShowSideNavBar((prev) => !prev);
  };

  return (
    <nav>
      <ul className="flex p-4 gap-2 bg-green-200">
        <li className="font-bold">
          <Link to="/">the tour diary</Link>
        </li>
        {isAuthenticated && user ? (
          <li
            className="ml-auto hover:cursor-pointer"
            onClick={toggleSideNavBar}
          >
            {user.id.slice(0, 5)}
          </li>
        ) : (
          <li className="ml-auto">
            <Link to="/auth/login">Log in</Link>
          </li>
        )}
      </ul>
      {showSideNavBar ? (
        <div
          className="fixed h-full inset-0 bg-black opacity-75 transition-all duration-500 z-1"
          onClick={toggleSideNavBar}
        ></div>
      ) : null}
      <SideNavBar
        showSideNavBar={showSideNavBar}
        toggleSideNavBar={toggleSideNavBar}
      />
    </nav>
  );
};

const SideNavBar = ({
  showSideNavBar,
  toggleSideNavBar,
}: {
  showSideNavBar: boolean;
  toggleSideNavBar: () => void;
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };
  return (
    <ul
      className={`min-w-48 w-1/4 max-w-72 h-full fixed top-0 right-0 p-4 bg-white shadow-md z-1 transition-transform duration-300 ${
        showSideNavBar ? "translate-x-0" : "translate-x-full"
      } text-center`}
    >
      <li>{user ? `Hi, ${user.id.slice(0, 5)}!` : "Loading..."}</li>
      <li>
        <Link to="/profile" onClick={toggleSideNavBar}>
          Profile
        </Link>
      </li>
      <li className="cursor-pointer" onClick={handleLogout}>
        Log out
      </li>
    </ul>
  );
};

export default Navbar;
