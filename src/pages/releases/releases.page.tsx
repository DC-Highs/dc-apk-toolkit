import { LuGift, LuDownload, LuExternalLink, LuZap, LuClock, LuTag } from "react-icons/lu"
import { openUrl } from "@tauri-apps/plugin-opener"
import { useState, useEffect } from "react"
import { toast } from "sonner"

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Skeleton } from "../../components/ui/skeleton"

interface GitHubRelease {
    id: number
    name: string
    tag_name: string
    published_at: string
    body: string
    html_url: string
    assets: Array<{
        id: number
        name: string
        browser_download_url: string
        size: number
    }>
}

const REPO_OWNER = "DC-Highs"
const REPO_NAME = "dc-apk-toolkit"

export function ReleasesPage() {
    const [releases, setReleases] = useState<GitHubRelease[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchReleases = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases`)
            if (!response.ok) throw new Error("Failed to fetch releases")
            const data = await response.json()
            setReleases(data)
        } catch (error) {
            console.error(error)
            toast.error("Cloud Node unreachable: GitHub API denied access")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchReleases()
    }, [])

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const formatSize = (bytes: number) => {
        const k = 1024
        const sizes = ["B", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    return (
        <div className="flex flex-col gap-8 p-8 max-w-6xl mx-auto pb-32">
            <header className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-primary">
                    <LuGift className="size-4" />
                    <span className="text-xs font-bold tracking-widest uppercase opacity-70">
                        Version History
                    </span>
                </div>
                <h1 className="text-5xl font-black tracking-tighter">
                    System Releases
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                    Access secondary binary nodes and stable release branches directly from the GitHub mainframe.
                </p>
            </header>

            <div className="grid gap-6">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="border-sidebar-border/50">
                            <CardHeader>
                                <Skeleton className="h-8 w-1/3 mb-2" />
                                <Skeleton className="h-4 w-1/4" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-20 w-full" />
                            </CardContent>
                        </Card>
                    ))
                ) : releases.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed rounded-3xl bg-muted/5 gap-4">
                        <div className="size-16 rounded-full bg-muted flex items-center justify-center">
                            <LuZap className="size-8 text-muted-foreground opacity-20" />
                        </div>
                        <p className="text-muted-foreground font-medium">No external releases found in this repository node.</p>
                        <Button variant="outline" size="sm" onClick={fetchReleases}>Retry Synchronization</Button>
                    </div>
                ) : (
                    releases.map((release) => (
                        <Card key={release.id} className="group overflow-hidden border-sidebar-border/40 hover:border-primary/50 transition-all duration-300">
                            <CardHeader className="flex flex-row items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <CardTitle className="text-2xl font-bold tracking-tight">{release.name || release.tag_name}</CardTitle>
                                        <Badge variant="secondary" className="font-mono text-[10px]">{release.tag_name}</Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                                        <div className="flex items-center gap-1">
                                            <LuClock className="size-3" />
                                            {formatDate(release.published_at)}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <LuTag className="size-3" />
                                            Stable Branch
                                        </div>
                                    </div>
                                </div>
                                <Button size="sm" variant="ghost" className="opacity-40 group-hover:opacity-100 transition-opacity" onClick={() => openUrl(release.html_url)}>
                                    <LuExternalLink className="size-4" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-invert prose-sm max-w-none text-muted-foreground line-clamp-3">
                                    {release.body || "No release notes provided."}
                                </div>
                            </CardContent>
                            <CardFooter className="bg-muted/30 border-t border-sidebar-border/20 py-4 flex flex-col gap-3">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Distribution Assets</span>
                                <div className="grid gap-2 w-full">
                                    {release.assets.map(asset => (
                                        <div key={asset.id} className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-sidebar-border/30 hover:bg-accent transition-colors group/asset">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium truncate max-w-md">{asset.name}</span>
                                                <span className="text-[10px] text-muted-foreground font-mono">{formatSize(asset.size)}</span>
                                            </div>
                                            <Button size="sm" variant="secondary" className="h-8 gap-2" onClick={() => openUrl(asset.browser_download_url)}>
                                                <LuDownload className="size-3" />
                                                Fetch
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
