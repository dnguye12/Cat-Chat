import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { messages } from "./messages";

export const chats = pgTable("chats", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title"),
    activeBranchId: uuid("active_branch_id"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
})

export const chatRelations = relations(chats, ({  many }) => ({
    messages: many(messages),
}))

export type Chat = typeof chats.$inferSelect