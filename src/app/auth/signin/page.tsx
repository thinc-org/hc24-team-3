"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { toast } from "sonner";

export default function SignInPage() {
  const session = useSession();
  const [isDone, setIsDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    if (isDone) {
      toast.success("Sign In Successful!");
    } else if (error) {
      toast.error(error);
    }
  }, [isDone, error]);

  return (
    <div className="bg-secondary flex min-h-screen flex-col items-center justify-center">
      {/* Main Content */}
      <div className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        {session.data?.user ? (
          <div className="bg-secondary border-primary m-4 w-full max-w-xs rounded-2xl border-2 p-8">
            <h2 className="text-primary mb-2 text-2xl font-bold">Sign In</h2>
            <p className="text-black">You are already signed in.</p>
            <button
              className="bg-primary mt-4 w-full rounded-full p-2 tracking-wider text-white"
              onClick={async () => {
                await signOut();
                toast.success("Signed Out!");
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="border-primary m-4 w-full max-w-md rounded-2xl border-2 bg-white p-8 shadow-xl">
            <h2 className="text-primary mb-8 text-2xl font-bold">Sign In</h2>
            {/* Email Input */}
            <input
              id="email"
              className="text-primary border-primary focus:bg-secondary mb-4 w-full border-b-2 p-2 outline-none"
              type="email"
              placeholder="Email"
              onChange={handleChange}
            />
            {/* Password Input */}
            <input
              id="password"
              className="text-primary border-primary focus:bg-secondary mb-8 w-full border-b-2 p-2 outline-none"
              type="password"
              placeholder="Password"
              onChange={handleChange}
            />
            <div className="mb-4 flex flex-row items-center justify-between">
              {/* no account? */}
              <a className="text-black" href="/auth/signup">
                Have no account?{" "}
                <span className="text-primary ml-1 underline">Sign Up</span>
              </a>
            </div>
            {/* Sign In Button */}
            <button
              onClick={async () => {
                console.log(formData);
                const result = await signIn("credentials", {
                  email: formData.email,
                  password: formData.password,
                  redirect: false,
                });
                console.log(result);
              }}
              className="bg-primary w-full rounded-full p-2 tracking-wider text-white"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
