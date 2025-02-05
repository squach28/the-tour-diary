import { Link } from "react-router";

const SignupForm = () => {
  return (
    <form className="flex flex-col pt-16 px-12 gap-4">
      <h1 className="text-2xl">Welcome!</h1>
      <div>
        <label className="block mb-1 font-bold" htmlFor="firstName">
          First Name
        </label>
        <input
          id="firstName"
          className="w-full p-2 border-2 border-gray-200 rounded-sm focus:border-black focus:border-2 focus:outline-0"
          type="text"
          placeholder="Enter your first name"
        />
      </div>
      <div>
        <label className="block mb-1 font-bold" htmlFor="lastName">
          Last Name
        </label>
        <input
          id="lastName"
          className="w-full p-2 border-2 border-gray-200 rounded-sm focus:border-black focus:border-2 focus:outline-0"
          type="text"
          placeholder="Enter your last name"
        />
      </div>
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
      <div>
        <label className="block mb-1 font-bold" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          className="w-full p-2 border-2 border-gray-200 rounded-sm focus:border-black focus:border-2 focus:outline-0"
          type="password"
          placeholder="Confirm your password"
        />
      </div>
      <button className="bg-blue-500 text-white p-2 rounded-md" type="submit">
        Sign up
      </button>
      <p className="text-center">
        Already have an account?{" "}
        <Link className="text-blue-500 font-bold" to="/auth/login">
          Log in
        </Link>
      </p>
    </form>
  );
};

export default SignupForm;
