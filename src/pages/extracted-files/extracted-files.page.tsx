import { LuFileArchive, LuHardDrive, LuArrowUpRight } from "react-icons/lu"
import { toast } from "sonner"

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "../../components/ui/card"
import { Button } from "../../components/ui/button"

import { apkService } from "../../services/apk-service"
import { FileBrowser } from "../../components/file-browser"

export function ExtractedFiles() {
    const openInExplorer = async () => {
        try {
            const dir = await apkService.getAppDir()
            await apkService.openFolder(dir)
        } catch (error) {
            console.error(error)
            toast.error("Failed to open system explorer")
        }
    }

    return (
        <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto pb-32">
            <header className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-secondary" />
                    <span className="text-xs text-muted-foreground font-medium">
                        Asset Repository
                    </span>
                </div>
                <h1 className="text-5xl font-bold tracking-tight">
                    Neural Asset Library
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                    Browse and inspect your localized Dragon City ecosystem. All extracted binaries, JSON definitions, and high-fidelity textures.
                </p>
            </header>

            <div className="flex flex-col gap-8">
                <div className="grid gap-8 md:grid-cols-2">
                    <Card className="flex flex-col justify-between group h-full">
                        <CardHeader>
                            <div className="flex items-center gap-4 mb-2">
                                <div className="size-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                                    <LuHardDrive className="size-5" />
                                </div>
                                <div className="flex flex-col">
                                    <CardTitle className="text-lg">Storage Node</CardTitle>
                                    <CardDescription className="text-xs">Physical directory link</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant="outline"
                                className="w-full justify-between"
                                onClick={openInExplorer}
                            >
                                Open in Explorer
                                <LuArrowUpRight className="size-4 opacity-50" />
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col justify-between group h-full">
                        <CardHeader>
                            <div className="flex items-center gap-4 mb-2">
                                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                    <LuFileArchive className="size-5" />
                                </div>
                                <div className="flex flex-col">
                                    <CardTitle className="text-lg">Verification</CardTitle>
                                    <CardDescription className="text-xs">Integrity status</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between text-xs font-mono text-primary bg-primary/5 p-3 rounded-lg border border-primary/10">
                                <span>Binary Integrity Confirmed</span>
                                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-[10px] font-bold">Active</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight">Internal Browser</h2>
                        <span className="text-xs text-muted-foreground">Preview images and navigate directories</span>
                    </div>
                    <FileBrowser />
                </div>
            </div>
        </div>
    )
}
