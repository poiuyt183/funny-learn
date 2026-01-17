import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import "dotenv/config"

const connectionString = process.env.DATABASE_URL

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    const mascots = [
        {
            id: "curious_cat",
            name: "Curious Cat",
            type: "Cat",
            description: "Loves to ask questions and explore new places!",
            imageUrl: "/mascots/cat.png",
            basePersonality: "Curious",
            baseGreeting: "Xin chào! Mình là Curious Cat, cùng khám phá thế giới nhé!",
            traits: ["Curious", "Friendly", "Playful"]
        },
        {
            id: "brave_bear",
            name: "Brave Bear",
            type: "Bear",
            description: "Strong, kind, and always ready to help friends.",
            imageUrl: "/mascots/bear.png",
            basePersonality: "Brave",
            baseGreeting: "Chào bạn! Mình là Brave Bear, sẵn sàng giúp đỡ bạn!",
            traits: ["Brave", "Protective", "Kind"]
        },
        {
            id: "smart_owl",
            name: "Smart Owl",
            type: "Owl",
            description: "Wise, patient, and loves reading books.",
            imageUrl: "/mascots/owl.png",
            basePersonality: "Wise",
            baseGreeting: "Chào em! Mình là Smart Owl, cùng học tập nhé!",
            traits: ["Smart", "Calm", "Patient"]
        },
        {
            id: "cat_explorer",
            name: "Captain Whisker",
            type: "Space Cat",
            description: "A brave space explorer with endless curiosity",
            imageUrl: "/mascots/cat_explorer.png",
            basePersonality: "Adventurous",
            baseGreeting: "Chào các phi hành gia! Mình là Captain Whisker, sẵn sàng khám phá vũ trụ!",
            traits: ["Brave", "Adventurous", "Curious"]
        }
    ]

    for (const mascot of mascots) {
        await prisma.mascot.upsert({
            where: { id: mascot.id },
            update: {},
            create: mascot,
        })
    }

    console.log('Mascots seeded!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
