import { relations } from "drizzle-orm";
import { AnyPgColumn, boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { chats } from "./chats";

export const messageRole = pgEnum("message_role", ["system", "tool", "user", "assistant"])

export const messages = pgTable("messages", {
    id: uuid("id").primaryKey().defaultRandom(),

    chatId: uuid("chat_id").references(() => chats.id, {
        onDelete: "cascade"
    }),

    parentId: uuid("parent_id").references((): AnyPgColumn => messages.id, {
        onDelete: "cascade"
    }),

    role: messageRole("role").notNull(),
    content: text("content").notNull(),
    hasFiles: boolean("has_files").notNull().default(false),

    variantIndex: integer("variant_index").default(0).notNull(),
    depth: integer("depth").default(0).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull()
})

export const messageRelations = relations(messages, ({one, many}) => ({
    chats: one(chats, {
        fields: [messages.chatId],
        references: [chats.id]
    }),

    parent: one(messages, {
        fields: [messages.parentId],
        references: [messages.id],
        relationName: "message_children"
    }),

    children: many(messages, {relationName: "message_children"})
}))

export type Message = typeof messages.$inferSelect