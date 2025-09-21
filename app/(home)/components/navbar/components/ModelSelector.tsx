"use client"

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useModel } from "@/providers/ModelProvider";
import { AllModels, getModelLabel  } from "@/types/mistral";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

const ModelSelector = () => {
    const {model, setModel} = useModel()


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} size={"sm"}>{getModelLabel(model)} <ChevronDownIcon /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {AllModels.map((m, idx) => (
                    <DropdownMenuItem key={idx + m.label} className="pr-8 relative" onClick={() => setModel(m.value)}>
                        <div>
                            <p className="text-sm">{m.label}</p>
                            <p className="text-xs text-muted-foreground">{m.desc}</p>
                            </div>
                        {m.value === model && (
                            <CheckIcon className="absolute right-1" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default ModelSelector;