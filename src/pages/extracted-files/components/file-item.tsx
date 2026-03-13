import { LuFolder, LuFile, LuImage } from "react-icons/lu"

import { FileEntry } from "../../../services/apk-service"

interface FileItemProps {
    file: FileEntry
    onClick: () => void
}

export function FileItem({ file, onClick }: FileItemProps) {
    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 B"
        const k = 1024
        const sizes = ["B", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    return (
        <div 
            className="flex items-center justify-between p-2 rounded-lg hover:bg-accent cursor-pointer group"
            onClick={onClick}
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
    )
}
