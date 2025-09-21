import { db } from "@/db";
import { chats } from "@/db/schemas/chats";
import { messages } from "@/db/schemas/messages";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ chatId: string }> }) {
  const chatId = (await params).chatId

  try {
    const [chat] = await db.select().from(chats).where(eq(chats.id, chatId))

    if (!chat?.activeBranchId) {
      const message = await db.select().from(messages).where(eq(messages.chatId, chatId))
      return NextResponse.json(message)
    }

    const result = await db.execute(sql`
      WITH RECURSIVE
      start_node AS (
        SELECT * FROM ${messages}
        WHERE id = ${chat.activeBranchId} AND chat_id = ${chatId}
      ),
      ancestors AS (
        SELECT * FROM start_node
        UNION ALL
        SELECT m.*
        FROM ${messages} m
        JOIN ancestors a ON a.parent_id = m.id
        WHERE m.chat_id = ${chatId}
      ),
      descendants AS (
        SELECT * FROM start_node
        UNION ALL
        SELECT c.*
        FROM ${messages} c
        JOIN descendants d ON c.parent_id = d.id
        WHERE c.chat_id = ${chatId}
      ),
      all_nodes AS (
        SELECT * FROM ancestors
        UNION
        SELECT * FROM descendants
      )
       SELECT
        id,
        chat_id      AS "chatId",
        parent_id    AS "parentId",
        role,
        content,
        has_files AS "hasFiles",
        variant_index AS "variantIndex",
        depth,
        created_at   AS "createdAt"
      FROM all_nodes
      ORDER BY depth ASC, created_at ASC;
    `);

    return NextResponse.json(result.rows)

  } catch (error) {
    console.log(error)
    return new NextResponse(JSON.stringify(error), { status: 500 })
  }
}