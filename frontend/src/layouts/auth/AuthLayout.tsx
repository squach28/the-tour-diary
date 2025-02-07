import { Link, Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="min-h-screen">
      <Link className="block font-bold text-lg p-4" to="/">
        the tour diary
      </Link>
      <main className="pt-6 pb-6 px-12">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
