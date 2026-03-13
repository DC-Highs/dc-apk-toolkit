import { invoke } from "@tauri-apps/api/core"
import { ApkVersion } from "../types/apk"

export interface FileEntry {
    name: string
    is_dir: boolean
    size: number
    path: string
}

export const apkService = {
    async getLatestVersion(): Promise<ApkVersion> {
        return await invoke<ApkVersion>("get_latest_version")
    },

    async getAppDir(): Promise<string> {
        return await invoke<string>("get_app_dir")
    },

    async downloadApk(url: string, path: string): Promise<void> {
        await invoke("download_apk", { url, path })
    },

    async extractPackage(path: string, outDir: string): Promise<void> {
        await invoke("extract_package", { path, outDir })
    },

    async openFolder(path: string): Promise<void> {
        await invoke("open_folder", { path })
    },

    async listFiles(path: string): Promise<FileEntry[]> {
        return await invoke<FileEntry[]>("list_files", { path })
    },

    async readFile(path: string): Promise<string> {
        return await invoke<string>("read_file", { path })
    },

    async searchFiles(path: string, extensions: string[]): Promise<FileEntry[]> {
        return await invoke<FileEntry[]>("search_files", { path, extensions })
    },
}
