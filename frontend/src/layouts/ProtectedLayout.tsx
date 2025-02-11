import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

const ProtectedLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default ProtectedLayout;
