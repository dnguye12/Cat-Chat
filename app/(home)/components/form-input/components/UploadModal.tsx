"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { UploadFile } from "@/types/types";
import { UploadDropzone } from "@/utils/uploadthing";
import { Dispatch, SetStateAction } from "react";

interface UploadModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setFiles: Dispatch<SetStateAction<UploadFile[]>>
}

const UploadModal = ({ open, onOpenChange, setFiles }: UploadModalProps) => {

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload image or PDF</DialogTitle>
                </DialogHeader>
                <UploadDropzone
                    endpoint="fileUploader"
                    onClientUploadComplete={(res) => {
                        setFiles((prev) => {
                            const next = [...prev]
                            if (!next.some((x) => x.url === res[0].ufsUrl)) {
                                next.push(res[0])
                            }
                            return next
                        })
                        onOpenChange(false)
                    }}
                    onUploadError={(error: Error) => { console.log(error) }}
                    appearance={{
                        button({ ready }) {
                            return {
                                padding: "16px 8px",
                                marginTop: "8px",
                                background: "var(--accent)",
                                ...(ready && { background: "#3b82f6" })
                            }
                        }
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}

export default UploadModal;