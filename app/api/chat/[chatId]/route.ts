import { db } from "@/db";
import { chats } from "@/db/schemas/chats";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ chatId: string }> }) {
    const { chatId } = await params

    if (!chatId) {
        return new NextResponse("Chat ID missing", { status: 400 })
    }

    try {

        const deletedChat = await db.delete(chats).where(eq(chats.id, chatId)).returning()

        return NextResponse.json(deletedChat)
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify(error), { status: 500 })
    }
}