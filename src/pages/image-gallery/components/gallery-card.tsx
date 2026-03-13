import { LuLoader, LuMaximize2 } from "react-icons/lu"

import { FileEntry } from "../../../services/apk-service"
import { Card } from "../../../components/ui/card"

interface GalleryCardProps {
    img: FileEntry
    displayPath?: string
    onClick: () => void
}

export function GalleryCard({ img, displayPath, onClick }: GalleryCardProps) {
    return (
        <Card 
            className="group relative aspect-square overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all bg-muted/20 border-0 shadow-sm"
            onClick={onClick}
        >
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 group-hover:scale-105 transition-transform duration-500">
                {displayPath ? (
                    <img 
                        src={displayPath} 
                        alt={img.name}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <LuLoader className="size-4 animate-spin text-muted-foreground" />
                        <span className="text-[8px] text-muted-foreground uppercase">Processing</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <LuMaximize2 className="size-8 text-white drop-shadow-lg" />
            </div>

            <div className="absolute bottom-0 inset-x-0 p-2 bg-black/40 backdrop-blur-sm border-t border-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-[10px] text-zinc-100 truncate font-mono text-center">{img.name}</p>
            </div>
        </Card>
    )
}
