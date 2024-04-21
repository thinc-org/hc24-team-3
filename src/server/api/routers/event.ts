import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const eventRouter = createTRPCRouter({
    getAllEvents: publicProcedure.input(z.object({})).query(async ({ ctx }) => {
        return await ctx.db.event.findMany();
    }),
    getEventById: publicProcedure.input(z.object({
        id: z.string().min(1),
    })).query(async ({ ctx, input }) => {
        const data = await ctx.db.event.findUnique({
            where: {
                id: input.id,
            },
        });
        console.log(data);
        return data;
    }),
})