export interface ApkVersion {
    version: string
    url: string
    sizeMb?: number
    releaseDate?: string
}

export interface ProgressPayload {
    received: number
    total: number
    percentage: number
}

export interface ExtractionProgress {
    current_file: string
    progress: number
}
