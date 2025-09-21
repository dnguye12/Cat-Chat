"use client"

import { Button } from "@/components/ui/button";
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { useAppSidebar } from "@/providers/AppSidebarProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod"

interface EditDialogProps {
    chatId: string
}

const EditDialog = ({ chatId }: EditDialogProps) => {
    const [pending, setPending] = useState<boolean>(false)
    const closeButtonRef = useRef<HTMLButtonElement>(null)
    const {editChatTitle} = useAppSidebar()

    const formSchema = z.object({
        newTitle: z.string().min(1, {
            message: "New title cannot be empty"
        })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newTitle: ""
        }
    })

    const onSubmit = async () => {
        if (!pending) {
            try {
                setPending(true)
                const res = await fetch(`/api/chat/${chatId}/updateTitle`, {
                    method: "PATCH",
                    body: JSON.stringify({
                        newTitle: form.getValues().newTitle
                    })
                })

                if (!res.ok) {
                    toast.error(await res.text())
                }
                editChatTitle(chatId, form.getValues().newTitle)
            } catch (e) {
                console.log(e)
            } finally {
                setPending(false)
                form.reset()
                closeButtonRef?.current?.click()
            }


        }
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit chat title</DialogTitle>
                <DialogDescription>
                    Make changes to your chat title here. Click save when you&apos;re done.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="newTitle"
                        render={({ field }) => (
                            <FormItem className="grid gap-3">
                                <FormLabel>New Title</FormLabel>
                                <FormControl >

                                    <Input placeholder="New chat title" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <DialogFooter className="mt-3">
                        <DialogClose asChild>
                            <Button ref={closeButtonRef} type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    );
}

export default EditDialog;