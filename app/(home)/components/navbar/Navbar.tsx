import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ModelSelector from "./components/ModelSelector";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Navbar = () => {


    return (
        <header className="fixed w-full z-50 flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-sidebar">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4!" />
            <ModelSelector />

            <Button className="fixed right-4" asChild>
                <Link href={"/about"}>About Page</Link>
            </Button>
        </header>
    );
}

export default Navbar;