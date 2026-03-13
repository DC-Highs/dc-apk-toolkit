import {
    LuSearch,
    LuDownload,
    LuBox,
    LuFolderOpen,
    LuArrowRight,
    LuRefreshCw,
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
} from "../../components/ui/card"
import { apkService } from "../../services/apk-service"
import { ApkVersion } from "../../types/apk"
import { Skeleton } from "../../components/ui/skeleton"
import { Button } from "../../components/ui/button"

export function Dashboard() {
    const navigate = useNavigate()
    const [latestVersion, setLatestVersion] = useState<ApkVersion | null>(null)
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
        <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto">
            <header className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-primary" />
                    <span className="text-xs text-muted-foreground font-medium">
                        System Ready
                    </span>
                </div>
                <h1 className="text-5xl font-bold tracking-tight">
                    Dragon City Toolkit
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                    A clinical utility suite for Dragon City APK management, asset extraction, and version tracking.
                </p>
            </header>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <LuSearch className="size-24 -rotate-12" />
                    </div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <LuSearch className="size-5" />
                            Latest Version
                        </CardTitle>
                        <CardDescription>Up-to-date tracking</CardDescription>
                    </CardHeader>
                    <CardContent className="min-h-[100px] flex flex-col justify-center">
                        {isLoading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-10 w-[140px]" />
                                <Skeleton className="h-4 w-[180px]" />
                            </div>
                        ) : latestVersion ? (
                            <div className="flex flex-col gap-1">
                                <span className="text-4xl font-bold tracking-tighter">
                                    {latestVersion.version}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground text-xs bg-muted px-2 py-0.5 rounded-sm">
                                        Production Build
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <span className="text-muted-foreground italic">
                                Could not fetch version
                            </span>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant="secondary"
                            className="w-full text-xs h-9 gap-2"
                            disabled={isLoading}
                            onClick={checkVersion}
                        >
                            <LuRefreshCw className={`size-3 ${isLoading ? "animate-spin" : ""}`} />
                            Sync Now
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="relative overflow-hidden group">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-foreground">
                            <LuDownload className="size-5" />
                            Quick Access
                        </CardTitle>
                        <CardDescription>Direct system controls</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        <Button
                            className="w-full justify-between h-10 px-4 text-sm font-medium group/btn"
                            disabled={!latestVersion}
                            onClick={() => navigate("/downloader")}
                        >
                            Initiate Download
                            <LuArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-between h-10 px-4 text-sm font-medium"
                            onClick={() => navigate("/files")}
                        >
                            Explore Local Assets
                            <LuFolderOpen className="size-4" />
                        </Button>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LuBox className="size-5" />
                            Core Status
                        </CardTitle>
                        <CardDescription>Live health monitoring</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                                <span className="text-xs text-muted-foreground font-medium">
                                    Tauri Core
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className="size-1.5 rounded-full bg-green-500" />
                                    <span className="text-xs font-medium text-green-500">
                                        v2.0.0
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                                <span className="text-xs text-muted-foreground font-medium">
                                    Environment
                                </span>
                                <span className="text-xs font-medium">
                                    Development
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <section className="space-y-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold tracking-tight">
                        Pipeline Workflow
                    </h2>
                    <div className="h-px flex-1 bg-border" />
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                    {[
                        { step: 1, title: "Version Discovery", desc: "Automated scraping of public repositories to find the latest Dragon City releases." },
                        { step: 2, title: "Atomic Download", desc: "Concurrent streaming downloads with SHA verification and split-APK assembly." },
                        { step: 3, title: "Resource Deep-Dive", desc: "Recursive extraction of Unity assets, localized strings, and high-res sprites." }
                    ].map((item) => (
                        <div key={item.step} className="group relative bg-card flex flex-col gap-4 rounded-lg border p-6 transition-all hover:bg-accent">
                            <div className="size-8 flex items-center justify-center rounded bg-primary/10 text-primary font-bold text-xs ring-1 ring-primary/20">
                                {item.step}
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed opacity-80">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
