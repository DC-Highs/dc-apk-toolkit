import { LuDownload } from "react-icons/lu"
import { save } from "@tauri-apps/plugin-dialog"
import { createPortal } from "react-dom"
import { toast } from "sonner"

import { apkService } from "../../../services/apk-service"
import { Button } from "../../../components/ui/button"

interface ImagePreviewProps {
    image: {
        displayPath: string
        originalPath: string
        name: string
    } | null
    onClose: () => void
}

export function ImagePreview({ image, onClose }: ImagePreviewProps) {
    if (!image) return null

    const handleExport = async (e: React.MouseEvent) => {
        e.stopPropagation()
        try {
            const filePath = await save({
                filters: [{
                    name: "Image",
                    extensions: [image.name.split(".").pop() || "png"]
                }],
                defaultPath: image.name
            })
            
            if (filePath) {
                await apkService.copyFile(image.originalPath, filePath)
                toast.success("Image exported successfully")
            }
        } catch (error) {
            toast.error("Failed to export image")
            console.error(error)
        }
    }

    return createPortal(
        <div className="fixed inset-0 z-100 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="flex justify-between w-full max-w-5xl mb-4 px-4 items-center">
                <span className="text-white font-mono text-sm truncate">{image.name}</span>
                <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={handleExport}>
                        <LuDownload className="size-4 mr-2" />
                        Export
                    </Button>
                    <Button size="sm" variant="outline" onClick={onClose}>Close</Button>
                </div>
            </div>
            <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center overflow-hidden" onClick={e => e.stopPropagation()}>
                <img 
                    src={image.displayPath} 
                    alt="Preview" 
                    className="max-h-full max-w-full object-contain shadow-2xl" 
                />
            </div>
        </div>,
        document.body
    )
}
