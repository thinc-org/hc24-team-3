"use client";
import { api } from "~/trpc/react";
import { IoIosArrowBack } from "react-icons/io";
import Markdown from "react-markdown";
import Link from "next/link";
import { ReviewCard } from "~/components/ui/cards";
import { useState } from "react";
import { toast } from "sonner";

type Review = {
  rating: number | null;
  comment: string | null;
};

export default function EventAtID({ params }: { params: { id: string } }) {
  const data = api.club.getClubById.useQuery({ id: params.id }).data;
  const [review, setReview] = useState<Review>({
    rating: null,
    comment: null,
  });
  const AddReview = api.user.AddReviewToClub.useMutation();

  function SubmitReview() {
    if (!review.rating || !review.comment || !data?.id) {
      return;
    }
    AddReview.mutate(
      {
        rating: review.rating,
        comment: review.comment,
        clubId: data?.id,
      },
      {
        onError: (error) => {
          toast.error(error.message);
        },
        onSuccess: () => {
          toast.success("Review Added");
          // reload the page
          document.location.reload();
        },
      },
    );
  }

  if (!data) {
    return <div>Not Found</div>;
  }
  return (
    <main className="container mx-auto px-4">
      <div className="flex items-center justify-between py-8">
        {/* back button */}
        <div className="flex flex-grow-0 items-center justify-end">
          <Link href="/" passHref>
            <IoIosArrowBack className="transform cursor-pointer text-5xl transition hover:scale-125 hover:cursor-pointer" />
          </Link>
        </div>
        {/* title centered */}
        <h1 className="max-w-sm flex-grow rounded-lg bg-primary px-6 py-3 text-center text-3xl font-bold text-secondary">
          {data?.name}
        </h1>
        {/* empty div for spacing */}
        <div className="flex-grow-0"></div>
      </div>
      {/* content */}
      <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <img src={data?.image} alt={data?.name} className="rounded-lg" />
        <div className="prose">
          <Markdown>{data?.fullMarkdownDescription}</Markdown>
        </div>
      </section>
      {/* write review */}
      <section className="mt-12 grid grid-cols-1 gap-8">
        <h2 className="text-2xl font-bold text-primary">Write a Review</h2>
        <div className="grid grid-cols-1 gap-4">
          <label>
            <span className="text-primary">Rating</span>
            <input
              onChange={(e) =>
                setReview({ ...review, rating: parseInt(e.target.value) })
              }
              type="number"
              min={1}
              max={5}
              required
              className="w-full rounded-lg border-2 border-primary p-2"
            />
          </label>
          <label>
            <span className="text-primary">Comment</span>
            <textarea
              required
              onChange={(e) =>
                setReview({ ...review, comment: e.target.value })
              }
              className="w-full rounded-lg border-2 border-primary p-2"
            />
          </label>
          <button
            onClick={SubmitReview}
            className="rounded-lg border-2 border-primary bg-primary p-2 text-secondary"
          >
            Submit
          </button>
        </div>
      </section>
      {/* reviews */}
      <section className="mb-12 mt-2 grid grid-cols-1 gap-8">
        <h2 className="text-2xl font-bold text-primary">Reviews</h2>
        <div className="grid grid-cols-1 gap-4">
          {data?.Reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>
    </main>
  );
}
