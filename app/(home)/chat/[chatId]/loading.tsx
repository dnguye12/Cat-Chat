import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "../../components/navbar/Navbar";

export default function Loading() {
    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center h-[calc(100vh-64px)] relative mt-16">
                <div className="container max-w-3xl flex-1 pt-4 pb-48 flex flex-col relative">
                    <div className="flex flex-col py-10 gap-y-10 w-full">
                        <div className="w-full flex justify-end">
                            <Skeleton className="w-3/4 p-16" />
                        </div>
                        <div className="w-full flex">
                            <Skeleton className="w-3/4 p-16" />
                        </div>
                        <div className="w-full flex justify-end">
                            <Skeleton className="w-3/4 p-16" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}