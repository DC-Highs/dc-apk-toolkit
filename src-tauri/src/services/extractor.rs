use std::fs;
use std::path::{Path, PathBuf};
use zip::ZipArchive;
use tauri::{AppHandle, Emitter};
use crate::models::apk::ExtractionProgress;

fn extract_zip(zip_path: &Path, out_path: &Path, app: &AppHandle, prefix: &str) -> Result<Vec<PathBuf>, String> {
    let file = fs::File::open(zip_path).map_err(|e| e.to_string())?;
    let mut archive = ZipArchive::new(file).map_err(|e| e.to_string())?;
    let mut extracted_paths = Vec::new();

    let total_files = archive.len();

    for i in 0..total_files {
        let mut file = archive.by_index(i).map_err(|e| e.to_string())?;
        let outpath = match file.enclosed_name() {
            Some(path) => out_path.join(path),
            None => continue,
        };

        if (*file.name()).ends_with('/') {
            fs::create_dir_all(&outpath).map_err(|e| e.to_string())?;
        } else {
            if let Some(p) = outpath.parent() {
                if !p.exists() {
                    fs::create_dir_all(&p).map_err(|e| e.to_string())?;
                }
            }
            let mut outfile = fs::File::create(&outpath).map_err(|e| e.to_string())?;
            std::io::copy(&mut file, &mut outfile).map_err(|e| e.to_string())?;
            extracted_paths.push(outpath.clone());
        }

        let progress = (i as f64 / total_files as f64) * 100.0;
        let _ = app.emit("extraction-progress", ExtractionProgress {
            current_file: format!("{}{}", prefix, file.name()),
            progress,
        });
    }
    Ok(extracted_paths)
}

pub fn extract_apk(file_path: &str, output_dir: &str, app: &AppHandle) -> Result<(), String> {
    let out_path = Path::new(output_dir);
    if !out_path.exists() {
        fs::create_dir_all(out_path).map_err(|e| e.to_string())?;
    }

    // Pass 1: Extract the main package (v2: could be XAPK or APK)
    let initial_paths = extract_zip(Path::new(file_path), out_path, app, "")?;

    // Pass 2: If we find a main APK inside (common in XAPKs), extract it too
    // We look for common names like the package id or base.apk
    let inner_apk = initial_paths.iter().find(|p| {
        let name = p.file_name().unwrap_or_default().to_string_lossy();
        name == "es.socialpoint.DragonCity.apk" || name == "base.apk"
    });

    if let Some(apk_to_extract) = inner_apk {
        let _ = app.emit("extraction-progress", ExtractionProgress {
            current_file: "Found inner APK, extracting assets...".to_string(),
            progress: 0.0,
        });
        
        // Extract inner APK into the same directory
        extract_zip(apk_to_extract, out_path, app, "[Inner] ")?;
        
        // Optional: remove the inner apk after extraction to save space
        // let _ = fs::remove_file(apk_to_extract);
    }

    let _ = app.emit("extraction-progress", ExtractionProgress {
        current_file: "Complete".to_string(),
        progress: 100.0,
    });

    Ok(())
}
