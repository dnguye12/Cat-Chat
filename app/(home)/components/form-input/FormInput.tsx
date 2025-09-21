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
import { Loader2Icon, MicIcon, SquareArrowRightIcon, UploadIcon, XIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAppSidebar } from "@/providers/AppSidebarProvider"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import UploadModal from "./components/UploadModal"
import { useEffect, useState } from "react"
import { UploadFile } from "@/types/types"
import FileCard from "./components/FileCard"
import { cn } from "@/lib/utils"
import { useRecordVoice } from "@/hooks/use-record-voice"

interface FormInputProps {
    preFill: string
}

const FormInput = ({ preFill }: FormInputProps) => {
    const [uploadOpen, setUploadOpen] = useState<boolean>(false)
    const [files, setFiles] = useState<UploadFile[]>([])

    const onTranscript = (text: string) => {
        form.setValue("content", text, { shouldDirty: true, shouldTouch: true })
        form.setFocus("content")
    }

    const { recording, startRecording, stopRecording, cancelRecording, transcripting } = useRecordVoice({onTranscript})

    const router = useRouter()
    const { addSidebarChats } = useAppSidebar()

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
        try {
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

            const res = await fetch("/api/chat", {
                method: "POST",
                body: JSON.stringify({
                    content: form.getValues().content,
                    fileUrls
                }
                ),
                cache: "no-cache"
            })

            if (!res.ok) {
                toast.error(await res.text())
            }

            const data = await res.json()
            addSidebarChats(data)
            router.push(`/chat/${data.id}`)
        } catch (e) {
            console.log(e)
        }
    }

    const { isSubmitting } = form.formState

    useEffect(() => {
        if (preFill) {
            form.setValue("content", preFill, { shouldDirty: true, shouldTouch: true })
        }
    }, [preFill, form])

    return (
        <>
            <UploadModal
                open={uploadOpen}
                onOpenChange={setUploadOpen}
                setFiles={setFiles}
            />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={cn("w-full bg-input max-w-3xl rounded-lg overflow-hidden p-4", recording && "!hidden")}>
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
                                    <Input placeholder="Type your message here..." disabled={isSubmitting || transcripting} className="h-10 border-none ring-0! text-base! shadow-none mb-5" {...field} />
                                </FormControl>
                                <FormMessage className="px-4 py-0" />
                            </FormItem>
                        )}
                    />
                    <div className="h-9 flex justify-between">
                        <div className="flex gap-x-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button onClick={() => setUploadOpen(true)} size={"icon"} disabled={isSubmitting || transcripting} type="button">
                                        <UploadIcon />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Upload pdf or images</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button onClick={startRecording} size={"icon"} disabled={isSubmitting || transcripting} type="button">
                                        <MicIcon />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Voice Mode</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        <Button size={"icon"} disabled={isSubmitting || transcripting} type="submit">
                            {isSubmitting
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

            <div className={cn("p-4 h-32 bg-input max-w-3xl rounded-lg overflow-hidden flex flex-col w-full", !recording && "!hidden")}>
                <div className="flex-1 px-3 pt-3">...Listening, use <UploadIcon className=" size-5 inline mx-1"/> to submit your speaking, or <XIcon className=" size-5 inline mx-1" />  to cancel recording. </div>
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
            <p className="fixed bottom-0 py-1 w-full text-center text-sm text-muted-foreground bg-background">Our AI can make mistakes. <span className="hidden sm:inline">Please check important information.</span></p>
        </>
    );
}

export default FormInput;