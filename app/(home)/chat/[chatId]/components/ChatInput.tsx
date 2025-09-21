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
import { ArrowDownIcon, ArrowDownToLineIcon, Loader2Icon, MicIcon, SquareArrowRightIcon, UploadIcon, XIcon } from "lucide-react"
import { toast } from "sonner"
import { Dispatch, SetStateAction, useState } from "react"
import { useModel } from "@/providers/ModelProvider"
import { Message } from "@/db/schemas/messages"
import UploadModal from "@/app/(home)/components/form-input/components/UploadModal"
import { UploadFile } from "@/types/types"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import FileCard from "@/app/(home)/components/form-input/components/FileCard"
import { useRecordVoice } from "@/hooks/use-record-voice"

interface ChatIdProps {
    chatId: string;
    isLoading: boolean;
    messages: Message[];
    setMessages: Dispatch<SetStateAction<Message[]>>;
    setIsError: Dispatch<SetStateAction<boolean>>;
    isGenerating: boolean;
    setIsGenerating: Dispatch<SetStateAction<boolean>>;
    scrollToBottom: (behavior?: "auto" | "instant" | "smooth") => void
}

const ChatInput = ({ chatId, isLoading, messages, setMessages, setIsError, isGenerating, setIsGenerating, scrollToBottom }: ChatIdProps) => {
    const [isPending, setIsPending] = useState<boolean>(false)
    const [uploadOpen, setUploadOpen] = useState<boolean>(false)
    const [files, setFiles] = useState<UploadFile[]>([])
    const { model } = useModel()

    const onTranscript = (text: string) => {
        form.setValue("content", text, { shouldDirty: true, shouldTouch: true })
        form.setFocus("content")
    }

    const { recording, startRecording, stopRecording, cancelRecording, transcripting } = useRecordVoice({ onTranscript })

    const formSchema = z.object({
        content: z.string().min(1, {
            message: "Chat can not be empty"
        }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "",
        }
    })

    const onSubmit = async () => {
        if (!isPending) {
            try {
                setIsPending(true)
                setIsGenerating(true)

                const fileUrls = []

                for (let i = 0; i < files.length; i++) {
                    if (files[i].type === "application/pdf") {
                        fileUrls.push({
                            name: files[i].name,
                            url: files[i].url,
                            type: files[i].type
                        })
                    } else {
                        fileUrls.push({
                            name: "",
                            url: files[i].url,
                            type: "image"
                        })
                    }
                }

                const newMessageUser = await fetch("/api/message", {
                    method: "POST",
                    body: JSON.stringify({
                        role: "user",
                        content: form.getValues().content,
                        chatId,
                        parentId: messages[messages.length - 1].id,
                        fileUrls
                    })
                })

                if (!newMessageUser.ok) {
                    toast.error(await newMessageUser.text())
                }

                const dataUser: Message = await newMessageUser.json()

                let res

                if (fileUrls.length > 0) {
                    res = await fetch("/api/mistral/chat-context", {
                        method: "POST",
                        body: JSON.stringify({
                            messageId: dataUser.id,
                            content: dataUser.content,
                            model
                        })
                    })
                } else {
                    const previousMessages = messages.slice(-4).map(m => ({ role: m.role, content: m.content, hasFiles: m.hasFiles }))
                    const payload = [
                        ...previousMessages,
                        {
                            role: "user",
                            content: dataUser.content,
                            hasFiles: dataUser.hasFiles
                        }
                    ]

                    res = await fetch("/api/mistral/chat-context", {
                        method: "POST",
                        body: JSON.stringify({
                            messageId: dataUser.id,
                            content: payload,
                            model
                        })
                    })
                }


                if (!res.ok) {
                    if (res.status === 429) {
                        setIsError(true)
                    }
                    toast.error(await res.text())
                }

                const data = await res.json()

                setMessages((prev) => [...prev, dataUser])

                const newMessageAssistant = await fetch("/api/message", {
                    method: "POST",
                    body: JSON.stringify({
                        role: "assistant",
                        content: data,
                        chatId,
                        parentId: dataUser.id,
                        fileUrls: []
                    })
                })

                if (!newMessageAssistant.ok) {
                    toast.error(await newMessageAssistant.text())
                }


                const dataAssistant = await newMessageAssistant.json()

                setMessages((prev) => [...prev, dataAssistant])

            } catch (e) {
                console.log(e)
            } finally {
                setIsPending(false)
                setIsGenerating(false)
                form.reset()
                setFiles([])
            }
        }
    }

    const { isSubmitting } = form.formState

    return (
        <>
            <UploadModal
                open={uploadOpen}
                onOpenChange={setUploadOpen}
                setFiles={setFiles}
            />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={cn("w-full bg-accent max-w-3xl rounded-lg overflow-hidden p-4 fixed bottom-6 z-10", recording && "!hidden")} >
                    <div className={cn(
                        " flex gap-x-6 h-0 items-center transition-all",
                        files.length > 0 && " h-36"
                    )}>
                        {
                            files.length > 0 && files.map((f) => (
                                <FileCard key={f.key} file={f} setFiles={setFiles} />
                            ))
                        }
                    </div>

                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Type your message here..." disabled={isSubmitting || isLoading || isPending || isGenerating || transcripting} className="h-10 border-none ring-0! text-base! shadow-none mb-5" {...field} />
                                </FormControl>
                                <FormMessage className="px-4 py-0" />
                            </FormItem>
                        )}
                    />
                    <div className="h-9 flex justify-between">
                        <div className="flex gap-x-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button onClick={() => setUploadOpen(true)} size={"icon"} disabled={isSubmitting || isLoading || isPending || isGenerating || transcripting} type="button">
                                        <UploadIcon />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Upload pdf or images</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button onClick={startRecording} size={"icon"} disabled={isSubmitting || isLoading || isPending || isGenerating || transcripting} type="button">
                                        <MicIcon />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Voice Mode</p>
                                </TooltipContent>
                            </Tooltip>
                            <Button variant={"outline"} size={"icon"} onClick={() => {scrollToBottom()}} className="flex lg:hidden"><ArrowDownToLineIcon/></Button>
                        </div>
                        <Button size={"icon"} disabled={isSubmitting || isPending || isLoading || isGenerating || transcripting} type="submit">
                            {(isSubmitting || isLoading)
                                ?
                                (
                                    <Loader2Icon className="animate-spin" />
                                )
                                :
                                (
                                    <SquareArrowRightIcon />
                                )}
                        </Button>
                    </div>
                </form>
            </Form>
            <div className={cn("p-4 h-32 bg-input max-w-3xl rounded-lg overflow-hidden flex flex-col w-full mb-7", !recording && "!hidden")}>
                <div className="flex-1 px-3 pt-3">...Listening, use <UploadIcon className=" size-5 inline mx-1" /> to submit your speaking, or <XIcon className=" size-5 inline mx-1" />  to cancel recording. </div>
                <div className="h-9 flex justify-between">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant={"outline"} onClick={cancelRecording} size={"icon"} disabled={isSubmitting || transcripting} type="button">
                                <XIcon />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Cancel audio</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button onClick={stopRecording} size={"icon"} disabled={isSubmitting || transcripting} type="button">
                                <UploadIcon />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Submit audio</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
            <p className="fixed bottom-0 py-1 w-full text-center text-sm text-muted-foreground bg-background">Le Chat can make mistakes. <span className="hidden sm:inline">Please check important information.</span></p>
        </>
    );
}

export default ChatInput;