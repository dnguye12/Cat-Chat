"use client"

import ReactMarkdown from 'react-markdown'
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import { Button } from '@/components/ui/button';
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, CopyIcon, PencilIcon } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Message } from '@/db/schemas/messages';
import ChatEdit from './ChatEdit';
import { UploadFile } from '@/types/types';
import ChatFile from './ChatFile';

interface ChatMessageProps {
    message: Message;
    setMessages: Dispatch<SetStateAction<Message[]>>;
    setIsError: Dispatch<SetStateAction<boolean>>;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    setIsGenerating: Dispatch<SetStateAction<boolean>>;
}

const ChatMessage = ({ message, setMessages, setIsError, setIsLoading, setIsGenerating }: ChatMessageProps) => {
    const [copied, setCopied] = useState<boolean>(false)
    const [isEditing, setIsEditing] = useState<boolean>(false)

    const [siblings, setSiblings] = useState<Message[]>([])
    const hasFetchedSibs = useRef<boolean>(false);

    const [files, setFiles] = useState<UploadFile[]>([])
    const hasFetchedFiles = useRef<boolean>(false)

    useEffect(() => {
        if (message.role === "user" && !hasFetchedSibs.current) {
            const helper = async () => {
                hasFetchedSibs.current = true
                try {
                    const data = await fetch("/api/message/getSiblings", {
                        method: "PATCH",
                        body: JSON.stringify({
                            messageId: message.id
                        })
                    })
                    const sibs = await data.json()
                    setSiblings(sibs)
                } catch (error) {
                    console.log(error)
                }
            }
            helper()
        }
    }, [message.id, message.role])

    useEffect(() => {
        if (message.hasFiles && !hasFetchedFiles.current) {
            const helper = async () => {
                try {
                    const data = await fetch("/api/message/getFiles", {
                        method: "PATCH",
                        body: JSON.stringify({
                            messageId: message.id
                        })
                    })
                    const uploadFiles = await data.json()
                    setFiles(uploadFiles)
                } catch (error) {
                    console.log(error)
                }
            }

            helper()
        }
        hasFetchedFiles.current = true
    }, [message.hasFiles, message.id])

    const handleCopy = async () => {
        await navigator.clipboard.writeText(message.content);
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleSwitchBranch = async (branch: number) => {
        try {
            setIsLoading(true)
            const sib = siblings[branch - 1]
            await fetch(`/api/chat/${sib.chatId}/switchBranch`, {
                method: "PATCH",
                body: JSON.stringify({
                    newBranch: sib.id
                })
            })

            const data = await fetch(`/api/chat/${sib.chatId}/getActiveBranch`)
            const res = await data.json()

            setMessages(res)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const getCurrentIndex = () => {
        for (let i = 0; i < siblings.length; i++) {
            if (siblings[i].id === message.id) {
                return i + 1
            }
        }
        return 1
    }

    if (isEditing) {
        return (
            <ChatEdit message={message} setIsEditing={setIsEditing} setMessages={setMessages} setIsError={setIsError} setIsGenerating={setIsGenerating} />
        )
    }

    return (
        message.role === "user"
            ?
            (
                <div className="w-full flex flex-col items-end justify-end relative group py-4 sm:py-10">
                    {
                        files.length > 0
                        &&
                        <div className='flex items-center gap-x-6 mb-3'>
                            {
                                files.map((f) => (
                                    <ChatFile key={"cmf" + f.url} name={f.name} url={f.url} type={f.type} />
                                ))
                            }
                        </div>
                    }
                    <div className=" w-fit max-w-3/5 bg-accent p-4 rounded-xl">{message.content}</div>
                    <div className='hidden group-hover:flex items-center absolute bottom-0'>
                        {
                            siblings.length > 1
                            &&
                            (
                                <>
                                    <Button onClick={() => handleSwitchBranch(getCurrentIndex() - 1)} disabled={getCurrentIndex() === 1} size={"icon"} variant={"ghost"}><ChevronLeftIcon /></Button>
                                    <span className='text-sm mx-2'>{getCurrentIndex()}/{siblings.length}</span>
                                    <Button onClick={() => handleSwitchBranch(getCurrentIndex() + 1)} disabled={getCurrentIndex() === siblings.length} size={"icon"} variant={"ghost"}><ChevronRightIcon /></Button>
                                </>
                            )
                        }
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button disabled={copied} onClick={handleCopy} size={"icon"} variant={"ghost"}>
                                    {copied
                                        ?
                                        (
                                            <CheckIcon />
                                        )
                                        :
                                        (
                                            <CopyIcon />
                                        )
                                    }
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Copy</p></TooltipContent>
                        </Tooltip>
                        {
                            !message.hasFiles
                            &&
                            (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button onClick={() => { setIsEditing(true) }} size={"icon"} variant={"ghost"}>
                                            <PencilIcon />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Edit</p></TooltipContent>
                                </Tooltip>
                            )
                        }
                    </div>
                </div>
            )
            :
            (
                <div className='chat-message'>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex, rehypeHighlight]}
                    >{message.content}</ReactMarkdown>
                    <div className='flex items-center'>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button disabled={copied} onClick={handleCopy} size={"icon"} variant={"ghost"}>
                                    {copied
                                        ?
                                        (
                                            <CheckIcon />
                                        )
                                        :
                                        (
                                            <CopyIcon />
                                        )
                                    }
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Copy</p></TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            )
    )
        ;
}

export default ChatMessage;