import { Link, useNavigate } from "react-router";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type UserData = {
  firstName: String;
  lastName: string;
  email: string;
  password: string;
};

const SignupForm = () => {
  const [error, setError] = useState<string | null>(null); // represents an error from server
  const navigate = useNavigate();
  const { login } = useAuth();

  const schema: ZodType<FormData> = z
    .object({
      firstName: z.string().nonempty({ message: "First name is required" }),
      lastName: z.string().nonempty({ message: "Last name is required" }),
      email: z.string().email({ message: "Email is not valid" }),
      password: z
        .string()
        .min(6, { message: "Password must have at least 6 characters" }),
      confirmPassword: z
        .string()
        .min(6, { message: "Password must have at least 6 characters" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const submitForm = async (data: FormData) => {
    const userData: UserData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    };
    try {
      const signUpResponse = await signUp(userData);

      if (signUpResponse !== null) {
        const credentials = {
          email: data.email,
          password: data.password,
        };
        const loginResponse = await login(credentials);
        console.log(loginResponse);
        navigate("/dashboard", { replace: true });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const signUp = async (data: UserData) => {
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/signup`,
        data
      );
      return result;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response) {
          setError(e.response.data.message);
        }
      }
      return null;
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(submitForm)}>
      <h1 className="text-2xl">Welcome!</h1>
      <div>
        <label className="block mb-1 font-bold" htmlFor="firstName">
          First Name
        </label>
        <input
          {...register("firstName")}
          id="firstName"
          className={`w-full p-2 border-2 border-gray-200 rounded-sm focus:border-black focus:border-2 focus:outline-0 ${
            errors.firstName ? "border-red-400" : ""
          }`}
          type="text"
          placeholder="Enter your first name"
        />
        {errors.firstName ? (
          <p className="mt-1 text-red-500 font-bold text-sm">
            {errors.firstName.message}
          </p>
        ) : null}
      </div>
      <div>
        <label className="block mb-1 font-bold" htmlFor="lastName">
          Last Name
        </label>
        <input
          {...register("lastName")}
          id="lastName"
          className={`w-full p-2 border-2 border-gray-200 rounded-sm focus:border-black focus:border-2 focus:outline-0 ${
            errors.lastName ? "border-red-400" : ""
          }`}
          type="text"
          placeholder="Enter your last name"
        />
        {errors.lastName ? (
          <p className="mt-1 text-red-500 font-bold text-sm">
            {errors.lastName.message}
          </p>
        ) : null}
      </div>
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
            errors.password ? "border-red-400" : ""
          }`}
          type="password"
          placeholder="Enter your password"
        />
        {errors.password ? (
          <p className="mt-1 text-red-500 font-bold text-sm">
            {errors.password.message}
          </p>
        ) : null}
      </div>
      <div>
        <label className="block mb-1 font-bold" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          {...register("confirmPassword")}
          id="confirmPassword"
          className={`w-full p-2 border-2 border-gray-200 rounded-sm focus:border-black focus:border-2 focus:outline-0 ${
            errors.confirmPassword ? "border-red-400" : ""
          }`}
          type="password"
          placeholder="Confirm your password"
        />
        {errors.confirmPassword ? (
          <p className="mt-1 text-red-500 font-bold text-sm">
            {errors.confirmPassword.message}
          </p>
        ) : null}
      </div>
      {error ? (
        <p className="mt-1 text-red-500 font-bold text-sm">{error}</p>
      ) : null}
      <button
        className="bg-blue-500 text-white p-2 rounded-md"
        type="submit"
        disabled={isSubmitting}
      >
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
