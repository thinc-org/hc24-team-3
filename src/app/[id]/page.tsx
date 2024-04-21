import { api } from "~/trpc/server";
import { IoIosArrowBack } from "react-icons/io";
import Markdown from "react-markdown";
import Link from "next/link";
import { TfiAlarmClock } from "react-icons/tfi";

export default async function EventAtID({
  params,
}: {
  params: { id: string };
}) {
  const data = await api.event.getEventById({ id: params.id });
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
          <div className="flex flex-row gap-5 item">
            <button type="button" className="text-white bg-primary border border-gray-300 focus:outline-none hover:bg-rose-400 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 flex flex-row gap-2 items-center">
              Remind me
              <TfiAlarmClock className="text-white"/>
            </button>
          </div>
          <Markdown>{data?.fullMarkdownDescription}</Markdown>
        </div>
      </section>
    </main>
  );
}
