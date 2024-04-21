"use client";
import { SessionProvider, signIn } from "next-auth/react";
import React, { use, useEffect } from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";

export default function SignUpPage() {
  const create_user = api.user.CreateUser.useMutation();
  const [isDone, setIsDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    create_user.mutate(
      {
        email: formData.email,
        name: formData.name,
        password: formData.password,
      },
      {
        onError: (error) => {
          setError(error.message);
          setIsDone(false);
        },
        onSuccess: () => {
          setError(null);
          setIsDone(true);
        },
      },
    );
  };

  useEffect(() => {
    const handleSignUp = async () => {
      if (isDone) {
        toast.success("Sign Up Successful!");
        // wait for 2 seconds before signing in and redirecting
        await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          callbackUrl: "/clubs",
        });
      } else if (error) {
        toast.error(error);
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    handleSignUp();
  }, [isDone, error]);

  return (
    <div className="bg-secondary flex min-h-screen flex-col items-center justify-center">
      {/* Main Content */}
      <div className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        {/* Sign Up Form */}
        <div className="border-primary m-4 w-full max-w-md rounded-2xl border-2 bg-white p-8 shadow-xl">
          <h2 className="text-primary mb-8 text-2xl font-bold">Sign Up</h2>
          {/* Full Name */}
          <input
            className="text-primary border-primary focus:bg-secondary mb-4 w-full border-b-2 p-2 outline-none"
            id="name"
            type="text"
            placeholder="Full Name"
            onChange={handleChange}
          />
          {/* Email Input */}
          <input
            className="text-primary border-primary focus:bg-secondary mb-4 w-full border-b-2 p-2 outline-none"
            id="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
          />
          {/* Password Input */}
          <input
            className="text-primary border-primary focus:bg-secondary mb-8 w-full border-b-2 p-2 outline-none"
            id="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />
          {/* Sign Up Button */}
          <button
            onClick={handleSubmit}
            className="bg-primary w-full rounded-full p-2 tracking-wider text-white"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
