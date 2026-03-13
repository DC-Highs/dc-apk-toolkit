import { LuImage, LuSearch, LuMaximize2, LuDownload, LuLoader } from "react-icons/lu"
import { convertFileSrc } from "@tauri-apps/api/core"
import { useState, useEffect } from "react"
import { toast } from "sonner"

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "./ui/pagination"
import { apkService, FileEntry } from "../services/apk-service"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Input } from "./ui/input"

const ITEMS_PER_PAGE = 24

export function ImageGallery() {
    const [images, setImages] = useState<FileEntry[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [selectedImage, setSelectedImage] = useState<{ path: string, name: string } | null>(null)
    const [base64Cache, setBase64Cache] = useState<Record<string, string>>({})
    const [currentPage, setCurrentPage] = useState(1)

    const scanImages = async () => {
        setIsLoading(true)
        try {
            const appDir = await apkService.getAppDir()
            const result = await apkService.searchFiles(appDir, ["png", "jpg", "jpeg", "webp"])
            setImages(result)
            setCurrentPage(1)
        } catch (error) {
            toast.error("Failed to scan for images")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        scanImages()
    }, [])

    const filteredImages = images.filter(img => 
        img.name.toLowerCase().includes(search.toLowerCase())
    )

    const totalPages = Math.ceil(filteredImages.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const pagedImages = filteredImages.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    const openPreview = async (img: FileEntry) => {
        if (base64Cache[img.path]) {
            setSelectedImage({ path: base64Cache[img.path], name: img.name })
            return
        }

        try {
            const ext = img.name.split(".").pop()?.toLowerCase()
            const b64 = await apkService.readFile(img.path)
            const dataUrl = `data:image/${ext};base64,${b64}`
            setBase64Cache(prev => ({ ...prev, [img.path]: dataUrl }))
            setSelectedImage({ path: dataUrl, name: img.name })
        } catch (error) {
            toast.error("Failed to load image")
        }
    }

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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search assets..." 
                        className="pl-9"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setCurrentPage(1)
                        }}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground font-medium">
                        {filteredImages.length} elements discovered
                    </span>
                    <Button variant="outline" size="sm" onClick={scanImages} disabled={isLoading}>
                        {isLoading ? <LuLoader className="mr-2 h-4 w-4 animate-spin" /> : <LuImage className="mr-2 h-4 w-4" />}
                        Refresh Gallery
                    </Button>
                </div>
            </div>

            {isLoading && images.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-4">
                    <LuLoader className="size-8 animate-spin" />
                    <p>Indexing recursive textures...</p>
                </div>
            ) : filteredImages.length === 0 ? (
                <div className="text-center py-24 border-2 border-dashed rounded-xl text-muted-foreground">
                    No images found or matched your search.
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {pagedImages.map((img) => (
                            <Card 
                                key={img.path} 
                                className="group relative aspect-square overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all bg-muted/20 border-0 shadow-sm"
                                onClick={() => openPreview(img)}
                            >
                                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 group-hover:scale-105 transition-transform duration-500">
                                    <img 
                                        src={convertFileSrc(img.path)} 
                                        alt={img.name}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
                                </div>
                                
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <LuMaximize2 className="size-8 text-white drop-shadow-lg" />
                                </div>

                                <div className="absolute bottom-0 inset-x-0 p-2 bg-black/40 backdrop-blur-sm border-t border-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <p className="text-[10px] text-zinc-100 truncate font-mono text-center">{img.name}</p>
                                </div>
                            </Card>
                        ))}
                    </div>

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

            {selectedImage && (
                <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
                    <div className="flex justify-between w-full max-w-5xl mb-4 px-4 items-center">
                        <span className="text-white font-mono text-sm truncate">{selectedImage.name}</span>
                        <div className="flex gap-2">
                            <Button size="sm" variant="secondary" onClick={(e) => {
                                e.stopPropagation()
                                // download logic could go here
                            }}>
                                <LuDownload className="size-4 mr-2" />
                                Export
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setSelectedImage(null)}>Close</Button>
                        </div>
                    </div>
                    <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center overflow-hidden" onClick={e => e.stopPropagation()}>
                        <img 
                            src={selectedImage.path} 
                            alt="Preview" 
                            className="max-h-full max-w-full object-contain shadow-2xl" 
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
