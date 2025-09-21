"use client"

import Navbar from "./components/navbar/Navbar";
import FormInput from "./components/form-input/FormInput";
import { ClapperboardIcon, ComputerIcon, CookingPotIcon, RadicalIcon, UploadIcon } from "lucide-react";
import { useState } from "react";

const rec = [
  {
    Icon: CookingPotIcon,
    title: "Cooking recipe recommendations",
    desc: "Recommend me some random food recipes for a French dinner for a family of 4."
  },
  {
    Icon: ClapperboardIcon,
    title: "Netflix next movie",
    desc: "Search for a scifi movie with Ryan Gosling as an actor in it."
  },
  {
    Icon: RadicalIcon,
    title: "Math question help",
    desc: "Can you help me solve 1+1 please?"
  },
  {
    Icon: ComputerIcon,
    title: "Programming assistant",
    desc: "Print 'hello world' in Javascript, step by step tutorial."
  }
]

export default function Home() {
  const [preFill, setPreFill] = useState("")

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 flex flex-col items-center justify-between max-w-3xl h-[calc(100vh-64px)] mt-16 pb-7">
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <p className=" text-4xl font-bold mb-4"><span className="waving-hand">👋</span> Hello there</p>
          <p className="hidden sm:block">I am your personal intelligent assistant. How can I assist you today?</p>
          <p className="hidden sm:block">If you need to submit an image or a document, you can click on <UploadIcon className=" size-5 inline" /> to upload them</p>
          <p className="block sm:hidden text-center">I am your personal intelligent assistant. How can I assist you today? If you need to submit an image or a document, you can click on <UploadIcon className=" size-5 inline" /> to upload them</p>
          <div className="flex flex-col items-start w-full mt-4 sm:mt-16">
            <p className="text-muted-foreground">Random topic to ask our AI:</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-4 w-full py-4">
              {
                rec.map((r) => (
                  <div onClick={() => { setPreFill(r.desc) }} key={r.title} className=" cursor-pointer p-4 border bg-sidebar rounded-lg flex items-center gap-3 hover:bg-accent">
                    <r.Icon className="min-w-10 h-10" />
                    <div className="flex flex-col  gap-2">
                      <p className="font-bold">{r.title}</p>
                      <p className="text-muted-foreground text-sm">{r.desc}</p>
                    </div>
                  </div>
                ))
              }

            </div>
          </div>
        </div>
        <FormInput preFill={preFill} />
      </div>
    </>
  );
}
