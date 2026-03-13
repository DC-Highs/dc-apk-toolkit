pub mod models;
pub mod services;
pub mod commands;

use crate::commands::apk::{get_latest_version, get_app_dir, download_apk, extract_package, open_folder, list_files, read_file, search_files};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            get_latest_version,
            get_app_dir,
            download_apk,
            extract_package,
            open_folder,
            list_files,
            read_file,
            search_files
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
