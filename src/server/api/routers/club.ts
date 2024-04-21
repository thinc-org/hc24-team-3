import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const clubRouter = createTRPCRouter({
    getAllClub: publicProcedure.input(z.object({})).query(async ({ ctx }) => {
        return await ctx.db.clubs.findMany({
            include: {
                Reviews: true,
            },
        });
    }),
    getClubById: publicProcedure.input(z.object({
        id: z.string().min(1),
    })).query(async ({ ctx, input }) => {
        const data = await ctx.db.clubs.findUnique({
            where: {
                id: input.id,
            },
            include: {
                Reviews: {
                    include: {
                        user: true,
                    },
                
                },
            },
        });
        console.log(data);
        return data;
    }),
})