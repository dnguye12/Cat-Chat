export const runtime = "nodejs";

import { Mistral } from "@mistralai/mistralai";
import { NextRequest, NextResponse } from "next/server";
import ffmpeg from "fluent-ffmpeg";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { join } from "path";
import { writeFile, readFile } from "fs/promises";

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json()
        const { base64 } = body
        const model = "voxtral-mini-latest"

        if (!process.env.MISTRAL_API_KEY) {
            return new NextResponse("Missing MISTRAL_API_KEY", { status: 500 })
        }

        const audioBuffer = Buffer.from(base64, "base64")
        const filePath = join(tmpdir(), `${randomUUID()}.webm`)
        await writeFile(filePath, audioBuffer);

        const outPath = join(tmpdir(), `${randomUUID()}.wav`);
        await new Promise<void>((resolve, reject) => {
            ffmpeg(filePath)
                .audioChannels(1)
                .audioFrequency(16000)
                .audioCodec("pcm_s16le")
                .format("wav")
                .on("error", reject)
                .on("end", () => resolve())
                .save(outPath);
        })

        const wavBuffer = await readFile(outPath);

        const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY })


        const chatResponse = await client.audio.transcriptions.complete({
            model,
            file: {
                fileName: "audio.mp3",
                content: wavBuffer,
            }
        })

        const res = chatResponse.text
        return NextResponse.json(res)

    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify(error), { status: 500 })
    }
}