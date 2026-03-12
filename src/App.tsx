import { HashRouter, Routes, Route } from "react-router-dom"

import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "./components/ui/sidebar"
import { ExtractedFiles } from "./components/extracted-files"
import { ToolkitSidebar } from "./components/toolkit-sidebar"
import { TooltipProvider } from "./components/ui/tooltip"
import { Downloader } from "./components/Downloader"
import { Dashboard } from "./components/Dashboard"
import { Toaster } from "./components/ui/sonner"
import "./App.css"

function App() {
    return (
        <HashRouter>
            <TooltipProvider>
                <SidebarProvider>
                    <ToolkitSidebar />
                    <SidebarInset className="relative overflow-hidden bg-background">
                        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 bg-background/80 px-6 backdrop-blur-md ring-1 ring-border shadow-sm">
                            <SidebarTrigger />
                            <div className="bg-muted mx-2 h-4 w-px" />
                            <nav className="flex items-center gap-2 overflow-hidden text-xs font-black uppercase tracking-[0.2em] opacity-60">
                                <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                                    DC Toolkit
                                </span>
                                <span className="text-muted-foreground px-1 opacity-20">
                                    /
                                </span>
                                <span className="text-foreground italic">
                                    System
                                </span>
                            </nav>
                        </header>
                        <main className="relative flex-1 bg-linear-to-b from-primary/5 via-transparent to-transparent">
                            {/* Aesthetic background matrix effects */}
                            <div className="absolute top-0 right-0 -z-10 h-96 w-96 bg-primary/10 blur-[100px] rounded-full opacity-30 pointer-events-none translate-x-32 -translate-y-32" />
                            <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 bg-secondary/10 blur-[100px] rounded-full opacity-30 pointer-events-none -translate-x-32 translate-y-32" />

                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route
                                    path="/downloader"
                                    element={<Downloader />}
                                />
                                <Route
                                    path="/files"
                                    element={<ExtractedFiles />}
                                />
                                <Route
                                    path="/settings"
                                    element={
                                        <div className="flex flex-col gap-6 p-8">
                                            <header className="flex flex-col gap-2">
                                                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                                                    Settings
                                                </h1>
                                                <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.25em] opacity-40">
                                                    System configuration
                                                </p>
                                            </header>
                                            <div className="bg-muted/30 border border-dashed border-border rounded-2xl py-24 flex flex-col items-center justify-center gap-4 opacity-50 italic">
                                                <span className="text-sm font-semibold uppercase tracking-widest">
                                                    Module under development
                                                </span>
                                                <p className="text-xs max-w-xs text-center leading-relaxed">
                                                    System parameters and core
                                                    configuration options will
                                                    be available here in the
                                                    next update.
                                                </p>
                                            </div>
                                        </div>
                                    }
                                />
                            </Routes>
                        </main>
                        <Toaster
                            closeButton
                            position="bottom-right"
                            theme="system"
                        />
                    </SidebarInset>
                </SidebarProvider>
            </TooltipProvider>
        </HashRouter>
    )
}

export default App
