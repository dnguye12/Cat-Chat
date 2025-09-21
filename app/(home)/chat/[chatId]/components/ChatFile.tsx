import { FileIcon } from "lucide-react";

interface ChatFileProps {
    name: string;
    url: string;
    type: string;
}

const ChatFile = ({name, url, type}: ChatFileProps) => {
    return ( 
        type === "application/pdf"
            ?
            (
                <a href={url} target="_blank" className="bg-red-500/50 rounded-lg h-32 w-32 relative flex flex-col items-start justify-end px-2 py-1">
                    <FileIcon className="min-w-16 h-16 absolute top-1/2 left-1/2 -translate-1/2" />
                    <p className="text-foreground w-full truncate">{name}</p>
                </a>
            )
            :
            (
                <a href={url} target="_blank" className="bg-cover rounded-lg h-32 w-32 relative flex flex-col items-start justify-end px-2 py-1"
                    style={{
                        backgroundImage: `url(${url})`
                    }}
                >
                </a>
            )
     );
}
 
export default ChatFile;