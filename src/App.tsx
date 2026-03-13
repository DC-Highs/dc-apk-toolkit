import { Routes, Route } from "react-router-dom"

import { AudioLibraryPage } from "./pages/audio-library/audio-library.page"
import { ImageGalleryPage } from "./pages/image-gallery/image-gallery.page"
import { Downloader } from "./pages/downloader/downloader.page"
import { Dashboard } from "./pages/dashboard/dashboard.page"
import { ReleasesPage } from "@/pages/releases/releases.page"
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
                        path="/images"
                        element={<ImageGalleryPage />}
                    />
                    <Route
                        path="/audio"
                        element={<AudioLibraryPage />}
                    />
                    <Route
                        path="/releases"
                        element={<ReleasesPage />}
                    />
                </Routes>
            </AppLayout>
        </Providers>
    )
}

export default App
