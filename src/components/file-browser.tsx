import { LuFolder, LuFile, LuChevronLeft, LuImage } from "react-icons/lu"
import { useState, useEffect } from "react"
import { toast } from "sonner"

import { apkService, FileEntry } from "../services/apk-service"
import { Button } from "./ui/button"
import { Card } from "./ui/card"

export function FileBrowser() {
    const [currentPath, setCurrentPath] = useState(".")
    const [files, setFiles] = useState<FileEntry[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [history, setHistory] = useState<string[]>([])

    const loadFiles = async (path: string) => {
        setIsLoading(true)
        try {
            const result = await apkService.listFiles(path)
            setFiles(result)
            setCurrentPath(path)
        } catch (error) {
            console.error(error)
            toast.error("Failed to list files")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const init = async () => {
            try {
                const dir = await apkService.getAppDir()
                loadFiles(dir)
            } catch (error) {
                toast.error("Failed to initialize file browser")
            }
        }
        init()
    }, [])

    const handleFileClick = async (file: FileEntry) => {
        if (file.is_dir) {
            setHistory([...history, currentPath])
            loadFiles(file.path)
        } else {
            const ext = file.name.split(".").pop()?.toLowerCase()
            if (["png", "jpg", "jpeg", "webp"].includes(ext || "")) {
                try {
                    const base64 = await apkService.readFile(file.path)
                    setPreviewImage(`data:image/${ext};base64,${base64}`)
                } catch (error) {
                    toast.error("Failed to load image preview")
                }
            } else {
                toast.info("Preview not available for this file type")
            }
        }
    }

    const goBack = () => {
        if (history.length > 0) {
            const prevPath = history[history.length - 1]
            setHistory(history.slice(0, -1))
            loadFiles(prevPath)
        }
    }

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 B"
        const k = 1024
        const sizes = ["B", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    return (
        <Card className="flex flex-col h-[600px] overflow-hidden">
            <div className="p-4 border-b bg-muted/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        disabled={history.length === 0}
                        onClick={goBack}
                    >
                        <LuChevronLeft className="size-4" />
                    </Button>
                    <span className="text-sm font-mono truncate max-w-md">{currentPath}</span>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-2">
                {isLoading ? (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                        Scanning filesystem...
                    </div>
                ) : (
                    <div className="grid gap-1">
                        {files.map((file) => (
                            <div 
                                key={file.path}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-accent cursor-pointer group"
                                onClick={() => handleFileClick(file)}
                            >
                                <div className="flex items-center gap-3">
                                    {file.is_dir ? (
                                        <LuFolder className="size-4 text-primary" />
                                    ) : (
                                        <LuFile className="size-4 text-muted-foreground" />
                                    )}
                                    <span className="text-sm font-medium">{file.name}</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    {!file.is_dir && <span>{formatSize(file.size)}</span>}
                                    {!file.is_dir && file.name.match(/\.(png|jpg|jpeg|webp)$/i) && (
                                        <LuImage className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {previewImage && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-8 backdrop-blur" onClick={() => setPreviewImage(null)}>
                    <Card className="max-w-4xl max-h-full overflow-hidden flex flex-col" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        <div className="p-4 border-b flex items-center justify-between">
                            <span className="text-sm font-bold">Image Preview</span>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setPreviewImage(null)}>Close</Button>
                            </div>
                        </div>
                        <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-zinc-950">
                            <img src={previewImage} alt="Preview" className="max-w-full h-auto shadow-2xl" />
                        </div>
                    </Card>
                </div>
            )}
        </Card>
    )
}
