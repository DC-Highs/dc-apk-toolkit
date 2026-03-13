import { LuPlay, LuPause, LuVolume2, LuDownload, LuFileAudio } from "react-icons/lu"
import { save } from "@tauri-apps/plugin-dialog"
import { toast } from "sonner"

import { apkService, FileEntry } from "../../../services/apk-service"
import { Button } from "../../../components/ui/button"
import { Card } from "../../../components/ui/card"

interface AudioItemProps {
    audio: FileEntry
    isPlaying: boolean
    onTogglePlay: () => void
}

export function AudioItem({ audio, isPlaying, onTogglePlay }: AudioItemProps) {
    const handleExport = async (e: React.MouseEvent) => {
        e.stopPropagation()
        try {
            const filePath = await save({
                filters: [{
                    name: "Audio",
                    extensions: [audio.name.split(".").pop() || "mp3"]
                }],
                defaultPath: audio.name
            })
            if (filePath) {
                await apkService.copyFile(audio.path, filePath)
                toast.success("Audio exported successfully")
            }
        } catch (error) {
            toast.error("Failed to export audio")
        }
    }

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 B"
        const k = 1024
        const sizes = ["B", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    const extension = audio.name.split(".").pop()?.toUpperCase() || "AUD"

    return (
        <Card className={`group relative overflow-hidden transition-all duration-300 border-sidebar-border/50 hover:border-primary/40 hover:bg-muted/30 ${isPlaying ? 'bg-primary/5 border-primary/40 ring-1 ring-primary/20' : ''}`}>
            {/* Background animated bars when playing */}
            {isPlaying && (
                <div className="absolute inset-0 z-0 pointer-events-none opacity-5 overflow-hidden flex items-end justify-center gap-1 p-2">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div 
                            key={i} 
                            className="w-full bg-primary animate-pulse" 
                            style={{ 
                                height: `${Math.random() * 100}%`,
                                animationDelay: `${i * 0.1}s`,
                                animationDuration: `${0.5 + Math.random()}s`
                            }} 
                        />
                    ))}
                </div>
            )}

            <div className="relative z-10 p-4 flex items-center gap-5">
                <div className="relative shrink-0">
                    <Button 
                        size="icon" 
                        variant={isPlaying ? "default" : "secondary"}
                        onClick={onTogglePlay}
                        className={`rounded-xl size-12 shadow-sm transition-transform active:scale-95 ${isPlaying ? 'animate-pulse' : ''}`}
                    >
                        {isPlaying ? <LuPause className="size-5" /> : <LuPlay className="size-5" />}
                    </Button>
                    {isPlaying && (
                        <div className="absolute -top-1 -right-1 size-3 bg-primary rounded-full ring-2 ring-background animate-bounce " />
                    )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold truncate transition-colors ${isPlaying ? 'text-primary' : 'text-foreground'}`}>
                            {audio.name}
                        </span>
                        <span className="text-[8px] font-black bg-muted px-1.5 py-0.5 rounded text-muted-foreground tracking-tighter shrink-0 opacity-60">
                            {extension}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground/60 font-mono font-medium lowercase">
                        <div className="flex items-center gap-1">
                            <LuFileAudio className="size-3" />
                            {formatSize(audio.size)}
                        </div>
                        <span className="opacity-30">|</span>
                        <span className="truncate max-w-[200px] opacity-40 hover:opacity-100 transition-opacity whitespace-nowrap">
                            {audio.path.split('\\').pop()}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4 py-1">
                    {isPlaying && (
                        <div className="flex items-center gap-3 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                            <LuVolume2 className="size-4 text-primary" />
                            <div className="flex gap-0.5 items-end h-3 w-6">
                                <div className="w-1 bg-primary h-[40%] animate-[bounce_0.8s_ease-in-out_infinite]" />
                                <div className="w-1 bg-primary h-[90%] animate-[bounce_1s_ease-in-out_infinite]" />
                                <div className="w-1 bg-primary h-[60%] animate-[bounce_1.2s_ease-in-out_infinite]" />
                            </div>
                        </div>
                    )}
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/10 hover:text-primary rounded-lg size-9"
                        onClick={handleExport}
                    >
                        <LuDownload className="size-4" />
                    </Button>
                </div>
            </div>
        </Card>
    )
}
