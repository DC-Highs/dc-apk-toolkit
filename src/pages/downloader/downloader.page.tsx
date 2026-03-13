import { LuDownload, LuBox, LuLoaderCircle, LuCircleCheck, LuFileJson, LuArrowLeft } from "react-icons/lu"
import { listen, UnlistenFn } from "@tauri-apps/api/event"
import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { ProgressPayload, ApkVersion } from "../../types/apk"
import { apkService } from "../../services/apk-service"
import { Progress } from "../../components/ui/progress"
import { Skeleton } from "../../components/ui/skeleton"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"

export function Downloader() {
    const navigate = useNavigate()
    const [latestVersion, setLatestVersion] = useState<ApkVersion | null>(null)
    const [isLoadingVersion, setIsLoadingVersion] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [isExtracting, setIsExtracting] = useState(false)
    const [downloadProgress, setDownloadProgress] = useState<ProgressPayload | null>(null)
    const [extractionStatus, setExtractionStatus] = useState<string>("")

    const fetchVersion = useCallback(async () => {
        setIsLoadingVersion(true)
        try {
            const info = await apkService.getLatestVersion()
            setLatestVersion(info)
        } catch (error) {
            console.error(error)
            toast.error("Failed to fetch latest version info")
        } finally {
            setIsLoadingVersion(false)
        }
    }, [])

    useEffect(() => {
        fetchVersion()
    }, [fetchVersion])

    useEffect(() => {
        let unlisten: UnlistenFn | undefined
        const setupListener = async () => {
            unlisten = await listen<ProgressPayload>("download-progress", (event) => {
                setDownloadProgress(event.payload)
            })
        }
        setupListener()
        return () => {
            if (unlisten) unlisten()
        }
    }, [])

    useEffect(() => {
        let unlisten: UnlistenFn | undefined
        const setupListener = async () => {
            unlisten = await listen<any>("extraction-progress", (event) => {
                // event.payload might be a string or ExtractionProgress object based on our Rust implementation
                if (typeof event.payload === "string") {
                    setExtractionStatus(event.payload)
                } else if (event.payload.current_file) {
                    setExtractionStatus(`Extracting: ${event.payload.current_file}`)
                }
            })
        }
        setupListener()
        return () => {
            if (unlisten) unlisten()
        }
    }, [])

    const startProcess = async () => {
        if (!latestVersion) return

        setIsDownloading(true)
        setDownloadProgress(null)

        try {
            const appDir = await apkService.getAppDir()
            const separator = appDir.includes("\\") ? "\\" : "/"
            
            const apkName = `dragon_city_${latestVersion.version}.apk`
            const targetPath = `${appDir}${separator}${apkName}`
            const extractDir = `${appDir}${separator}extracted_${latestVersion.version}`
            
            await apkService.downloadApk(latestVersion.url, targetPath)
            toast.success("Download complete!")
            
            setIsDownloading(false)
            setIsExtracting(true)
            
            await apkService.extractPackage(targetPath, extractDir)
            toast.success("Extraction complete!")
            
            setTimeout(() => {
                navigate("/files")
            }, 1000)
        } catch (error) {
            console.error(error)
            toast.error("Process failed: " + error)
        } finally {
            setIsDownloading(false)
            setIsExtracting(false)
        }
    }

    return (
        <div className="flex flex-col gap-8 p-8 max-w-5xl mx-auto">
            <header className="flex flex-col gap-4">
                <Button 
                    variant="ghost" 
                    size="sm"
                    className="w-fit text-muted-foreground hover:text-foreground -ml-2"
                    onClick={() => navigate("/")}
                >
                    <LuArrowLeft className="mr-2 size-4" />
                    Back to Overview
                </Button>
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">System Acquisition</h1>
                    <p className="text-muted-foreground mt-1">Download and prepare Dragon City binaries for analysis.</p>
                </div>
            </header>

            <div className="grid gap-8 md:grid-cols-2">
                <Card className="p-8 flex flex-col gap-6 relative overflow-hidden">
                    
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-muted-foreground">Source Target</span>
                        <h2 className="text-xl font-bold">Latest Package</h2>
                    </div>

                    <div className="space-y-4 relative z-10">
                        {isLoadingVersion ? (
                            <div className="space-y-2">
                                <Skeleton className="h-10 w-full rounded-xl" />
                                <Skeleton className="h-20 w-full rounded-xl" />
                            </div>
                        ) : latestVersion ? (
                            <div className="flex flex-col gap-6">
                                <div className="p-4 rounded-lg bg-muted border flex items-center justify-between">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-xs font-medium text-muted-foreground">Version Code</span>
                                        <span className="text-lg font-mono font-bold text-primary">{latestVersion.version}</span>
                                    </div>
                                    <LuFileJson className="size-6 text-muted-foreground" />
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm text-foreground/80">
                                        <LuCircleCheck className="text-primary size-4" />
                                        Verified Signature
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-foreground/80">
                                        <LuCircleCheck className="text-primary size-4" />
                                        Multiple APK Support (XAPK)
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center bg-muted rounded-lg border border-dashed text-muted-foreground text-sm">
                                Version information unavailable.
                            </div>
                        )}
                    </div>

                    <Button 
                        size="lg"
                        className="mt-auto font-bold transition-all"
                        disabled={!latestVersion || isDownloading || isExtracting}
                        onClick={startProcess}
                    >
                        {isDownloading || isExtracting ? (
                            <div className="flex items-center gap-2">
                                <LuLoaderCircle className="size-5 animate-spin" />
                                {isDownloading ? "Streaming Assets..." : "Expanding Package..."}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <LuDownload className="group-hover:translate-y-0.5 transition-transform" />
                                Initialize Download Pipeline
                            </div>
                        )}
                        
                        {(isDownloading || isExtracting) && (
                            <div className="absolute bottom-0 left-0 h-1 bg-white/20 transition-all duration-300" style={{ width: `${downloadProgress?.percentage || 0}%` }} />
                        )}
                    </Button>
                </Card>

                <div className="flex flex-col gap-6">
                    <Card className="p-8 flex-1 flex flex-col gap-6">
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-muted-foreground">Pipeline Status</span>
                            <h2 className="text-lg font-bold">Real-time Telemetry</h2>
                        </div>

                        {!isDownloading && !isExtracting && !downloadProgress ? (
                            <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-30">
                                <div className="size-16 rounded-full border-2 border-dashed border-muted-foreground/50 flex items-center justify-center">
                                    <LuBox className="size-6" />
                                </div>
                                <span className="text-xs text-muted-foreground">Awaiting Command</span>
                            </div>
                        ) : (
                            <div className="space-y-8 py-4">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className={isDownloading ? "text-primary animate-pulse" : "text-muted-foreground"}>Binary Acquisition</span>
                                        <span className="font-mono text-muted-foreground">{downloadProgress?.percentage.toFixed(1) || 0}%</span>
                                    </div>
                                    <Progress value={downloadProgress?.percentage || 0} className="h-1.5" />
                                    {downloadProgress && (
                                        <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                                            <span>{(downloadProgress.received / 1024 / 1024).toFixed(1)} MB</span>
                                            <span>/ {(downloadProgress.total / 1024 / 1024).toFixed(1)} MB</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className={isExtracting ? "text-secondary animate-pulse" : "text-muted-foreground"}>Data Expansion</span>
                                        <span className="font-mono text-muted-foreground">{isExtracting ? "Active" : isDownloading ? "Pending" : "Complete"}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                        {isExtracting && <div className="h-full bg-secondary animate-pulse w-full" />}
                                    </div>
                                    <div className="text-[10px] font-mono text-muted-foreground truncate italic">
                                        {extractionStatus || "Waiting for download to finalize..."}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>

                    <div className="p-6 rounded-lg bg-muted border flex items-start gap-4">
                        <div className="p-2 rounded bg-background border">
                            <LuBox className="size-4" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-semibold">Auto-Cleanup</h4>
                            <p className="text-xs text-muted-foreground">System will automatically purge temporary zip buffers after successful extraction.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
