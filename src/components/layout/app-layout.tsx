import { ReactNode } from "react"
import { Toaster } from "sonner"

import { SidebarInset } from "../ui/sidebar"
import { AppHeader } from "./app-header"
import { AppSidebar } from "./app-sidebar"

interface AppLayoutProps {
    children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
    return (
        <>
            <AppSidebar />
            <SidebarInset className="relative overflow-hidden bg-background">
                <AppHeader />
                <main className="relative flex-1">
                    <div className="relative z-10 h-full overflow-y-auto">
                        {children}
                    </div>
                </main>
                <Toaster/>
            </SidebarInset>
        </>
    )
}
