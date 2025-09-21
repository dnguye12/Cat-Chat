"use client"

import { ModelOptions } from "@/types/mistral";
import { createContext, useContext, useMemo, useState } from "react";

type Context = {
    model: ModelOptions;
    setModel: (m: ModelOptions) => void;
}

const ModelContext = createContext<Context | null>(null)

export function useModel() {
    const ctx = useContext(ModelContext)
    if (!ctx) {
        throw new Error("useModel must be used within <ModelProvider>");
    }
    return ctx
}

export default function ModelProvider({ children }: { children: React.ReactNode }) {
    const [model, setModelState] = useState<ModelOptions>("mistral-small-latest")

    const setModel = (m: ModelOptions) => {
        setModelState(m)
    }

    const value = useMemo(() => ({ model, setModel }), [model])

    return <ModelContext.Provider value={value}>{children}</ModelContext.Provider>
}