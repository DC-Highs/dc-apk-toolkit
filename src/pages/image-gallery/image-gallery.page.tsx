import { ImageGallery } from "./components/image-gallery"

export function ImageGalleryPage() {
    return (
        <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto pb-32">
            <header className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-secondary" />
                    <span className="text-xs text-muted-foreground font-medium">
                        Visual Assets
                    </span>
                </div>
                <h1 className="text-5xl font-bold tracking-tight">
                    Texture Repository
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                    Recursive indexing of all sprites, textures and atlas discovered in the extracted packages.
                </p>
            </header>
            <ImageGallery />
        </div>
    )
}
