import { LuPlay, LuPause, LuVolume2, LuDownload } from "react-icons/lu"
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

    return (
        <Card className={`p-4 hover:bg-accent transition-colors flex items-center justify-between group ${isPlaying ? 'border-primary ring-1 ring-primary' : ''}`}>
            <div className="flex items-center gap-4">
                <Button 
                    size="icon" 
                    variant={isPlaying ? "default" : "secondary"}
                    onClick={onTogglePlay}
                    className="rounded-full"
                >
                    {isPlaying ? <LuPause className="size-4" /> : <LuPlay className="size-4" />}
                </Button>
                <div className="flex flex-col">
                    <span className="text-sm font-bold truncate max-w-xs">{audio.name}</span>
                    <span className="text-[10px] text-muted-foreground truncate opacity-60">{audio.path.split('\\').pop()}</span>
                </div>
            </div>
            <div className="flex items-center gap-6">
                {isPlaying && (
                    <div className="flex items-center gap-2 animate-pulse text-primary">
                        <LuVolume2 className="size-4" />
                        <div className="flex gap-0.5 items-end h-3">
                            <div className="w-1 bg-primary h-2"></div>
                            <div className="w-1 bg-primary h-3"></div>
                            <div className="w-1 bg-primary h-1"></div>
                        </div>
                    </div>
                )}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={handleExport}
                >
                    <LuDownload className="size-4" />
                </Button>
            </div>
        </Card>
    )
}
