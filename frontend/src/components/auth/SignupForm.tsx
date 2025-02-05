import { Link } from "react-router";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignupForm = () => {
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

  const submitForm = (data: FormData) => {
    console.log(data);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form
      className="flex flex-col pt-16 px-12 gap-4"
      onSubmit={handleSubmit(submitForm)}
    >
      <h1 className="text-2xl">Welcome!</h1>
      <div>
        <label className="block mb-1 font-bold" htmlFor="firstName">
          First Name
        </label>
        <input
          {...register("firstName")}
          id="firstName"
          className="w-full p-2 border-2 border-gray-200 rounded-sm focus:border-black focus:border-2 focus:outline-0"
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
          className="w-full p-2 border-2 border-gray-200 rounded-sm focus:border-black focus:border-2 focus:outline-0"
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
          className="w-full p-2 border-2 border-gray-200 rounded-sm focus:border-black focus:border-2 focus:outline-0"
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
          className="w-full p-2 border-2 border-gray-200 rounded-sm focus:border-black focus:border-2 focus:outline-0"
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
          className="w-full p-2 border-2 border-gray-200 rounded-sm focus:border-black focus:border-2 focus:outline-0"
          type="password"
          placeholder="Confirm your password"
        />
        {errors.confirmPassword ? (
          <p className="mt-1 text-red-500 font-bold text-sm">
            {errors.confirmPassword.message}
          </p>
        ) : null}
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
