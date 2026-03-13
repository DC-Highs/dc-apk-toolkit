import { LuSearch, LuImage, LuLoader } from "react-icons/lu"

import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"

interface GalleryHeaderProps {
    search: string
    onSearchChange: (value: string) => void
    filteredCount: number
    isLoading: boolean
    onRefresh: () => void
}

export function GalleryHeader({ search, onSearchChange, filteredCount, isLoading, onRefresh }: GalleryHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
                <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input 
                    placeholder="Search assets..." 
                    className="pl-9"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground font-medium">
                    {filteredCount} elements discovered
                </span>
                <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
                    {isLoading ? <LuLoader className="mr-2 h-4 w-4 animate-spin" /> : <LuImage className="mr-2 h-4 w-4" />}
                    Refresh Gallery
                </Button>
            </div>
        </div>
    )
}
