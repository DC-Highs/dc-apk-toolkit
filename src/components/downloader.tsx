import {
    LuDownload,
    LuBox,
    LuFolderOpen,
    LuFileBox,
    LuCircleCheck,
    LuTriangleAlert,
} from "react-icons/lu"
import { useState } from "react"
import { toast } from "sonner"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card"
import { apkService, ProgressPayload } from "../services/apk-service"
import { Progress } from "./ui/progress"
import { Button } from "./ui/button"

export function Downloader() {
    const [status, setStatus] = useState<
        "idle" | "checking" | "downloading" | "extracting" | "success" | "error"
    >("idle")
    const [progress, setProgress] = useState<ProgressPayload | null>(null)
    const [extractStatus, setExtractStatus] = useState<string>("")
    const [downloadedFilePath, setDownloadedFilePath] = useState<string>("")
    const [extractedPath, setExtractedPath] = useState<string>("")
    const [version, setVersion] = useState<string>("")

    const startProcess = async () => {
        setStatus("checking")
        setProgress(null)
        try {
            const info = await apkService.getLatestVersion()
            setVersion(info.version)

            setStatus("downloading")
            const filePath = await apkService.downloadApk(
                info.downloadUrl,
                info.version,
                (p) => {
                    setProgress(p)
                },
            )
            setDownloadedFilePath(filePath)
            toast.success("Download complete!")

            setStatus("extracting")
            const path = await apkService.extractPackage(
                filePath,
                info.version,
                (s) => {
                    setExtractStatus(s)
                },
            )
            setExtractedPath(path)
            setStatus("success")
            toast.success("Extraction complete!")
        } catch (error: any) {
            console.error(error)
            setStatus("error")
            toast.error(
                error.toString() || "An error occurred during the process",
            )
        }
    }

    return (
        <div className="flex flex-col gap-6 p-8">
            <header className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight">
                    Downloader
                </h1>
                <p className="text-muted-foreground">
                    Download and extract the latest Dragon City assets.
                </p>
            </header>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-lg shadow-primary/5 ring-1 ring-border">
                        <CardHeader>
                            <CardTitle>
                                Automatic Download & Extraction
                            </CardTitle>
                            <CardDescription>
                                This will fetch the latest version, download the
                                XAPK/APK, and extract all assets to your home
                                folder.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {status === "idle" && (
                                <div className="bg-muted/50 flex flex-col items-center justify-center rounded-xl py-16 text-center text-muted-foreground border-2 border-dashed border-border">
                                    <div
                                        className="bg-background mb-4 flex size-16 items-center justify-center rounded-2xl shadow-sm ring-1 ring-border transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                                        onClick={startProcess}
                                    >
                                        <LuDownload className="size-8 text-primary" />
                                    </div>
                                    <p className="max-w-xs px-4 text-sm font-medium">
                                        Click the button below to start the
                                        automatic download and extraction
                                        process.
                                    </p>
                                </div>
                            )}

                            {status === "downloading" && progress && (
                                <div className="space-y-5 p-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-sm font-bold tracking-tight text-foreground">
                                                {progress.status}
                                            </span>
                                            <span className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-black">
                                                Version {version}
                                            </span>
                                        </div>
                                        <div className="bg-primary/10 text-primary rounded-lg px-2 py-1 text-sm font-black ring-1 ring-primary/20">
                                            {Math.round(progress.progress)}%
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Progress
                                            value={progress.progress}
                                            className="h-2"
                                        />
                                        <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                                            <span>
                                                {(
                                                    progress.downloaded /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)}{" "}
                                                MB
                                            </span>
                                            <span className="opacity-40">
                                                /
                                            </span>
                                            <span>
                                                {(
                                                    progress.total /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)}{" "}
                                                MB
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {status === "extracting" && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl ring-1 ring-primary/10">
                                        <div className="border-primary size-6 animate-spin rounded-full border-[3px] border-t-transparent" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold tracking-tight">
                                                {extractStatus}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                                                Unpacking assets...
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-slate-950/90 flex flex-col gap-2 rounded-xl p-6 text-[11px] font-mono shadow-inner border border-white/5">
                                        <div className="flex gap-2">
                                            <span className="text-primary font-bold">
                                                SOURCE:
                                            </span>
                                            <span className="text-white/60 truncate">
                                                {downloadedFilePath}
                                            </span>
                                        </div>
                                        <div className="h-px bg-white/5 my-1" />
                                        <div className="flex gap-2 items-center">
                                            <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-green-500">
                                                INIT:
                                            </span>
                                            <span className="text-white/40 italic">
                                                Creating target directories...
                                                DONE
                                            </span>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <span className="size-1.5 rounded-full bg-green-500" />
                                            <span className="text-green-500">
                                                STAGE 1:
                                            </span>
                                            <span className="text-white/40 italic">
                                                Unpacking base archives... DONE
                                            </span>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <div className="size-1.5 rounded-full bg-yellow-500 animate-bounce" />
                                            <span className="text-yellow-500">
                                                STAGE 2:
                                            </span>
                                            <span className="text-white/80 font-bold uppercase tracking-widest">
                                                {extractStatus}
                                            </span>
                                        </div>
                                        <div className="mt-2 text-white/20 text-[9px] uppercase tracking-tighter">
                                            Do not close the application during
                                            this process
                                        </div>
                                    </div>
                                </div>
                            )}

                            {status === "success" && (
                                <div className="bg-linear-to-br from-green-500/5 to-transparent flex flex-col items-center justify-center gap-6 rounded-2xl border border-green-500/20 p-10 text-center shadow-lg shadow-green-500/5">
                                    <div className="bg-green-500/10 flex size-20 items-center justify-center rounded-3xl ring-1 ring-green-500/30">
                                        <LuCircleCheck className="size-10 text-green-500 animate-in zoom-in duration-500" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black tracking-tight text-green-700 dark:text-green-400">
                                            Toolkit Ready!
                                        </h3>
                                        <p className="text-sm text-green-600/60 dark:text-green-400/60 font-medium lowercase">
                                            Successfully extracted version{" "}
                                            {version}
                                        </p>
                                    </div>
                                    <Card className="w-full border-green-500/10 bg-green-500/5 backdrop-blur-sm">
                                        <CardContent className="p-4 flex flex-col gap-2 text-left">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-green-500/60">
                                                Target Path
                                            </span>
                                            <code className="text-[11px] font-mono break-all text-green-800/80 dark:text-green-200/80 bg-green-500/10 p-2 rounded-lg">
                                                {extractedPath}
                                            </code>
                                        </CardContent>
                                    </Card>
                                    <Button
                                        className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 dark:text-white px-8 font-bold uppercase tracking-widest text-xs"
                                        onClick={() =>
                                            window.open(extractedPath)
                                        }
                                    >
                                        <LuFolderOpen className="mr-2 size-4" />
                                        Open in Explorer
                                    </Button>
                                </div>
                            )}

                            {(status === "idle" || status === "error") && (
                                <Button
                                    className="w-full h-12 text-sm font-black uppercase tracking-[0.2em]"
                                    size="lg"
                                    onClick={startProcess}
                                >
                                    {status === "error"
                                        ? "Retry Operation"
                                        : "Initiate Download"}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-none bg-linear-to-b from-primary/5 to-transparent shadow-md ring-1 ring-border overflow-hidden">
                        <div className="h-1 bg-primary/20" />
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-[0.25em] opacity-50">
                                Technical Specs
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-5 pt-4">
                            <div className="flex gap-4">
                                <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-primary/20">
                                    <LuFileBox className="text-primary size-5" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-black uppercase tracking-widest text-foreground">
                                        Package Support
                                    </span>
                                    <p className="text-muted-foreground text-[11px] leading-relaxed italic opacity-80">
                                        Full support for APK and XAPK bundles.
                                        Automatic base APK identification and
                                        asset decompression.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-secondary/10 flex size-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-secondary/20">
                                    <LuBox className="text-secondary size-5" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-black uppercase tracking-widest text-foreground">
                                        Storage Matrix
                                    </span>
                                    <p className="text-muted-foreground text-[11px] leading-relaxed italic opacity-80">
                                        Files are persisted in your{" "}
                                        <code>HOME</code> directory under a
                                        isolated container for security and
                                        speed.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-orange-500/5 flex flex-col gap-2 rounded-2xl p-5 ring-1 ring-orange-500/20 border border-orange-500/10">
                                <div className="flex items-center gap-2">
                                    <LuTriangleAlert className="text-orange-500 size-4" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">
                                        Critical Note
                                    </span>
                                </div>
                                <p className="text-orange-600/80 dark:text-orange-400/70 text-[11px] font-medium leading-relaxed">
                                    High-intensity operations detected.
                                    Extraction uses 100% of a single IO thread.
                                    Ensure enough disk space is available
                                    (~1.5GB).
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
