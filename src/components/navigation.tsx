"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
export default function Navbar() {
  const [current_url, set_current_url] = useState<string | null>(null);
  useEffect(() => {
    set_current_url(window.location.href);
  }, []);
  const session = useSession();

  return (
    <header className="flex flex-row items-center bg-secondary p-4">
      {/* navigation */}
      <h1 className="text-2xl font-bold text-primary">
        <a href="/">CU Act</a>
      </h1>
      {/* center */}
      <nav className="flex flex-1 items-center justify-center align-middle text-base font-semibold text-black">
        <a
          className={twMerge(
            "mx-1 text-center sm:mx-4",
            current_url?.endsWith("/about") && "text-primary",
          )}
          href="/about"
        >
          About Us
        </a>
        <a
          className={twMerge(
            "mx-1 text-center sm:mx-4",
            current_url?.includes("/clubs") && "text-primary",
          )}
          href="/clubs"
        >
          Clubs
        </a>
      </nav>

      {/* on the right */}
      <button className="rounded-full bg-primary px-3 py-1.5 text-white">
        <a
          href={
            session.status != "loading"
              ? session.data?.user
                ? "/profile"
                : "/auth/signin"
              : "#"
          }
        >
          {current_url && session.status != "loading" ? (
            <>{session.data?.user ? session.data?.user.name : "Login"}</>
          ) : (
            <div className="flex h-6 w-6 items-center justify-center text-secondary">
              <AiOutlineLoading3Quarters className="animate-spin" />
            </div>
          )}
        </a>
      </button>
    </header>
  );
}
