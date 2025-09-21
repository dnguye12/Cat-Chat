"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Dispatch, SetStateAction, useState } from "react"
import { useModel } from "@/providers/ModelProvider"
import { Message } from "@/db/schemas/messages"

interface ChatEditProps {
    message: Message;
    setIsEditing: Dispatch<SetStateAction<boolean>>;
    setMessages: Dispatch<SetStateAction<Message[]>>;
    setIsError: Dispatch<SetStateAction<boolean>>;
    setIsGenerating: Dispatch<SetStateAction<boolean>>;
}

const ChatEdit = ({ message, setIsEditing, setMessages, setIsError, setIsGenerating}: ChatEditProps) => {
    const [isPending, setIsPending] = useState<boolean>(false)
    const { model } = useModel()

    const formSchema = z.object({
        content: z.string().min(1, {
            message: "Chat can not be empty"
        }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: message.content,
        }
    })

    const onSubmit = async () => {
        if (!isPending) {
            try {
                const newContent = form.getValues().content

                if (message.content !== newContent) {
                    setIsPending(true)
                    setIsGenerating(true)

                    const newMessageUser = await fetch("/api/message", {
                        method: "POST",
                        body: JSON.stringify({
                            role: "user",
                            content: newContent,
                            chatId: message.chatId,
                            parentId: message.parentId
                        })
                    })

                    if (!newMessageUser.ok) {
                        toast.error(await newMessageUser.text())
                    }

                    const dataUser: Message = await newMessageUser.json()

                    const newBranch = await fetch(`/api/chat/${dataUser.chatId}/getActiveBranch`)
                    const dataNewBranch: Message[] = await newBranch.json()

                    setMessages(dataNewBranch)

                    const previousMessages = dataNewBranch.slice(-4).map(m => ({ role: m.role, content: m.content }))
                    const payload = [
                        ...previousMessages,
                        {
                            role: "user",
                            content: form.getValues().content
                        }
                    ]

                    const res = await fetch("/api/mistral/chat-context", {
                        method: "POST",
                        body: JSON.stringify({
                            content: payload,
                            model
                        })
                    })

                    if (!res.ok) {
                        if (res.status === 429) {
                            setIsError(true)
                        }
                        toast.error(await res.text())
                    }

                    const data = await res.json()
                    const newMessageAssistant = await fetch("/api/message", {
                        method: "POST",
                        body: JSON.stringify({
                            role: "assistant",
                            content: data,
                            chatId: dataUser.chatId,
                            parentId: dataUser.id
                        })
                    })

                    if (!newMessageAssistant.ok) {
                        toast.error(await newMessageAssistant.text())
                    }

                    const dataAssistant = await newMessageAssistant.json()
                    setMessages(() => [...dataNewBranch, dataAssistant])
                }
            } catch (e) {
                console.log(e)
            } finally {
                setIsPending(false)
                form.reset()
                setIsEditing(false)
                setIsGenerating(false)
            }
        }
    }

    const { isSubmitting } = form.formState

    return (
        <div className="w-full flex flex-col items-end justify-end relative group py-10">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full bg-accent max-w-3xl rounded-lg overflow-hidden p-4 z-10">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input disabled={isSubmitting || isPending} className="h-10 border-none ring-0! text-base! shadow-none mb-5" {...field} />
                                </FormControl>
                                <FormMessage className="px-4 py-0" />
                            </FormItem>
                        )}
                    />
                    <div className="h-9 flex justify-end gap-x-2">
                        <Button variant={"outline"} onClick={() => { setIsEditing(false) }} type='button'>Cancel</Button>
                        <Button disabled={isSubmitting || isPending} type="submit">Send</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default ChatEdit;