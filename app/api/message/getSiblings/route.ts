import { db } from "@/db";
import { messages } from "@/db/schemas/messages";
import { and, asc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json()
        const {messageId} = body

        const res = await db.select().from(messages)
            .where(eq(messages.id, messageId))

        const sibs = await db.select().from(messages)
        .where(
            and(
                eq(messages.chatId, res[0].chatId!),
                eq(messages.parentId, res[0].parentId!)
            )
        ).orderBy(asc(messages.variantIndex))

        return NextResponse.json(sibs)
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify(error), { status: 500 })
    }
}