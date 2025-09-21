import { NextRequest, NextResponse } from "next/server";
import { Mistral } from '@mistralai/mistralai';
import { uploadfiles } from "@/db/schemas/uploadfiles";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { messageId, content } = body
        let { model } = body

        if (!process.env.MISTRAL_API_KEY) {
            return new NextResponse("Missing MISTRAL_API_KEY", { status: 500 })
        }

        const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY })

        if (!model) {
            model = "mistral-small-latest"
        }

        const files = await db.select().from(uploadfiles).where(eq(uploadfiles.messageId, messageId))

        if (files.length === 0) {
            const chatResponse = await client.chat.complete({
                model,
                messages: content,
            })

            const res = chatResponse.choices[0].message.content

            return NextResponse.json(res)
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const chatContent: any = [
                {
                    type: "text",
                    text: content
                }
            ]

            for (const file of files) {
                if (file.type === "image") {
                    chatContent.push({
                        type: "image_url",
                        imageUrl: file.url
                    })
                } else {
                    chatContent.push({
                        type: "document_url",
                        documentUrl: file.url
                    })
                }
            }

            const chatResponse = await client.chat.complete({
                model,
                messages: [
                    {
                        role: "user",
                        content: chatContent
                    }
                ]
            })

            const res = chatResponse.choices[0].message.content

            return NextResponse.json(res)
        }

    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify(error), { status: 500 })
    }
}