"use client"

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisIcon, PencilIcon, SquarePenIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import EditDialog from "./components/EditDialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useAppSidebar } from "@/providers/AppSidebarProvider";
import { Skeleton } from "@/components/ui/skeleton";

const AppSidebar = () => {
    const { sidebarChats, setSidebarChats, deleteSidebarChats } = useAppSidebar()
    const [isLoading, setIsLoading] = useState(true)
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        if (isLoading) {
            const fetchChats = async () => {
                try {
                    const data = await fetch("/api/chat", { method: "GET" })

                    setSidebarChats(await data.json())
                } catch (error) {
                    console.log(error)
                } finally {
                    setIsLoading(false)
                }
            }

            fetchChats()
        }
    }, [setSidebarChats, isLoading])

    const handleDelete = async (chatId: string) => {
        try {
            await fetch(`/api/chat/${chatId}`, {
                method: "DELETE",
            })

            deleteSidebarChats(chatId)

            const href = `/chat/${chatId}`;
            const isActive =
                pathname === href ||
                pathname.startsWith(`${href}/`) ||
                pathname === `${href}/`;

            if (isActive) {
                router.push("/")
            }
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <Sidebar>
            <SidebarHeader className="h-16 flex flex-row justify-center items-center border-b">
                <Link href={"/"}>
                    <Image
                        src={"/logo.svg"}
                        width={52}
                        height={32}
                        alt={"logo"}
                    />
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href={"/"}><SquarePenIcon /> New chat</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Chats</SidebarGroupLabel>
                    <SidebarMenu>
                        {isLoading && sidebarChats.length === 0 && (
                            <>
                                <SidebarMenuItem className="p-2">
                                    <Skeleton className="h-5 w-full" />
                                </SidebarMenuItem>
                                <SidebarMenuItem className="p-2">
                                    <Skeleton className="h-5 w-full" />
                                </SidebarMenuItem>
                                <SidebarMenuItem className="p-2">
                                    <Skeleton className="h-5 w-full" />
                                </SidebarMenuItem>
                                <SidebarMenuItem className="p-2">
                                    <Skeleton className="h-5 w-full" />
                                </SidebarMenuItem>
                                <SidebarMenuItem className="p-2">
                                    <Skeleton className="h-5 w-full" />
                                </SidebarMenuItem>
                            </>
                        )}
                        {sidebarChats.map((c) => {
                            const href = `/chat/${c.id}`;
                            const isActive =
                                pathname === href ||
                                pathname.startsWith(`${href}/`) ||
                                pathname === `${href}/`;
                            return (
                                <SidebarMenuItem key={"sidebar" + c.id} className="flex items-center gap-x-2">
                                    <SidebarMenuButton asChild isActive={isActive}>
                                        <Link href={href} className="truncate w-4/5 line-clamp-1">{c.title}</Link>
                                    </SidebarMenuButton>
                                    <Dialog>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant={"ghost"} size={"icon"}>
                                                    <EllipsisIcon />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DialogTrigger asChild>
                                                    <DropdownMenuItem className="items-start text-foreground">
                                                        <PencilIcon className="text-foreground!" /> Rename
                                                    </DropdownMenuItem>
                                                </DialogTrigger>
                                                <DropdownMenuItem className="items-start text-destructive" onClick={() => { handleDelete(c.id) }}>
                                                    <Trash2Icon className="text-destructive!" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <EditDialog chatId={c.id} />
                                    </Dialog>
                                </SidebarMenuItem>
                            )
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}

export default AppSidebar;