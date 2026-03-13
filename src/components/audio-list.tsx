import { LuMusic, LuPlay, LuPause, LuSearch, LuVolume2, LuDownload } from "react-icons/lu"
import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"

import { apkService, FileEntry } from "../services/apk-service"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Input } from "./ui/input"
import { Spinner } from "./ui/spinner"

export function AudioList() {
    const [audioFiles, setAudioFiles] = useState<FileEntry[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [playingPath, setPlayingPath] = useState<string | null>(null)
    const [audioData, setAudioData] = useState<string | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const scanAudio = async () => {
        setIsLoading(true)
        try {
            const appDir = await apkService.getAppDir()
            const result = await apkService.searchFiles(appDir, ["mp3", "ogg", "wav", "m4a"])
            setAudioFiles(result)
        } catch (error) {
            toast.error("Failed to scan for audio")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        scanAudio()
    }, [])

    const togglePlay = async (file: FileEntry) => {
        if (playingPath === file.path) {
            if (audioRef.current?.paused) audioRef.current.play()
            else audioRef.current?.pause()
            return
        }

        try {
            setPlayingPath(file.path)
            const ext = file.name.split(".").pop()?.toLowerCase()
            const b64 = await apkService.readFile(file.path)
            const dataUrl = `data:audio/${ext};base64,${b64}`
            setAudioData(dataUrl)
        } catch (error) {
            toast.error("Failed to load audio")
        }
    }

    const filteredAudio = audioFiles.filter(a => 
        a.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search sounds..." 
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant="outline" size="sm" onClick={scanAudio} disabled={isLoading}>
                    {isLoading ? <Spinner /> : <LuMusic className="mr-2 h-4 w-4" />}
                    Refresh Library
                </Button>
            </div>

            <audio 
                ref={audioRef} 
                src={audioData || undefined} 
                className="hidden" 
                autoPlay 
                onEnded={() => setPlayingPath(null)}
            />

            <div className="grid gap-2">
                {isLoading && audioFiles.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">Indexing sound bites...</div>
                ) : filteredAudio.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-xl text-muted-foreground">No audio found.</div>
                ) : (
                    filteredAudio.map((audio) => (
                        <Card key={audio.path} className={`p-4 hover:bg-accent transition-colors flex items-center justify-between group ${playingPath === audio.path ? 'border-primary ring-1 ring-primary' : ''}`}>
                            <div className="flex items-center gap-4">
                                <Button 
                                    size="icon" 
                                    variant={playingPath === audio.path ? "default" : "secondary"}
                                    onClick={() => togglePlay(audio)}
                                    className="rounded-full"
                                >
                                    {playingPath === audio.path ? <LuPause className="size-4" /> : <LuPlay className="size-4" />}
                                </Button>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold truncate max-w-xs">{audio.name}</span>
                                    <span className="text-[10px] text-muted-foreground truncate opacity-60">{audio.path.split('\\').pop()}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                {playingPath === audio.path && (
                                    <div className="flex items-center gap-2 animate-pulse text-primary">
                                        <LuVolume2 className="size-4" />
                                        <div className="flex gap-0.5 items-end h-3">
                                            <div className="w-1 bg-primary h-2"></div>
                                            <div className="w-1 bg-primary h-3"></div>
                                            <div className="w-1 bg-primary h-1"></div>
                                        </div>
                                    </div>
                                )}
                                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <LuDownload className="size-4" />
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
