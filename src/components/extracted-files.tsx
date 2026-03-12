import { LuFileArchive, LuHardDrive, LuPackage } from "react-icons/lu"
import { toast } from "sonner"

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "./ui/card"
import { Button } from "./ui/button"

export function ExtractedFiles() {
    return (
        <div className="flex flex-col gap-6 p-8">
            <header className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight">
                    Extracted Assets
                </h1>
                <p className="text-muted-foreground">
                    Browse your local Dragon City assets library.
                </p>
            </header>

            <div className="grid gap-6">
                <Card className="border-none shadow-lg shadow-secondary/5 ring-1 ring-border">
                    <CardHeader>
                        <CardTitle>Local Asset Library</CardTitle>
                        <CardDescription>
                            All your successfully extracted files are stored
                            here.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border-2 border-dashed border-border py-24 text-center bg-muted/20 transition-all hover:bg-muted/30">
                            <div className="bg-background flex size-20 items-center justify-center rounded-3xl shadow-sm ring-1 ring-border group transition-all hover:ring-primary/40">
                                <LuPackage className="size-10 text-muted-foreground transition-colors group-hover:text-primary" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-xl font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                                    Ready for exploration
                                </h3>
                                <p className="text-muted-foreground max-w-sm px-4 text-sm font-medium leading-relaxed italic opacity-70">
                                    Open your local storage to view extracted
                                    assets (JSON, PNG, Unity files, etc.).
                                </p>
                            </div>
                            <Button
                                variant="secondary"
                                className="px-8 font-black uppercase tracking-widest text-xs h-12 shadow-sm"
                                onClick={() =>
                                    toast.info(
                                        "Initializing system explorer...",
                                    )
                                }
                            >
                                <LuHardDrive className="mr-2 size-4" />
                                Browse on Disk
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-none bg-linear-to-bl from-accent/5 to-transparent shadow-md ring-1 ring-border overflow-hidden">
                        <div className="h-1 bg-accent/20" />
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.25em] opacity-40">
                                Storage Matrix Path
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center gap-4 py-4">
                            <div className="bg-background flex size-12 items-center justify-center rounded-xl shadow-sm ring-1 ring-border transition-all hover:ring-accent/40">
                                <LuHardDrive className="text-accent size-6" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-black italic tracking-tight truncate">
                                    ~/DragonCityToolkit/extracted/
                                </span>
                                <span className="text-muted-foreground text-[10px] uppercase tracking-[0.3em] font-black opacity-50">
                                    Local Base Repository
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none bg-linear-to-br from-primary/5 to-transparent shadow-md ring-1 ring-border overflow-hidden">
                        <div className="h-1 bg-primary/20" />
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.25em] opacity-40">
                                Asset Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center gap-4 py-4">
                            <div className="bg-background flex size-12 items-center justify-center rounded-xl shadow-sm ring-1 ring-border transition-all hover:ring-primary/40">
                                <LuFileArchive className="text-primary size-6" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-black italic tracking-tight truncate">
                                    Static Resources & Scripts
                                </span>
                                <span className="text-muted-foreground text-[10px] uppercase tracking-[0.3em] font-black opacity-50">
                                    System Verified
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
