"use client"

import { Chat } from "@/db/schemas/chats";
import { createContext, useContext, useMemo, useState } from "react";

type Context = {
    sidebarChats: Chat[];
    setSidebarChats: (c: Chat[]) => void;
    editChatTitle: (chatId: string, newTitle: string) => void;
    addSidebarChats: (chat: Chat) => void;
    deleteSidebarChats: (chatId: string) => void;
}

const SidebarContext = createContext<Context | null>(null)

export function useAppSidebar() {
    const ctx = useContext(SidebarContext)
    if (!ctx) {
        throw new Error("useModel must be used within <AppSidebarProvider>");
    }
    return ctx
}

export default function AppSidebarProvider({ children }: { children: React.ReactNode }) {
    const [sidebarChats, setChatsState] = useState<Chat[]>([])

    const setSidebarChats = (c: Chat[]) => {
        setChatsState(c)
    }

    const editChatTitle = (chatId: string, newTitle: string) => {
        setChatsState((prev) => prev.map((c) => c.id === chatId ? {...c, title: newTitle} : c))
    }

    const addSidebarChats = (chat: Chat) => {
        setChatsState((prev) => [chat, ...prev])
    }

    const deleteSidebarChats = (chatId: string) => {
        setChatsState((prev) => prev.filter((c) => c.id !== chatId))
    }

    const value = useMemo(() => ({
        sidebarChats,
        setSidebarChats,
        editChatTitle,
        addSidebarChats,
        deleteSidebarChats
    }), [sidebarChats])

    return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}