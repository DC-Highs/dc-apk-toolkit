import { HashRouter } from "react-router-dom"
import { ReactNode } from "react"

import { ThemeProvider } from "./providers/theme-provider"
import { SidebarProvider } from "./ui/sidebar"
import { TooltipProvider } from "./ui/tooltip"

interface ProvidersProps {
    children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
    return (
        <HashRouter>
            <ThemeProvider defaultTheme="dark" storageKey="dc-toolkit-theme">
                <TooltipProvider>
                    <SidebarProvider>
                        {children}
                    </SidebarProvider>
                </TooltipProvider>
            </ThemeProvider>
        </HashRouter>
    )
}
