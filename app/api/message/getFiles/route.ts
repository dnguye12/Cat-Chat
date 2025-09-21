import { db } from "@/db";
import { uploadfiles } from "@/db/schemas/uploadfiles";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json()
        const {messageId} = body

        const files = await db.select().from(uploadfiles)
        .where(eq(uploadfiles.messageId, messageId))

        return NextResponse.json(files)
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify(error), { status: 500 })
    }
}