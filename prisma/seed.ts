import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { Event } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Creating users if not found
    let alice = await prisma.user.findFirst({
        where: { email: 'alice@example.com' },
    });

    if (!alice) {
        alice = await prisma.user.create({
            data: {
                email: 'alice@example.com',
                password: 'alice@example.com',  // Ensure you hash passwords in real scenarios
                name: 'Alice',
            },
        });
    }
    // create bob (will be used to create reviews)
    let bob = await prisma.user.findFirst({
        where: { email: 'bob@example.com' },
    });

    if (!bob) {
        bob = await prisma.user.create({
            data: {
                email: 'bob@example.com',
                password: 'bob@example.com',  // Ensure you hash passwords in real scenarios
                name: 'Bob',
            },
        });
    }


    // Creating Event
    const event_data: Event[] = [
        {
            id: randomUUID(),
            name: 'Chess Tournament',
            description: 'A chess tournament for all chess enthusiasts.',
            fullMarkdownDescription: "",
            startDate: new Date(), // Current date
            // increment by 10 days
            endDate: new Date(new Date().setDate(new Date().getDate() + 10)),
            image: 'https://media.istockphoto.com/id/499517325/photo/a-man-speaking-at-a-business-conference.jpg?s=612x612&w=0&k=20&c=gWTTDs_Hl6AEGOunoQ2LsjrcTJkknf9G8BGqsywyEtE=',
            tags: []
        },
        {
            id: randomUUID(),
            name: 'Book Discussion',
            description: 'A book discussion on "The Great Gatsby".',
            fullMarkdownDescription: "",
            startDate: new Date(new Date().setDate(new Date().getDate() + 10)),
            endDate: new Date(new Date().setDate(new Date().getDate() + 20)),
            image: 'https://fiverr-res.cloudinary.com/f_auto,q_auto/v1/attachments/generic_asset/asset/d98a0c9ca538af4c4ea63977314873dc-1668691517182/Book%20Launch%20.jpeg',
            tags: []
        },
        {
            id: randomUUID(),
            name: 'Chess Workshop',
            description: 'A workshop on chess strategies.',
            fullMarkdownDescription: `🏆 **Chess Grand Masters Tournament 2024** 🏆

            📅 **Date:** July 14th - July 20th, 2024
            📍 **Location:** Downtown Convention Center, Chessville, USA
            
            👥 **Participants:**
              - Featuring top grandmasters from around the world
              - Open to all with an Elo rating above 2200
            
            🎯 **Event Highlights:**
              - **Round-Robin Tournament:** Compete in intense matches against other top-tier players.
              - **Strategy Workshops:** Learn advanced techniques and strategies from seasoned professionals.
              - **Simultaneous Exhibitions:** Challenge a Grandmaster in a simultaneous display.
              - **Meet & Greet:** Get autographs and photos with your favorite players.
            
            🏁 **Prizes:**
              - 💰 **$50,000 Grand Prize**
              - 🥈 **$20,000 for Second Place**
              - 🥉 **$10,000 for Third Place**
            
            🔗 **Registration & Details:** 
            Visit [www.chessgrandmasters2024.com](http://www.chessgrandmasters2024.com) to register and find more information.
            
            👋 **Don't miss your chance to witness chess history in the making! Come and be a part of this thrilling event!**`,
            startDate: new Date(new Date().setDate(new Date().getDate() + 20)),
            endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
            image: 'https://fiverr-res.cloudinary.com/f_auto,q_auto/v1/attachments/generic_asset/asset/d98a0c9ca538af4c4ea63977314873dc-1668691517182/Book%20Launch%20.jpeg',
            tags: []
        },
        {
            id: randomUUID(),
            name: 'Book Reading',
            description: 'A book reading session on "The Great Gatsby".',
            fullMarkdownDescription: `🏆 **Chess Grand Masters Tournament 2024** 🏆

            📅 **Date:** July 14th - July 20th, 2024
            📍 **Location:** Downtown Convention Center, Chessville, USA
            
            👥 **Participants:**
              - Featuring top grandmasters from around the world
              - Open to all with an Elo rating above 2200
            
            🎯 **Event Highlights:**
              - **Round-Robin Tournament:** Compete in intense matches against other top-tier players.
              - **Strategy Workshops:** Learn advanced techniques and strategies from seasoned professionals.
              - **Simultaneous Exhibitions:** Challenge a Grandmaster in a simultaneous display.
              - **Meet & Greet:** Get autographs and photos with your favorite players.
            
            🏁 **Prizes:**
              - 💰 **$50,000 Grand Prize**
              - 🥈 **$20,000 for Second Place**
              - 🥉 **$10,000 for Third Place**
            
            🔗 **Registration & Details:** 
            Visit [www.chessgrandmasters2024.com](http://www.chessgrandmasters2024.com) to register and find more information.
            
            👋 **Don't miss your chance to witness chess history in the making! Come and be a part of this thrilling event!**`,
            startDate: new Date(new Date().setDate(new Date().getDate() + 30)),
            endDate: new Date(new Date().setDate(new Date().getDate() + 40)),
            image: 'https://fiverr-res.cloudinary.com/f_auto,q_auto/v1/attachments/generic_asset/asset/d98a0c9ca538af4c4ea63977314873dc-1668691517182/Book%20Launch%20.jpeg',
            tags: []
        }
    ]

    // Creating events
    event_data.forEach(async (event) => {
        // try finding the event
        const e = await prisma.event.findFirst({
            where: { name: event.name },
        });
        if (e) {
            return;
        }
        await prisma.event.create({
            data: event,
        }); // Create the event if not found
    });
    // Creating clubs
    const cClub = await prisma.clubs.findUnique({
        where: { name: 'Chess Club' },
    });
    if (!cClub) {
        const chessClub = await prisma.clubs.create({
            data: {
                id: randomUUID(),
                name: 'Chess Club',
                description: 'A club for chess enthusiasts.',
                image: 'https://media.istockphoto.com/id/598793496/vector/chess-label-badge-and-design-element.jpg?s=612x612&w=0&k=20&c=skDrRIxdrLvFYjimNWf2_LGMD2hSCJcfZ5DeJbdtAYU=',
                tags: ['chess', 'strategy'],
                fullMarkdownDescription: `🏆 **Chess Grand Masters Tournament 2024**🏆`,
                WhoInterested: {
                    connect: {
                        id: alice.id,
                    },
                },
            },
        });
    }

    const bClub = await prisma.clubs.findUnique({
        where: { name: 'Book Club' },
    });
    if (!bClub) {
        const bookClub = await prisma.clubs.create({
            data: {
                name: 'Book Club',
                description: 'A club for those who love reading.',
                image: 'https://thumbs.dreamstime.com/b/colorful-logo-book-club-vector-isolated-read-books-together-simple-style-flat-design-logotype-education-concept-heart-shape-182147768.jpg',
                tags: ['books', 'reading'],
                fullMarkdownDescription: `🏆 **Chess Grand Masters Tournament 2024** 🏆`,
                WhoInterested: {
                    connect: {
                        id: alice.id,
                    },
                },
            },
        });
    }

    // Establishing relations between users and clubs
    // Example: Alice is interested in the Book Club
    if (!alice) {
        throw new Error('User not found!');
    }
    // find the clubs
    const bookClub = await prisma.clubs.findUniqueOrThrow({
        where: { name: 'Book Club' },
    });
    const chessClub = await prisma.clubs.findUniqueOrThrow({
        where: { name: 'Chess Club' },
    });

    // create reviews
    const reviews = [
        {
            id: randomUUID(),
            rating: 3,
            comment: 'Club member are too good, I can not beat them.',
            userId: bob.id,
            clubId: bookClub.id,
        },
        {
            id: randomUUID(),
            rating: 5,
            comment: 'Met some great people here.',
            userId: bob.id,
            clubId: chessClub.id,
        },
    ];
    reviews.forEach(async (review) => {
        // try finding the review
        const r = await prisma.review.findFirst({
            where: { comment: review.comment },
        });
        if (r) {
            return;
        }
        await prisma.review.create({
            data: review,
        }); // Create the review if not found
    }
    );
    await prisma.user.update({
        where: { id: alice.id },
        data: {
            interestedIn: {
                connect: [
                    { id: bookClub.id },
                    { id: chessClub.id },
                ],
            },
        },
    });

    console.log('Seed data has been inserted successfully!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
