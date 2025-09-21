import { db } from "@/db";
import { chats } from "@/db/schemas/chats";
import { messages } from "@/db/schemas/messages";
import { uploadfiles } from "@/db/schemas/uploadfiles";
import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { chatId, parentId, role, content, fileUrls } = body

        if (!chatId || !role || !content) {
            return new NextResponse("Input Error creating message", { status: 400 })
        }

        let parentDepth = -1
        if (parentId) {
            const [parent] = await db.select()
                .from(messages)
                .where(eq(messages.id, parentId))
                .limit(1)

            if (!parent || parent.chatId !== chatId) {
                return new NextResponse("Error", { status: 500 })
            }
            parentDepth = parent.depth
        }

        const variant = await db.select().from(messages).where(
            and(
                eq(messages.chatId, chatId),
                parentId ? eq(messages.parentId, parentId) : isNull(messages.parentId)
            )
        )

        const nextVariant = variant.reduce<number>((max, { variantIndex }) => variantIndex !== null && variantIndex > max ? variantIndex : max, Number.NEGATIVE_INFINITY)

        const [message] = await db.insert(messages).values({
            chatId,
            parentId,
            role,
            content,
            depth: parentDepth + 1,
            variantIndex: nextVariant === Number.NEGATIVE_INFINITY ? 0 : nextVariant + 1,
            hasFiles: fileUrls && fileUrls.length > 0
        }).returning()

        await db.update(chats).set({ activeBranchId: message.id }).where(eq(chats.id, chatId))

        if (fileUrls) {
            for (const file of fileUrls) {
                await db.insert(uploadfiles).values({
                    messageId: message.id,
                    name: file.name,
                    url: file.url,
                    type: file.type
                })
            }
        }

        revalidatePath(`/api/chat/${chatId}/getActiveBranch`)

        return NextResponse.json(message)
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify(error), { status: 500 })
    }
}