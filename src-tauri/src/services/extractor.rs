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
    let out_path = PathBuf::from(output_dir);
    if !out_path.exists() {
        fs::create_dir_all(&out_path).map_err(|e| e.to_string())?;
    }

    // Pass 1: Extract the main package
    let _ = extract_zip(Path::new(file_path), &out_path, app, "")?;

    // Multi-pass extraction for common nested APKs
    let nested_apk_names = ["base.apk", "es.socialpoint.DragonCity.apk", "android_asset_pack.apk"];
    
    // We'll do a few passes to ensure we get nested assets (in case an APK is inside another APK)
    for _ in 0..2 {
        let mut found_any = false;
        let mut to_extract = Vec::new();
        
        for entry in walkdir::WalkDir::new(&out_path).into_iter().flatten() {
            if entry.file_type().is_file() {
                let name = entry.file_name().to_string_lossy();
                if nested_apk_names.contains(&name.as_ref()) {
                    to_extract.push(entry.path().to_path_buf());
                }
            }
        }

        for apk in to_extract {
            let name = apk.file_name().unwrap_or_default().to_string_lossy().into_owned();
            let _ = app.emit("extraction-progress", ExtractionProgress {
                current_file: format!("Extracting nested package: {}...", name),
                progress: 0.0,
            });
            let _ = extract_zip(&apk, &out_path, app, &format!("[{}] ", name));
            found_any = true;
            // Delete it immediately after extraction
            let _ = fs::remove_file(apk);
        }
        
        if !found_any { break; }
    }

    // Final Cleanup: Delete any remaining .apk files in the output directory
    let _ = app.emit("extraction-progress", ExtractionProgress {
        current_file: "Performing final cleanup...".to_string(),
        progress: 95.0,
    });
    
    cleanup_apks(&out_path);

    // Delete the original APK file
    let _ = fs::remove_file(file_path);

    let _ = app.emit("extraction-progress", ExtractionProgress {
        current_file: "Complete".to_string(),
        progress: 100.0,
    });

    Ok(())
}

fn cleanup_apks(dir: &Path) {
    if let Ok(entries) = fs::read_dir(dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                cleanup_apks(&path);
            } else if path.extension().and_then(|s| s.to_str()) == Some("apk") {
                let _ = fs::remove_file(path);
            }
        }
    }
}
