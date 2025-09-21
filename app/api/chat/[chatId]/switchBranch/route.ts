import { db } from "@/db";
import { chats } from "@/db/schemas/chats";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ chatId: string }> }) {
    const { chatId } = await params
    const body = await req.json()
    const { newBranch } = body

    try {
        const chat = await db.update(chats)
            .set({ activeBranchId: newBranch })
            .where(eq(chats.id, chatId))

        return NextResponse.json(chat)
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify(error), { status: 500 })
    }
}