import { LuSearch, LuMusic } from "react-icons/lu"

import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Spinner } from "../../../components/ui/spinner"

interface AudioHeaderProps {
    search: string
    onSearchChange: (value: string) => void
    filteredCount: number
    isLoading: boolean
    onRefresh: () => void
}

export function AudioHeader({ search, onSearchChange, filteredCount, isLoading, onRefresh }: AudioHeaderProps) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
                <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input 
                    placeholder="Search sounds..." 
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
                    {isLoading ? <Spinner /> : <LuMusic className="mr-2 h-4 w-4" />}
                    Refresh Library
                </Button>
            </div>
        </div>
    )
}
