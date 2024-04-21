"use client";
import ClubCard from "~/components/ui/cards";
import { useEffect, useState } from "react";
import { set } from "zod";
import { api } from "~/trpc/react";
import { Clubs } from "@prisma/client";

export default function Home() {
  const Rawdata = api.club.getAllClub.useQuery({}).data;
  // compute tags dynamically
  const [tags, setTags] = useState<string[]>([]);
  const [data, setData] = useState<Clubs[] | null>(null);
  const [TagSelected, setTagSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  function UpdateData(data: Clubs[]) {
    setData(data);
    const n_tags = data
      ?.map((club) => club.tags)
      .flat()
      .filter((tag, index, self) => self.indexOf(tag) === index); // remove duplicates
    setTags([...n_tags]);
  }

  useEffect(() => {
    if (Rawdata) {
      UpdateData(Rawdata);
    }
  }, [Rawdata]);

  return (
    <main className="mx-auto flex w-full flex-1 flex-col px-12 sm:flex-row md:px-44">
      <div className="w-full sm:w-3/4">
        {/* filter menu */}
        <div className="mt-5 flex flex-col justify-start">
          <h2 className="text-2xl font-semibold">Find Clubs</h2>
          {/* filter bar */}
          <div className="relative w-full pt-2 text-gray-600">
            <input
              className="h-10 w-full rounded-lg border-2 border-gray-300 bg-white px-5 pr-16 text-sm focus:outline-none"
              type="search"
              name="search"
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="container flex flex-col items-center justify-center py-8">
          {/* <ClubCard /> */}
          {// filter clubs based on selected tag
          data
            ?.filter((club) =>
              TagSelected.length === 0
                ? true
                : TagSelected.some((tag) => club.tags?.includes(tag)),
            )
            .filter(
              (club) =>
                club.name.toLowerCase().includes(search.toLowerCase()) ||
                club.description.toLowerCase().includes(search.toLowerCase()),
            )
            .map((club, index) => (
              <ClubCard className="mb-3" key={index} club={club} />
            ))}
        </div>
      </div>
      <div className="w-full sm:ml-8 sm:w-1/4">
        <div className="mt-2 rounded-lg border-2 border-gray-300 bg-white p-4 sm:mt-16">
          <h2 className="text-2xl font-semibold">Categories</h2>
          <div className="mt-4 flex flex-col gap-4">
            {/* checkbox components */}
            {tags?.map((tag, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-primary"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setTagSelected([...TagSelected, tag]);
                    } else {
                      setTagSelected(TagSelected.filter((t) => t !== tag));
                    }
                  }}
                />
                <span className="ml-2 text-sm">{tag}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
