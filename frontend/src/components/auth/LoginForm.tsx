import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z, ZodType } from "zod";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

type FormData = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const schema: ZodType<FormData> = z.object({
    email: z.string().email(),
    password: z.string().nonempty({ message: "Password is required" }),
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const submitForm = async (data: FormData) => {
    try {
      const response = await login(data);

      if (response !== null) {
        navigate("/dashboard", { replace: true });
      } else {
        setError("Incorrect password");
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(submitForm)}>
      <h1 className="text-2xl">Welcome back!</h1>
      <div>
        <label className="block mb-1 font-bold" htmlFor="email">
          Email
        </label>
        <input
          {...register("email")}
          id="email"
          className={`w-full p-2 border-2 border-gray-200 rounded-sm focus:border-black focus:border-2 focus:outline-0 ${
            errors.email ? "border-red-400" : ""
          }`}
          type="email"
          placeholder="Enter your email"
        />
        {errors.email ? (
          <p className="mt-1 text-red-500 font-bold text-sm">
            {errors.email.message}
          </p>
        ) : null}
      </div>
      <div>
        <label className="block mb-1 font-bold" htmlFor="password">
          Password
        </label>
        <input
          {...register("password")}
          id="password"
          className={`w-full p-2 border-2 border-gray-200 rounded-sm focus:border-black focus:border-2 focus:outline-0 ${
            errors.email ? "border-red-400" : ""
          }`}
          type="password"
          placeholder="Enter your password"
        />
        {errors.password ? (
          <p className="mt-1 text-red-500 font-bold text-sm">
            {errors.password.message}
          </p>
        ) : null}
        {error ? (
          <p className="mt-1 text-red-500 font-bold text-sm">{error}</p>
        ) : null}
      </div>
      <Link className="text-sm inline-block mr-auto" to="/auth/resetPassword">
        Forgot Password?
      </Link>
      <button
        className="bg-blue-500 text-white p-2 rounded-md"
        type="submit"
        disabled={isSubmitting}
      >
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
