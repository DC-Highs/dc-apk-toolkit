import { Routes, Route } from "react-router-dom"

import { AudioLibraryPage } from "./pages/audio-library/audio-library.page"
import { ImageGalleryPage } from "./pages/image-gallery/image-gallery.page"
import { ExtractedFiles } from "./pages/extracted-files/extracted-files.page"
import { Downloader } from "./pages/downloader/downloader.page"
import { Dashboard } from "./pages/dashboard/dashboard.page"
import { AppLayout } from "./components/layout/app-layout"
import { Providers } from "./components/providers"
import "./App.css"

function App() {
    return (
        <Providers>
            <AppLayout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route
                        path="/downloader"
                        element={<Downloader />}
                    />
                    <Route
                        path="/files"
                        element={<ExtractedFiles />}
                    />
                    <Route
                        path="/images"
                        element={<ImageGalleryPage />}
                    />
                    <Route
                        path="/audio"
                        element={<AudioLibraryPage />}
                    />
                    <Route
                        path="/settings"
                        element={
                            <div className="flex flex-col gap-6 p-8 max-w-5xl mx-auto">
                                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                                <div className="rounded-lg border border-dashed p-20 flex flex-col items-center justify-center text-center gap-4">
                                    <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                                        <div className="size-2 rounded-full bg-primary animate-pulse" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Settings Module Unavailable</p>
                                        <p className="text-xs text-muted-foreground">Configuration hooks are currently being integrated.</p>
                                    </div>
                                </div>
                            </div>
                        }
                    />
                </Routes>
            </AppLayout>
        </Providers>
    )
}

export default App
