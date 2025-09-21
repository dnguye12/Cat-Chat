import Folder from "@/components/Folder";
import Prism from "@/components/Prism";
import { Button } from "@/components/ui/button";
import { Globe } from "@/components/ui/globe";
import { ExternalLink, ImageUpIcon, MessagesSquareIcon, MicIcon, SquareStackIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
    {
        Icon: MessagesSquareIcon,
        title: "Chat Completion",
        desc: "Talking directly to our AI models with a chat interface"
    },
    {
        Icon: ImageUpIcon,
        title: "Images and PDF support",
        desc: "Upload your files directly to our system and ask our AI to work with those files"
    },
    {
        Icon: SquareStackIcon,
        title: "Dialogue branching",
        desc: "Robust dialogue branch/switch system"
    },
    {
        Icon: MicIcon,
        title: "Voice Mode",
        desc: "Speaking directly to our models."
    }
]

const Page = () => {
    return (
        <div className="w-screen overflow-hidden p-4">
            <div className="container mx-auto max-w-7xl h-full flex flex-col gap-4">
                <div className="relative rounded-3xl border overflow-hidden bg-sidebar/66">
                    <div className="relative flex flex-col items-center justify-center z-50 py-12 md:py-20">
                        <Image
                            src={"/logo.svg"}
                            width={60}
                            height={40}
                            alt="logo"
                        />
                        <h1 className="text-2xl md:text-4xl font-bold text-shadow-2xs text-center my-4 md:my-8">An useful AI assistant that<br />increases your speed</h1>
                        <div className="flex justify-center gap-x-4">
                            <Button size={"lg"} asChild>
                                <Link href={"/"}>Get Started</Link>
                            </Button>
                            <Button variant={"secondary"} size={"lg"} className="bg-accent/66 backdrop-blur-sm border" asChild>
                                <a href='#about'>
                                    About Me</a>
                            </Button>
                        </div>

                    </div>
                    <div className="absolute top-0 left-0 w-full h-full z-10">
                        <Prism
                            animationType="rotate"
                            timeScale={0.5}
                            scale={3.6}
                            height={3.5}
                            baseWidth={5.5}
                            noise={0}
                            glow={1}
                            hueShift={0}
                            colorFrequency={1}
                        />
                    </div>
                </div>
                <div className="rounded-3xl border overflow-hidden bg-sidebar/66 p-4 pt-0">
                    <div className="text-center py-8">
                        <h2 className="text-2xl md:text-4xl font-bold mb-4">Features</h2>
                        <p className="text-center text-muted-foreground">Built on the public API of Mistral AI,</p>
                        <p className="text-center text-muted-foreground">our system can play a fast and impactful role to empower your workflow.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {features.map((f) => (
                            <div key={f.title} className="flex flex-col items-center text-center bg-sidebar rounded-lg border p-4">
                                <div className="min-w-10 h-10 bg-foreground rounded-lg flex justify-center items-center">
                                    <f.Icon className=" text-neutral-900" />
                                </div>
                                <h5 className="text-xl font-bold my-4">{f.title}</h5>
                                <p className=" text-muted-foreground">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div id="about" className="rounded-3xl border overflow-hidden bg-sidebar/66 p-4 pt-0">
                    <div className="text-center py-8">
                        <h2 className="text-2xl md:text-4xl font-bold mb-4">About Me</h2>
                        <p className="text-center text-muted-foreground">If you are interested in my work,</p>
                        <p className="text-center text-muted-foreground">take a look at my personal website or my CV to learn more about me.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-sidebar rounded-lg border p-4">
                            <div className="aspect-video relative flex items-center justify-center overflow-hidden rounded-lg border">
                                <Globe className="top-0 z-0" />
                                <div className="z-20 pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,1),rgba(255,255,255,0))]" />
                            </div>
                            <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center mt-4">
                                <div>
                                    <h5 className="text-xl font-bold">My personal website</h5>
                                    <p className="text-muted-foreground">See my projects and experiences</p>
                                </div>
                                <Button size={"lg"} asChild>
                                    <a href="https://www.duc-huy.com/" target="_blank" className="w-full sm:w-auto">Visit site <ExternalLink /></a>
                                </Button>
                            </div>
                        </div>
                        <div className="bg-sidebar rounded-lg border p-4">
                            <div className="aspect-video relative flex items-center justify-center overflow-hidden rounded-lg border">
                                <a href="https://www.duc-huy.com/about/Resume%20english.pdf" target="_blank">
                                    <Folder />
                                </a>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center mt-4">
                                <div>
                                    <h5 className="text-xl font-bold">My CV</h5>
                                    <p className="text-muted-foreground">You can also click on the folder to view it.</p>
                                </div>
                                <Button size={"lg"} asChild className="w-full sm:w-auto">
                                    <a href="https://www.duc-huy.com/about/Resume%20english.pdf" target="_blank">View My CV <ExternalLink /></a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;