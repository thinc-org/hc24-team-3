# TO Run The App
```bash
npm i
npm run dev
```

## Adding Features
### Adding server API Logic or Function
- go to src/server/api/root.ts
```ts
// line 11
export const appRouter = createTRPCRouter({
  user: userRouter,
  event: eventRouter,
  club: clubRouter,
});
```
- Reference a code from there, each file contains a `router` controlling something
- Editing the `router` file inside src/server/api/routers to control the logic [this was Trpc Router](https://create.t3.gg/en/usage/trpc)
- For example `club.ts` which accepts `z.object({})` means accepting no input and this router then can be called using `query` (go read trpc doc) `ctx` is a params that I passed into every procedure which could be used to access the database by `ctx.db` or even access user session using `ctx.session`
```ts
// club.ts (this is server code)
import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const clubRouter = createTRPCRouter({
    getAllClub: publicProcedure.input(z.object({})).query(async ({ ctx }) => {
        return await ctx.db.clubs.findMany();
    }),
})
```
- on the client side this could then be called using `query` and some routers [could be called using `mutation` in a lot of cases](https://trpc.io/docs/v9/react-mutations)
```tsx
// src/app/clubs
"use client";
import ClubCard from "~/components/ui/cards";
import { useEffect, useState } from "react";
import { set } from "zod";
import { api } from "~/trpc/react";
import { Clubs } from "@prisma/client";

export default function Home() {
  const Rawdata = api.club.getAllClub.useQuery({}).data; // How to Use The Router
  // compute tags dynamically
  const [tags, setTags] = useState<string[]>([]);
  const [data, setData] = useState(Rawdata);
  const [TagSelected, setTagSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  function UpdateData(data: Clubs[]) {
    setData(data);
    const n_tags = data?.map((club) => club.tags)
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
    <main className="mx-auto flex w-full flex-1 flex-row px-12 md:px-44">
      <div className="w-3/4">
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
          {
            // filter clubs based on selected tag
            data?.filter((club) =>
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
              ))
          }
        </div>
      </div>
      <div className="ml-8 w-1/4">
        <div className="mt-16 rounded-lg border-2 border-gray-300 bg-white p-4">
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
```
- note that the `public` and `protected` procedures differentiation; is if the user needs to be logged in to use the router or not
- Please kept in mine that outside of calling an api using `api.[routerName].[method].[useQuery|useMutation]` one could all it using `await api.[router].[method]` in the server side (page that didn't have "use client" on top) too please read about this more in [T3 docs](https://create.t3.gg/en/introduction)
# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
