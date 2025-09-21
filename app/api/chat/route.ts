import { db } from "@/db"
import { chats } from "@/db/schemas/chats"
import { messages } from "@/db/schemas/messages"
import { uploadfiles } from "@/db/schemas/uploadfiles"
import { desc, eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
    try {
        const data = await db.select().from(chats).orderBy(desc(chats.updatedAt), desc(chats.id))
        return NextResponse.json(data)
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify(error), { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { content, fileUrls } = body

        const [chat] = await db.insert(chats).values({
            title: content
        }).returning()

        const [root] = await db.insert(messages).values({
            chatId: chat.id,
            role: "user",
            content,
            hasFiles: fileUrls.length > 0
        }).returning()

        await db.update(chats)
            .set({ activeBranchId: root.id })
            .where(eq(chats.id, root.id))

        for (const file of fileUrls) {
            await db.insert(uploadfiles).values({
                messageId: root.id,
                name: file.name,
                url: file.url,
                type: file.type
            })
        }

        return NextResponse.json(chat)
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify(error), { status: 500 })
    }
}