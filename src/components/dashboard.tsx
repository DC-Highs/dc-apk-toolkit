import {
    LuSearch,
    LuDownload,
    LuBox,
    LuFolderOpen,
    LuArrowRight,
} from "react-icons/lu"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { toast } from "sonner"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card"
import { apkService, ApkInfo } from "../services/apk-service"
import { Skeleton } from "./ui/skeleton"
import { Button } from "./ui/button"

export function Dashboard() {
    const navigate = useNavigate()
    const [latestVersion, setLatestVersion] = useState<ApkInfo | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const checkVersion = async () => {
        setIsLoading(true)
        try {
            const info = await apkService.getLatestVersion()
            setLatestVersion(info)
            toast.success(`Found latest version: ${info.version}`)
        } catch (error) {
            console.error(error)
            toast.error("Failed to fetch latest version")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        checkVersion()
    }, [])

    return (
        <div className="flex flex-col gap-6 p-8">
            <header className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight">
                    Dragon City Toolkit
                </h1>
                <p className="text-muted-foreground">
                    Manage your Dragon City APKs with ease.
                </p>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="relative overflow-hidden border-none bg-linear-to-br from-primary/10 to-transparent shadow-lg ring-1 ring-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LuSearch className="text-primary size-5" />
                            Latest Version
                        </CardTitle>
                        <CardDescription>From APKPure</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-[100px]" />
                                <Skeleton className="h-4 w-[150px]" />
                            </div>
                        ) : latestVersion ? (
                            <div className="flex flex-col gap-1">
                                <span className="text-3xl font-bold">
                                    {latestVersion.version}
                                </span>
                                <span className="text-muted-foreground text-xs uppercase tracking-widest font-bold">
                                    Stable release
                                </span>
                            </div>
                        ) : (
                            <span className="text-muted-foreground italic">
                                Version unknown
                            </span>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant="secondary"
                            className="bg-primary/20 hover:bg-primary/30 w-full font-semibold uppercase tracking-widest text-xs"
                            disabled={isLoading}
                            onClick={checkVersion}
                        >
                            <LuSearch className="mr-2 size-4" />
                            Check Again
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="relative overflow-hidden border-none bg-linear-to-br from-secondary/10 to-transparent shadow-lg ring-1 ring-secondary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LuDownload className="text-secondary size-5" />
                            Quick Actions
                        </CardTitle>
                        <CardDescription>Ready to download?</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        <Button
                            className="w-full justify-between"
                            disabled={!latestVersion}
                            onClick={() => navigate("/downloader")}
                        >
                            Open Downloader
                            <LuArrowRight className="size-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-between"
                            onClick={() => navigate("/files")}
                        >
                            Browse Extracted
                            <LuFolderOpen className="size-4" />
                        </Button>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-none bg-linear-to-br from-accent/10 to-transparent shadow-lg ring-1 ring-accent/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LuBox className="text-accent size-5" />
                            Current Status
                        </CardTitle>
                        <CardDescription>System diagnostics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground text-xs uppercase tracking-widest font-bold opacity-60">
                                    Backend
                                </span>
                                <span className="text-xs font-bold text-green-500 uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded-full">
                                    Connected
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground text-xs uppercase tracking-widest font-bold opacity-60">
                                    Internet
                                </span>
                                <span className="text-xs font-bold text-green-500 uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded-full">
                                    Online
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <section className="mt-8 flex flex-col gap-6">
                <h2 className="text-2xl font-bold tracking-tight">
                    Getting Started
                </h2>
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="bg-card flex flex-col gap-4 rounded-xl border p-6 shadow-sm transition-all hover:shadow-md hover:ring-1 hover:ring-primary/20">
                        <div className="bg-primary/10 flex size-12 items-center justify-center rounded-xl text-primary font-bold text-lg">
                            1
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold uppercase tracking-widest text-sm text-foreground">
                                Check Version
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                We'll automatically find the latest version from
                                APKPure for you.
                            </p>
                        </div>
                    </div>
                    <div className="bg-card flex flex-col gap-4 rounded-xl border p-6 shadow-sm transition-all hover:shadow-md hover:ring-1 hover:ring-primary/20">
                        <div className="bg-primary/10 flex size-12 items-center justify-center rounded-xl text-primary font-bold text-lg">
                            2
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold uppercase tracking-widest text-sm text-foreground">
                                Download APK
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                High-speed servers for reliable builds. Split
                                APKs are handled automatically.
                            </p>
                        </div>
                    </div>
                    <div className="bg-card flex flex-col gap-4 rounded-xl border p-6 shadow-sm transition-all hover:shadow-md hover:ring-1 hover:ring-primary/20">
                        <div className="bg-primary/10 flex size-12 items-center justify-center rounded-xl text-primary font-bold text-lg">
                            3
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold uppercase tracking-widest text-sm text-foreground">
                                Extract Assets
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Get all game assets unpacked and ready for
                                development or inspection.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
