import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    CreateUser: publicProcedure.input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6),
    })).mutation(async ({ ctx, input }) => {
        return ctx.db.user.create({
            data: {
                name: input.name,
                email: input.email,
                password: input.password,
            }
        });
    }),
    MyInfo: protectedProcedure.input(z.object({})).query(async ({ ctx }) => {
        return ctx.db.user.findUnique({
            where: {
                id: ctx.session.user.id,
            },
            include: {
                interestedIn: true,
                interestedInEvent: true,
            },
        });
    }),
    AddInterestedClub: protectedProcedure.input(z.object({
        clubId: z.string().min(1),
    })).mutation(async ({ ctx, input }) => {
        console.log("Adding club to favorites");
        console.log(input);
        console.log(ctx.session.user);
        const club = await ctx.db.clubs.findUnique({
            where: {
                id: input.clubId,
            },
        });
        if (!club) {
            throw new Error("Club not found");
        }
        // ensure not already in favorites
        const user = await ctx.db.user.findUnique({
            where: {
                id: ctx.session.user.id,
            },
            include: {
                interestedIn: true,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        else if (user.interestedIn.some((c) => c.id === club.id)) {
            throw new Error("This club is already in your favorites");
        }
        const result = await ctx.db.user.update({
            where: {
                id: ctx.session.user.id,
            },
            data: {
                interestedIn: {
                    connect: {
                        id: club?.id,
                    },
                },
            }
        });
        if (!result) {
            throw new Error("Failed to add to favorites");
        }
        return result;
    }),
    RemoveInterestedClub: protectedProcedure.input(z.object({
        clubId: z.string().min(1),
    })).mutation(async ({ ctx, input }) => {
        console.log("Removing club from favorites");
        console.log(input);
        console.log(ctx.session.user);
        const club = await ctx.db.clubs.findUnique({
            where: {
                id: input.clubId,
            },
        });
        if (!club) {
            throw new Error("Club not found");
        }
        // ensure in favorites
        const user = await ctx.db.user.findUnique({
            where: {
                id: ctx.session.user.id,
            },
            include: {
                interestedIn: true,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        else if (!user.interestedIn.some((c) => c.id === club.id)) {
            throw new Error("This club is not in your favorites");
        }
        const result = await ctx.db.user.update({
            where: {
                id: ctx.session.user.id,
            },
            data: {
                interestedIn: {
                    disconnect: {
                        id: club?.id,
                    },
                },
            }
        });
        if (!result) {
            throw new Error("Failed to remove from favorites");
        }
        return result;
    }),
    AddInterestedEvent: protectedProcedure.input(z.object({
        eventId: z.string().min(1),
    })).mutation(async ({ ctx, input }) => {
        console.log("Adding event to favorites");
        console.log(input);
        console.log(ctx.session.user);
        const event = await ctx.db.event.findUnique({
            where: {
                id: input.eventId,
            },
        });
        if (!event) {
            throw new Error("Event not found");
        }
        // ensure not already in favorites
        const user = await ctx.db.user.findUnique({
            where: {
                id: ctx.session.user.id,
            },
            include: {
                interestedInEvent: true,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        else if (user.interestedInEvent.some((e) => e.id === event.id)) {
            throw new Error("This event is already in your favorites");
        }
        const result = await ctx.db.user.update({
            where: {
                id: ctx.session.user.id,
            },
            data: {
                interestedInEvent: {
                    connect: {
                        id: event?.id,
                    },
                },
            }
        });
        if (!result) {
            throw new Error("Failed to add to favorites");
        }
        return result;
    }),
    RemoveInterestedEvent: protectedProcedure.input(z.object({
        eventId: z.string().min(1),
    })).mutation(async ({ ctx, input }) => {
        console.log("Removing event from favorites");
        console.log(input);
        console.log(ctx.session.user);
        const event = await ctx.db.event.findUnique({
            where: {
                id: input.eventId,
            },
        });
        if (!event) {
            throw new Error("Event not found");
        }
        // ensure in favorites
        const user = await ctx.db.user.findUnique({
            where: {
                id: ctx.session.user.id,
            },
            include: {
                interestedInEvent: true,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        else if (!user.interestedInEvent.some((e) => e.id === event.id)) {
            throw new Error("This event is not in your favorites");
        }
        const result = await ctx.db.user.update({
            where: {
                id: ctx.session.user.id,
            },
            data: {
                interestedInEvent: {
                    disconnect: {
                        id: event?.id,
                    },
                },
            }
        });
        if (!result) {
            throw new Error("Failed to remove from favorites");
        }
        return result;
    }),
    AddReviewToClub: protectedProcedure.input(z.object({
        clubId: z.string().min(1),
        rating: z.number().min(1).max(5),
        comment: z.string().min(1),
    })).mutation(async ({ ctx, input }) => {
        console.log("Adding review to club");
        console.log(input);
        console.log(ctx.session.user);
        const club = await ctx.db.clubs.findUnique({
            where: {
                id: input.clubId,
            },
        });
        if (!club) {
            throw new Error("Club not found");
        }
        const result = await ctx.db.review.create({
            data: {
                rating: input.rating,
                comment: input.comment,
                club: {
                    connect: {
                        id: club.id,
                    },
                },
                user: {
                    connect: {
                        id: ctx.session.user.id,
                    },
                },
            }
        });
        if (!result) {
            throw new Error("Failed to add review");
        }
        return result;
    }),
})