use std::path::Path;
use tokio::process::Command;
use std::process::Stdio;
use tauri::{AppHandle, Emitter};

#[derive(serde::Serialize, Clone)]
pub struct DownloadProgress {
    pub received: u64,
    pub total: u64,
    pub percentage: f64,
}

use tokio::io::{BufReader, AsyncBufReadExt};

pub async fn download_file(_url: &str, path: &str, app: &AppHandle) -> Result<(), String> {
    let pkg_id = "es.socialpoint.DragonCity";
    
    let path_obj = Path::new(path);
    let out_dir = path_obj.parent()
        .filter(|p| !p.as_os_str().is_empty())
        .unwrap_or(Path::new("."));

    println!("Starting apkeep download: pkg={} out={:?}", pkg_id, out_dir);

    let _ = app.emit("download-progress", DownloadProgress {
        received: 0,
        total: 100,
        percentage: 0.0,
    });

    let mut child = Command::new("apkeep")
        .arg("-d")
        .arg("apk-pure")
        .arg("-a")
        .arg(pkg_id)
        .arg(out_dir)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to start apkeep: {}.", e))?;

    let stdout = child.stdout.take().unwrap();
    let mut reader = BufReader::new(stdout).lines();

    let mut simulated_progress = 0.0;
    while let Ok(Some(line)) = reader.next_line().await {
        println!("apkeep: {}", line);
        // Simulating some progress based on output lines if apkeep doesn't give clean %
        simulated_progress += 5.0;
        if simulated_progress > 95.0 { simulated_progress = 95.0; }
        
        let _ = app.emit("download-progress", DownloadProgress {
            received: simulated_progress as u64,
            total: 100,
            percentage: simulated_progress,
        });
    }

    let output = child.wait_with_output().await.map_err(|e| e.to_string())?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!(
            "apkeep failed with {}.\nStderr: {}", 
            output.status, stderr
        ));
    }

    let apk_path = out_dir.join(format!("{}.apk", pkg_id));
    let xapk_path = out_dir.join(format!("{}.xapk", pkg_id));
    
    let actual_downloaded = if apk_path.exists() {
        Some(apk_path)
    } else if xapk_path.exists() {
        Some(xapk_path)
    } else {
        None
    };

    if let Some(src) = actual_downloaded {
        if src != path_obj {
            if path_obj.exists() {
                let _ = std::fs::remove_file(path_obj);
            }
            std::fs::rename(src, path_obj).map_err(|e| format!("Failed to rename {} to {}: {}", pkg_id, path, e))?;
        }
    } else {
        return Err(format!("apkeep finished but could not find {}.apk or {}.xapk in {:?}", pkg_id, pkg_id, out_dir));
    }

    let _ = app.emit("download-progress", DownloadProgress {
        received: 100,
        total: 100,
        percentage: 100.0,
    });

    Ok(())
}
