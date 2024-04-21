import { FaRegCalendarAlt } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import Image from "next/image";
import { Clubs, Event, Review } from "@prisma/client";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import SignInPage from "~/app/auth/signin/page";

interface EventCardProps {
  event?: Event;
  className?: string;
  removeFavorite?: boolean;
}

function IsToday(date: Date) {
  const now = new Date(); // not accounted time
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

function ComputeDateText(start: Date, end: Date) {
  const now = new Date();
  const startText = IsToday(start) ? "Today" : start.toDateString();
  const endText = IsToday(end) ? "Today" : end.toDateString();
  return `${startText} - ${endText}`;
}

function DaysLeft(end: Date) {
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
  const endDate = new Date(end);
  const diffDays = Math.round((endDate.getTime() - now.getTime()) / oneDay);
  return diffDays;
}

export function EventCard(props: EventCardProps) {
  const { event } = props;
  const addToFav = api.user.AddInterestedEvent.useMutation();
  const removeFromFav = api.user.RemoveInterestedEvent.useMutation();
  function TriggerAddToFav() {
    if (!props.event?.id) {
      toast.error("Failed to add to favorites - no club id");
      return;
    }
    addToFav.mutate(
      { eventId: props.event?.id },
      {
        onSuccess: () => {
          toast.success(`${props.event?.name ?? "Event"} Added to favorites`);
        },
        onError: (error) => {
          toast.error("Failed to add to favorites - " + error.message);
        },
      },
    );
  }

  function TriggerRemoveFromFav() {
    if (!props.event?.id) {
      toast.error("Failed to remove from favorites - no event id");
      return;
    }
    removeFromFav.mutate(
      { eventId: props.event?.id },
      {
        onSuccess: () => {
          toast.success(
            `${props.event?.name ?? "Event"} Removed from favorites`,
          );
          // reload page
          location.reload();
        },
        onError: (error) => {
          toast.error("Failed to remove from favorites - " + error.message);
        },
      },
    );
  }
  const daysLeft = DaysLeft(event?.endDate ?? new Date());
  return (
    <a
      href={`/${event?.id}`}className={`group max-w-sm cursor-pointer overflow-hidden rounded-2xl bg-secondary shadow-2xl transition-transform duration-500 ease-in-out hover:scale-105 ${props.className}`}
    >
      <div className="hidden hover:block group-hover:block absolute right-3 top-3 rounded-xl bg-primary px-2.5 py-1.5 text-white ">
        {daysLeft > 0 ? `~${daysLeft} days left` : "Event ended"}
      </div>
      <img
        className="h-56 w-full object-cover"
        src={
          event?.image ??
          "https://jandevents.com/wp-content/uploads/jand-party.jpg"
        }
        alt="Sunset in the mountains"
      />
      {/* meta */}
      <div className="px-6 py-2">
        <div className="mb-2 text-lg font-bold text-black">
          {event?.name ?? "Event"}
        </div>
        {/* fixed height */}
        <p className="h-20 overflow-hidden text-base text-gray-700">
          {event?.description ??
            "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat earum quod suscipit itaque sunt, aliquid nobis atque ratione assumenda."}
        </p>
        {/* date */}
        <div className="mt-4 flex items-center justify-start text-primary">
          <FaRegCalendarAlt className="text-primary" />
          <p className="ml-2">
            {ComputeDateText(
              event?.startDate ?? new Date(),
              event?.endDate ?? new Date(),
            )}
          </p>
        </div>
      </div>
      {/* Mark Interesed at the bottom */}
      {props.removeFavorite ? (
        <div className="flex w-full items-end justify-end">
          <div className="flex w-full items-end justify-end px-6 py-4">
            <button
              onClick={TriggerRemoveFromFav}
              className="flex w-full flex-row items-center justify-center rounded-md bg-primary p-2 px-2 text-secondary transition-transform duration-500 ease-in-out hover:scale-110 sm:px-3 sm:py-2"
            >
              <FaHeart className="text-white" />
              <p className="ml-2 text-start">Remove From Interested</p>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex w-full items-end justify-end">
          <div className="flex w-full items-end justify-end px-6 py-4">
            <button
              onClick={TriggerAddToFav}
              className="flex w-full flex-row items-center justify-center rounded-md bg-primary p-2 px-2 text-secondary transition-transform duration-500 ease-in-out hover:scale-110 sm:px-3 sm:py-2"
            >
              <FaHeart className="text-white" />
              <p className="ml-2 text-start">Interested</p>
            </button>
          </div>
        </div>
      )}
    </a>
  );
}
interface ClubCardProps {
  club?: Clubs;
  className?: string;
  removeFavorite?: boolean;
}

export default function ClubCard(props: ClubCardProps) {
  const addToFav = api.user.AddInterestedClub.useMutation();
  const removeFromFav = api.user.RemoveInterestedClub.useMutation();
  function TriggerAddToFav() {
    if (!props.club?.id) {
      toast.error("Failed to add to favorites - no club id");
      return;
    }
    addToFav.mutate(
      { clubId: props.club?.id },
      {
        onSuccess: () => {
          toast.success(`${props.club?.name ?? "Club"} Added to favorites`);
        },
        onError: (error) => {
          toast.error("Failed to add to favorites - " + error.message);
        },
      },
    );
  }

  function TriggerRemoveFromFav() {
    if (!props.club?.id) {
      toast.error("Failed to remove from favorites - no club id");
      return;
    }
    removeFromFav.mutate(
      { clubId: props.club?.id },
      {
        onSuccess: () => {
          toast.success(`${props.club?.name ?? "Club"} Removed from favorites`);
          // reload page
          location.reload();
        },
        onError: (error) => {
          toast.error("Failed to remove from favorites - " + error.message);
        },
      },
    );
  }

  return (
    <div
      className={`flex w-full overflow-hidden rounded border-2 border-gray-300 bg-secondary transition-transform duration-500 ease-in-out hover:scale-105 ${props.className}`}
    >
      {/* meta */}
      
        <a href={`clubs/${props.club?.id}`} className="flex w-3/4 flex-col">
          <div className="pt-6 px-3 py-2 sm:px-6">
            <div className="mb-2 text-lg font-bold text-black">
              {props.club?.name ?? "Club"}
            </div>
            <p className="text-base text-gray-700">
              {props.club?.description ??
                "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat earum quod suscipit itaque sunt, aliquid nobis atque ratione assumenda."}
            </p>
          </div>
          {/* tags */}
          <div className="px-3 py-2 sm:px-6">
            {props.club?.tags?.map((tag, index) => (
              <span
                key={index}
                className="m-0.5 inline-block rounded-full bg-gray-200 px-1 py-1 text-sm font-semibold text-gray-700 sm:mr-2 sm:px-3"
              >
                {tag}
              </span>
            ))}
          </div>
        </a>
        {/* image */}
        <div className="w-2/4 px-1 sm:w-1/4 sm:px-2">
          <div className="flex h-full w-full flex-col items-end justify-center py-4">
            <div className=" pr-5 flex flex-col items-center justify-center">
              <Image
                className="rounded-full"
                src={
                  props.club?.image ??
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="club"
                width={100}
                height={100}
              />
             
              <button
                className="mt-3 flex flex-row items-center justify-center rounded-md bg-primary p-2 px-2 text-secondary transition-transform duration-500 ease-in-out hover:scale-110 sm:px-3 sm:py-2"
                onClick={
                  props.removeFavorite ? TriggerRemoveFromFav : TriggerAddToFav
                }
              >
                {props.removeFavorite ? (
                  <FaHeart className="text-secondary" />
                ) : (
                  <FaHeart className="text-white" />
                )}
                <p className="ml-2 text-start">
                  {props.removeFavorite ? "Remove" : "Interested"}
                </p>
              </button>
            </div>
          </div>
        </div>
      
    </div>
    // </a>
  );
}

interface ReviewCardProps {
  review: Review;
  className?: string;
}

export function ReviewCard(props: ReviewCardProps) {
  const { review } = props;
  const ratingComponent = Array.from({ length: 5 }, (_, index) => (
    <svg
      key={index}
      className={`h-4 w-4 text-${
        review.rating && review.rating > index
          ? "text-yellow-300 dark:text-yellow-300"
          : "text-gray-300 dark:text-gray-300"
      }`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 22 20"
    >
      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
    </svg>
  ));
  return (
    <div
      className={`flex w-full overflow-hidden rounded border-2 border-gray-300 bg-secondary transition-transform duration-500 ease-in-out hover:scale-105 ${props.className}`}
    >
      {/* meta */}
      <div className="flex w-3/4 flex-col">
        <div className="px-3 py-2 sm:px-6">
          <div className="mb-2 text-lg font-bold text-black">Anonymous</div>
          <p className="text-base text-gray-700">
            {review.comment ??
              "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat earum quod suscipit itaque sunt, aliquid nobis atque ratione assumenda."}
          </p>
        </div>
        {/* rating */}
        <div className="px-3 py-2 sm:px-6">
          <div className="flex items-center">
            {ratingComponent}
            <span className="ml-2 text-gray-700">{review.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
