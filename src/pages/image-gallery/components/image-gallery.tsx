import { LuLoader } from "react-icons/lu"
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
} from "../../../components/ui/pagination"
import { configHelper } from "../../../helpers/config.heler"
import { apkService, FileEntry } from "../../../services/apk-service"
import { GalleryHeader } from "./gallery-header"
import { ImagePreview } from "./image-preview"
import { GalleryCard } from "./gallery-card"

const ITEMS_PER_PAGE = configHelper.galleryItemsPerPage

export function ImageGallery() {
    const [images, setImages] = useState<FileEntry[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [selectedImage, setSelectedImage] = useState<{ displayPath: string, originalPath: string, name: string } | null>(null)
    const [base64Cache, setBase64Cache] = useState<Record<string, string>>({})
    const [currentPage, setCurrentPage] = useState(1)
    const [loadingQueue] = useState(() => new Set<string>())

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSelectedImage(null)
        }
        window.addEventListener("keydown", handleEsc)
        return () => window.removeEventListener("keydown", handleEsc)
    }, [])

    const scanImages = async () => {
        setIsLoading(true)
        try {
            const appDir = await apkService.getAppDir()
            const result = await apkService.searchFiles(appDir, ["png", "jpg", "jpeg", "webp", "bmp", "gif", "svg"])
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

    const loadThumbnails = async (entries: FileEntry[]) => {
        for (const img of entries) {
            if (base64Cache[img.path] || loadingQueue.has(img.path)) continue
            
            loadingQueue.add(img.path)
            try {
                const b64 = await apkService.readFile(img.path)
                const ext = img.name.split(".").pop()?.toLowerCase() || "png"
                const dataUrl = `data:image/${ext};base64,${b64}`
                setBase64Cache(prev => ({ ...prev, [img.path]: dataUrl }))
            } catch (error) {
                console.error(`Failed to load thumbnail: ${img.path}`)
            } finally {
                loadingQueue.delete(img.path)
            }
        }
    }

    useEffect(() => {
        if (pagedImages.length > 0) {
            loadThumbnails(pagedImages)
        }
    }, [pagedImages])

    const openPreview = async (img: FileEntry) => {
        if (base64Cache[img.path]) {
            setSelectedImage({ displayPath: base64Cache[img.path], originalPath: img.path, name: img.name })
            return
        }

        try {
            const ext = img.name.split(".").pop()?.toLowerCase()
            const b64 = await apkService.readFile(img.path)
            const dataUrl = `data:image/${ext};base64,${b64}`
            setBase64Cache(prev => ({ ...prev, [img.path]: dataUrl }))
            setSelectedImage({ displayPath: dataUrl, originalPath: img.path, name: img.name })
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
            <GalleryHeader 
                search={search}
                onSearchChange={(val) => {
                    setSearch(val)
                    setCurrentPage(1)
                }}
                filteredCount={filteredImages.length}
                isLoading={isLoading}
                onRefresh={scanImages}
            />

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
                            <GalleryCard 
                                key={img.path}
                                img={img}
                                displayPath={base64Cache[img.path]}
                                onClick={() => openPreview(img)}
                            />
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

            <ImagePreview 
                image={selectedImage}
                onClose={() => setSelectedImage(null)}
            />
        </div>
    )
}
