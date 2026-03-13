import { SidebarTrigger } from "../ui/sidebar"
import { Separator } from "../ui/separator"
import { ModeToggle } from "./mode-toggle"

export function AppHeader() {
    return (
        <header className="sticky top-0 z-50 flex h-14 items-center justify-between bg-background/95 px-6 backdrop-blur-md border-b">
            <div className="flex items-center gap-4">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span 
                        className="hover:text-foreground transition-all cursor-pointer"
                        onClick={() => window.location.hash = "#/"}
                    >
                        System
                    </span>
                    <span>/</span>
                    <span className="text-foreground font-semibold">
                        DC APK Toolkit
                    </span>
                </nav>
            </div>
            <div className="flex items-center gap-4">
                <ModeToggle />
            </div>
        </header>
    )
}
