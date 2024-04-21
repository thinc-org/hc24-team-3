"use client";
import Link from "next/link";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { EventCard } from "~/components/ui/cards";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/react";

export default function Home() {
  // const session = await getServerAuthSession();
  const events = api.event.getAllEvents.useQuery({}).data;
  return (
    <main className="container mx-auto px-4">
      <div id="alert-5" className="flex items-center p-4 rounded-lg bg-primary" role="alert">
        <span className="sr-only">Info</span>
        <div className="ms-3 text-sm font-medium text-white">
          Get ready for another colorful April with the return of <a href="/fefab2df-75b0-493a-98d0-9ddcefcbd289" className="font-semibold underline hover:no-underline">SEE U Fest</a>! 🧡 Join us for a vibrant summer music festival!
        </div>
        <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-gray-50 text-gray-500 rounded-lg focus:ring-2 focus:ring-gray-400 p-1.5 hover:bg-gray-200 inline-flex items-center justify-center h-8 w-8" data-dismiss-target="#alert-5" aria-label="Close">
          <span className="sr-only">Dismiss</span>
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
        </button>
      </div>
      <h1 className="mb-4 mt-5 text-center text-3xl font-semibold tracking-tight sm:text-[3rem] md:mb-12 md:mt-14">
        Interesting <span className="text-primary">Events</span>
      </h1>
      <div className="container mt-5 flex flex-col items-center justify-center px-4 py-8 md:mt-6">
        {/* <EventCard /> */}
        {events ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events?.map((event, index) => (
              <EventCard key={index} event={event} />
            ))}
          </div>
        ) : (
          <div className="flex h-96 w-full items-center justify-center text-5xl">
            <AiOutlineLoading3Quarters className="animate-spin text-primary" />
          </div>
        )}
      </div>
    </main>
  );
}
