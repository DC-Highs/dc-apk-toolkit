import { listen } from "@tauri-apps/api/event"
import { invoke } from "@tauri-apps/api/core"

export interface ApkInfo {
    version: string
    downloadUrl: string
}

export interface ProgressPayload {
    progress: number
    total: number
    downloaded: number
    status: string
}

export class ApkService {
    async getLatestVersion(): Promise<ApkInfo> {
        return await invoke<ApkInfo>("get_latest_version")
    }

    async downloadApk(
        url: string,
        version: string,
        onProgress: (p: ProgressPayload) => void,
    ): Promise<string> {
        const unlisten = await listen<ProgressPayload>(
            "download-progress",
            (event) => {
                onProgress(event.payload)
            },
        )

        try {
            return await invoke<string>("download_apk", { url, version })
        } finally {
            unlisten()
        }
    }

    async extractPackage(
        filePath: string,
        version: string,
        onProgress: (status: string) => void,
    ): Promise<string> {
        const unlisten = await listen<string>("extract-progress", (event) => {
            onProgress(event.payload)
        })

        try {
            return await invoke<string>("extract_package", {
                filePath,
                version,
            })
        } finally {
            unlisten()
        }
    }
}

export const apkService = new ApkService()
