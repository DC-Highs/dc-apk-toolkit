use std::fs;
use std::path::PathBuf;
use crate::models::apk::FileEntry;

pub fn get_app_dir() -> PathBuf {
    let mut path = dirs::document_dir().unwrap_or_else(|| PathBuf::from("."));
    path.push("DCApkToolkit");
    
    if !path.exists() {
        let _ = fs::create_dir_all(&path);
    }
    
    path
}

pub fn list_directory(path: &str) -> Result<Vec<FileEntry>, String> {
    let entries = fs::read_dir(path).map_err(|e| e.to_string())?;
    let mut files = Vec::new();

    for entry in entries {
        if let Ok(entry) = entry {
            let path_buf = entry.path();
            let metadata = entry.metadata().map_err(|e| e.to_string())?;
            
            files.push(FileEntry {
                name: entry.file_name().to_string_lossy().to_string(),
                is_dir: metadata.is_dir(),
                size: metadata.len(),
                path: path_buf.to_string_lossy().to_string(),
            });
        }
    }

    files.sort_by(|a, b| {
        if a.is_dir != b.is_dir {
            b.is_dir.cmp(&a.is_dir)
        } else {
            a.name.to_lowercase().cmp(&b.name.to_lowercase())
        }
    });

    Ok(files)
}

pub fn find_files_recursive(base_path: &str, extensions: Vec<String>) -> Result<Vec<FileEntry>, String> {
    use walkdir::WalkDir;
    let mut files = Vec::new();
    let exts: Vec<String> = extensions.iter().map(|e| e.to_lowercase()).collect();

    for entry in WalkDir::new(base_path).into_iter().filter_map(|e| e.ok()) {
        if entry.file_type().is_file() {
            let path = entry.path();
            let ext = path.extension().and_then(|s| s.to_str()).unwrap_or("").to_lowercase();
            
            if exts.contains(&ext) {
                files.push(FileEntry {
                    name: entry.file_name().to_string_lossy().to_string(),
                    is_dir: false,
                    size: entry.metadata().map(|m| m.len()).unwrap_or(0),
                    path: path.to_string_lossy().to_string(),
                });
            }
        }
    }

    Ok(files)
}

pub fn read_file_as_base64(path: &str) -> Result<String, String> {
    use base64::{Engine as _, engine::general_purpose};
    let bytes = fs::read(path).map_err(|e| e.to_string())?;
    Ok(general_purpose::STANDARD.encode(bytes))
}
