import { db } from "@/db";
import { messages } from "@/db/schemas/messages";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ chatId: string }> }) {
    try {
        const chatId = (await params).chatId

        const data = await db.select().from(messages)
            .where(eq(messages.chatId, chatId))

        return NextResponse.json(data)
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify(error), { status: 500 })
    }
}