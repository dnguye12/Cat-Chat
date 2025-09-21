"use client"

import Navbar from "@/app/(home)/components/navbar/Navbar";
import { Message } from "@/db/schemas/messages";
import { useParams } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ChatInput from "./components/ChatInput";
import { toast } from "sonner";
import ChatMessage from "./components/ChatMessage";
import { Button } from "@/components/ui/button";
import { ArrowDownToLineIcon, CircleAlertIcon } from "lucide-react";
import { useModel } from "@/providers/ModelProvider";
import { Skeleton } from "@/components/ui/skeleton";


const Page = () => {
    const { chatId } = useParams<{ chatId: string }>()
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isFirst, setIsFirst] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)
    const [isGenerating, setIsGenerating] = useState<boolean>(false)

    const hasFetchedFirst = useRef<boolean>(false);

    const scrollRef = useRef<HTMLDivElement>(null)
    const bottomRef = useRef<HTMLDivElement>(null)
    const [isBottom, setIsBottom] = useState<boolean>(true)

    const { model } = useModel()

    const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
        bottomRef.current?.scrollIntoView({ behavior })
    }

    const computeIsBottom = () => {
        const el = scrollRef.current
        if (!el) {
            return true
        }
        const threshold = 48;
        return el.scrollTop + el.clientHeight >= el.scrollHeight - threshold
    }

    useEffect(() => {
        const el = scrollRef.current
        if (!el) {
            return
        }

        const onScroll = () => {
            setIsBottom(computeIsBottom())
        }

        onScroll()

        el.addEventListener("scroll", onScroll, { passive: true })

        return () => el.removeEventListener("scroll", onScroll)
    }, [])

    useEffect(() => {
        if (chatId && isLoading && messages.length === 0) {
            const fetchMessages = async () => {
                try {
                    const res = await fetch(`/api/chat/${chatId}/getActiveBranch`)
                    const data = await res.json()

                    setMessages(data)
                    if (data.length === 1) {
                        setIsFirst(true)
                    }
                } catch (error) {
                    console.log(error)
                } finally {
                    setIsLoading(false)
                }
            }

            fetchMessages()
        }
    }, [chatId, isLoading, messages.length])

    useEffect(() => {
        if (!isFirst) {
            return
        }
        if (messages.length !== 1) {
            return
        }
        if (hasFetchedFirst.current) {
            return
        }

        hasFetchedFirst.current = true;

        (async () => {
            try {
                setIsGenerating(true)
                const res = await fetch("/api/mistral/chat", {
                    method: "POST",
                    body: JSON.stringify({
                        messageId: messages[0].id,
                        content: messages[0].content,
                        model,
                    })
                })

                if (!res.ok) {
                    console.log(res)
                    if (res.status === 500) {
                        setIsError(true)
                    }
                    toast.error("Error getting answer from Mistral")
                }

                const data = await res.json()

                const newMessageAssistant = await fetch("/api/message", {
                    method: "POST",
                    body: JSON.stringify({
                        role: "assistant",
                        content: data,
                        chatId,
                        parentId: messages[0].id,
                    })
                })

                if (!newMessageAssistant.ok) {
                    toast.error(await newMessageAssistant.text())
                }

                const dataAssistant: Message = await newMessageAssistant.json()

                setMessages((prev) => [...prev, dataAssistant])
            } catch (error) {
                console.log(error)
            } finally {
                setIsFirst(false)
                setIsGenerating(false)
            }
        })()

    }, [chatId, messages, isFirst, model])

    useLayoutEffect(() => {
        if (!isLoading) {
            requestAnimationFrame(() => scrollToBottom("auto"))
        }
    }, [isLoading])

    useEffect(() => {
        if (messages.length > 1 && isBottom) {
            scrollToBottom()
        }
    }, [messages.length, isBottom])

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center h-[calc(100vh-64px)] relative mt-16">
                <div ref={scrollRef} className="container px-4 max-w-3xl flex-1 pt-4 pb-48 flex flex-col relative">
                    {
                        isLoading
                            ?
                            (
                                <div className="flex flex-col py-10 gap-y-10 w-full">
                                    <div className="w-full flex justify-end">
                                        <Skeleton className="w-3/4 p-16" />
                                    </div>
                                    <div className="w-full flex">
                                        <Skeleton className="w-3/4 p-16" />
                                    </div>
                                    <div className="w-full flex justify-end">
                                        <Skeleton className="w-3/4 p-16" />
                                    </div>
                                </div>
                            )
                            :
                            messages.map((mess) => (
                                <ChatMessage key={mess.id} message={mess} setMessages={setMessages} setIsError={setIsError} setIsLoading={setIsLoading} setIsGenerating={setIsGenerating} />
                            ))
                    }
                    {
                        isGenerating
                        &&
                        (
                            <div className="w-full flex">
                                <Skeleton className="w-12 py-1 text-center" >...</Skeleton>
                            </div>
                        )
                    }
                    <div ref={bottomRef}></div>
                </div>

                <div className="fixed bottom-10 container max-w-4xl mx-auto z-50">
                    <Button variant={"secondary"} onClick={() => scrollToBottom()} size={"icon"} className="hidden lg:flex absolute right-0 bottom-0"><ArrowDownToLineIcon /></Button>
                </div>
                {
                    isError
                        ?
                        (
                            <div className="w-full bg-accent max-w-3xl rounded-lg overflow-hidden p-4 fixed bottom-5 z-10 text-destructive flex items-center gap-x-2">
                                <CircleAlertIcon /> We have issues connecting to Mistral! Please check back later
                            </div>
                        )
                        :
                        (
                            <ChatInput chatId={chatId} isLoading={isLoading} messages={messages} setMessages={setMessages} setIsError={setIsError} isGenerating={isGenerating} setIsGenerating={setIsGenerating} scrollToBottom={scrollToBottom}/>
                        )
                }

            </div>
        </>
    );
}

export default Page;