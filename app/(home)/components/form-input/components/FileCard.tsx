import { deleteFileByKey } from "@/app/actions/uploadthing";
import { Button } from "@/components/ui/button";
import { UploadFile } from "@/types/types";
import { FileIcon, XIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface FileCardProps {
    file: UploadFile;
    setFiles: Dispatch<SetStateAction<UploadFile[]>>
}

const FileCard = ({ file, setFiles }: FileCardProps) => {
    const handleDelete = async () => {
        setFiles((prev) => prev.filter((f) => f.key !== file.key))

        try {
            await deleteFileByKey(file.key)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        file.type === "application/pdf"
            ?
            (
                <div className="bg-red-500/50 rounded-lg h-32 w-32 relative flex flex-col items-start justify-end px-2 py-1">
                    <FileIcon className="min-w-16 h-16 absolute top-1/2 left-1/2 -translate-1/2" />
                    <p className="text-foreground w-full truncate">{file.name}</p>
                    <Button type="button" onClick={handleDelete} size={"icon"} variant={"destructive"} className="absolute -top-3 -right-3 rounded-full size-6"><XIcon /></Button>
                </div>
            )
            :
            (
                <div className="bg-cover rounded-lg h-32 w-32 relative flex flex-col items-start justify-end px-2 py-1"
                    style={{
                        backgroundImage: `url(${file.url})`
                    }}
                >
                    <Button type="button" onClick={handleDelete} size={"icon"} variant={"destructive"} className="absolute -top-3 -right-3 rounded-full size-6"><XIcon /></Button>
                </div>
            )
    )
        ;
}

export default FileCard;