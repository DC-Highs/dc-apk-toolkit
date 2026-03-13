import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "../../../components/ui/pagination"
import { configHelper } from "../../../helpers/config.heler"
import { apkService, FileEntry } from "../../../services/apk-service"
import { AudioHeader } from "./audio-header"
import { AudioItem } from "./audio-item"

const ITEMS_PER_PAGE = configHelper.audioItemsPerPage

export function AudioList() {
    const [audioFiles, setAudioFiles] = useState<FileEntry[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [playingPath, setPlayingPath] = useState<string | null>(null)
    const [audioData, setAudioData] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const scanAudio = async () => {
        setIsLoading(true)
        try {
            const appDir = await apkService.getAppDir()
            const result = await apkService.searchFiles(appDir, ["mp3", "ogg", "wav", "m4a"])
            setAudioFiles(result)
            setCurrentPage(1)
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

    const totalPages = Math.ceil(filteredAudio.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const pagedAudio = filteredAudio.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    const renderPaginationItems = () => {
        const items = []
        const maxVisible = 5
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
        let end = Math.min(totalPages, start + maxVisible - 1)

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1)
        }

        if (start > 1) {
            items.push(
                <PaginationItem key="1">
                    <PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
                </PaginationItem>
            )
            if (start > 2) items.push(<PaginationEllipsis key="start-ell" />)
        }

        for (let i = start; i <= end; i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink 
                        isActive={currentPage === i}
                        onClick={() => setCurrentPage(i)}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            )
        }

        if (end < totalPages) {
            if (end < totalPages - 1) items.push(<PaginationEllipsis key="end-ell" />)
            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink onClick={() => setCurrentPage(totalPages)}>{totalPages}</PaginationLink>
                </PaginationItem>
            )
        }

        return items
    }

    return (
        <div className="space-y-6">
            <AudioHeader 
                search={search}
                onSearchChange={(val) => {
                    setSearch(val)
                    setCurrentPage(1)
                }}
                filteredCount={filteredAudio.length}
                isLoading={isLoading}
                onRefresh={scanAudio}
            />

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
                    <>
                        {pagedAudio.map((audio) => (
                            <AudioItem 
                                key={audio.path}
                                audio={audio}
                                isPlaying={playingPath === audio.path}
                                onTogglePlay={() => togglePlay(audio)}
                            />
                        ))}

                        {totalPages > 1 && (
                            <div className="flex justify-center py-8">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious 
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>
                                        
                                        {renderPaginationItems()}

                                        <PaginationItem>
                                            <PaginationNext 
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
