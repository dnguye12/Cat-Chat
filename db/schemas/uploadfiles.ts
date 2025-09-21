import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { messages } from "./messages";
import { relations } from "drizzle-orm";

export const fileType = pgEnum("file_type", ["application/pdf", "image"])

export const uploadfiles = pgTable("uploadfiles", {
    id: uuid("id").primaryKey().defaultRandom(),
    messageId: uuid("message_id").references(() => messages.id, {
        onDelete: "cascade"
    }),
    name: text("name"),
    url: text("text").notNull(),
    type: fileType("type").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull()
})

export const uploadfilesRelations = relations(uploadfiles, ({one}) => ({
    messages: one(messages, {
        fields: [uploadfiles.messageId],
        references: [messages.id]
    })
}))