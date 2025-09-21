import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import ModelProvider from "@/providers/ModelProvider";
import AppSidebarProvider from "@/providers/AppSidebarProvider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chat Application",
  description: "Chat Application using Mistral API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <SidebarProvider>
          <ModelProvider>
            <AppSidebarProvider>
              {children}
              <Toaster />
            </AppSidebarProvider>
          </ModelProvider>
          </SidebarProvider>
        </body>
      </html>
  );
}
