import AppSidebar from "./components/app-sidebar/AppSidebar";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AppSidebar />
            <main className="w-full">
                {children}
            </main></>
    )
}