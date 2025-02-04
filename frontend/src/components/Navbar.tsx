import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav>
      <ul className="flex p-4 gap-2 bg-green-200">
        <li>the tour diary</li>
        <li className="ml-auto">
          <Link to="/auth/login">Log in</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
