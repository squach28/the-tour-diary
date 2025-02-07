import { Link } from "react-router";

const LoginForm = () => {
  return (
    <form className="flex flex-col gap-4">
      <h1 className="text-2xl">Welcome back!</h1>
      <div>
        <label className="block mb-1 font-bold" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          className="w-full p-2 border-2 border-gray-200 rounded-sm focus:border-black focus:border-2 focus:outline-0"
          type="email"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label className="block mb-1 font-bold" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          className="w-full p-2 border-2 border-gray-200 rounded-sm focus:border-black focus:border-2 focus:outline-0"
          type="password"
          placeholder="Enter your password"
        />
      </div>
      <Link className="text-sm" to="/auth/resetPassword">
        Forgot Password?
      </Link>
      <button className="bg-blue-500 text-white p-2 rounded-md" type="submit">
        Log in
      </button>
      <p className="text-center">
        Don't have an account?{" "}
        <Link className="text-blue-500 font-bold" to="/auth/signup">
          Sign up
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
