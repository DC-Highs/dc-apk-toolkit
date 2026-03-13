import { AudioList } from "./components/audio-list"

export function AudioLibraryPage() {
    return (
        <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto pb-32">
            <header className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-primary" />
                    <span className="text-xs text-muted-foreground font-medium">
                        Aural Assets
                    </span>
                </div>
                <h1 className="text-5xl font-bold tracking-tight">
                    Sonic Database
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                    A comprehensive library of all sound effects, music tracks, and voice snippets found within the game files.
                </p>
            </header>
            <AudioList />
        </div>
    )
}
