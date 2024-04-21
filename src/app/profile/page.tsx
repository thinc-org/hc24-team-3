"use client";
import { api } from "~/trpc/react";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import ClubCard, { EventCard } from "~/components/ui/cards";
import SignInPage from "../auth/signin/page";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Profile() {
  const user = api.user.MyInfo.useQuery({});
  const router = useRouter();
  useEffect(() => {
    if (user.status != "pending" && !user.data) {
      router.push("/auth/signin");
    }
  }, [user]);

  return (
    <main className="container mx-auto px-4">
      <div className="flex items-center justify-between py-8">
        {/* back button */}
        <div className="flex shrink-0 items-center justify-end">
          <Link href="/" passHref>
            <IoIosArrowBack className="cursor-pointer text-5xl transition-transform duration-200 ease-in-out hover:scale-125" />
          </Link>
        </div>
        {/* title centered */}
        <h1
          onClick={() => {
            console.log(user.data);
          }}
          className="shrink rounded-lg bg-primary px-6 py-3 text-center text-3xl font-bold text-secondary shadow-md"
        >
          Your Profile
        </h1>
        {/* empty div for spacing */}
        <div className="shrink-0"></div>
      </div>
      {/* Favorite Clubs */}
      <div className="mt-8 flex w-full flex-col items-start justify-start">
        <h2 className="mb-4 text-left text-3xl font-semibold text-primary">
          Favorite Clubs
        </h2>
        {user.data ? (
          <>
            {user.data.interestedIn.length > 0 ? (
              <div className="w-full space-y-4">
                {user?.data?.interestedIn.map((club, index) => (
                  <ClubCard
                    key={index}
                    club={club}
                    className="w-full"
                    removeFavorite={true}
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-96 w-full items-center justify-center text-5xl">
                <p>No favorite clubs yet</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-96 w-full items-center justify-center text-5xl">
            <AiOutlineLoading3Quarters className="animate-spin text-primary" />
          </div>
        )}
      </div>

      {/* Favorite Events */}
      <div className="mt-8 flex w-full flex-col items-start justify-start">
        <h2 className="mb-4 text-left text-3xl font-semibold text-primary">
          Favorite Events
        </h2>
        {user.data ? (
          <>
            {user.data.interestedIn.length > 0 ? (
              <div className="w-full space-y-4">
                {user?.data?.interestedInEvent.map((event, index) => (
                  <EventCard key={index} event={event} removeFavorite={true} />
                ))}
              </div>
            ) : (
              <div className="flex h-96 w-full items-center justify-center text-5xl">
                <p>No favorite events yet</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-96 w-full items-center justify-center text-5xl">
            <AiOutlineLoading3Quarters className="animate-spin text-primary" />
          </div>
        )}
      </div>
    </main>
  );
}
