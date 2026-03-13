use crate::models::apk::{ApkVersion, FileEntry};
use crate::services::{download, extractor, version, browser};
use tauri::{AppHandle, command};

#[command]
pub async fn get_latest_version() -> Result<ApkVersion, String> {
    version::check_latest_version().await
}

#[command]
pub async fn get_app_dir() -> Result<String, String> {
    Ok(browser::get_app_dir().to_string_lossy().to_string())
}

#[command]
pub async fn download_apk(url: String, path: String, app: AppHandle) -> Result<(), String> {
    download::download_file(&url, &path, &app).await
}

#[command]
pub async fn extract_package(path: String, out_dir: String, app: AppHandle) -> Result<(), String> {
    extractor::extract_apk(&path, &out_dir, &app)
}

#[command]
pub async fn open_folder(path: String) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("explorer")
            .arg(&path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }
    #[cfg(not(target_os = "windows"))]
    {
        return Err("OS not supported for auto-open".to_string());
    }
    Ok(())
}

#[command]
pub async fn list_files(path: String) -> Result<Vec<FileEntry>, String> {
    browser::list_directory(&path)
}

#[command]
pub async fn read_file(path: String) -> Result<String, String> {
    browser::read_file_as_base64(&path)
}

#[command]
pub async fn search_files(path: String, extensions: Vec<String>) -> Result<Vec<FileEntry>, String> {
    browser::find_files_recursive(&path, extensions)
}

#[command]
pub async fn copy_file(source: String, destination: String) -> Result<(), String> {
    std::fs::copy(source, destination)
        .map(|_| ())
        .map_err(|e| e.to_string())
}
