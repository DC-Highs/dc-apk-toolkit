use std::fs;
use std::path::Path;
use serde::{Serialize, Deserialize};
use tauri::{AppHandle, Emitter, Runtime};
use futures_util::StreamExt;
use std::io::Write;
use zip::ZipArchive;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProgressPayload {
    pub progress: f64,
    pub total: u64,
    pub downloaded: u64,
    pub status: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ApkInfo {
    pub version: String,
    pub download_url: String,
}

#[tauri::command]
async fn get_latest_version() -> Result<ApkInfo, String> {
    let url = "https://apkpure.com/dragon-city-mobile-1/es.socialpoint.DragonCity";
    let client = reqwest::Client::builder()
        .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        .build()
        .map_err(|e| e.to_string())?;

    let response = client.get(url)
        .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8")
        .header("Accept-Language", "en-US,en;q=0.9")
        .header("Sec-Ch-Ua", "\"Not A(Brand\";v=\"99\", \"Google Chrome\";v=\"121\", \"Chromium\";v=\"121\"")
        .header("Sec-Ch-Ua-Mobile", "?0")
        .header("Sec-Ch-Ua-Platform", "\"Windows\"")
        .header("Upgrade-Insecure-Requests", "1")
        .header("Referer", "https://apkpure.com/")
        .send()
        .await
        .map_err(|e| format!("Network error: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("APKPure returned error status: {}", response.status()));
    }

    let html = response.text().await.map_err(|e| e.to_string())?;
    let document = scraper::Html::parse_document(&html);
    
    // Updated selectors based on live APKPure structure
    let version_selector = scraper::Selector::parse(".version.one-line").unwrap();
    let download_btn_selector = scraper::Selector::parse(".dt-main-download-btn").unwrap();

    let version = document.select(&version_selector)
        .next()
        .map(|el| el.text().collect::<String>().trim().to_string())
        .or_else(|| {
            // Fallback: try data-dt-version attribute from the download button
            document.select(&download_btn_selector)
                .next()
                .and_then(|el| el.value().attr("data-dt-version"))
                .map(|v| v.to_string())
        })
        .ok_or("Could not find version number on page")?;

    let download_path = document.select(&download_btn_selector)
        .next()
        .and_then(|el| el.value().attr("href"))
        .ok_or("Could not find download button")?;

    let download_url = if download_path.starts_with("http") {
        download_path.to_string()
    } else {
        format!("https://apkpure.com{}", download_path)
    };

    Ok(ApkInfo { version, download_url })
}

#[tauri::command]
async fn download_apk<R: Runtime>(
    app: AppHandle<R>,
    url: String,
    version: String,
) -> Result<String, String> {
    let client = reqwest::Client::builder()
        .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        .build()
        .map_err(|e| e.to_string())?;

    // First, follow redirects to get the final download URL
    let res = client.get(&url).send().await.map_err(|e| e.to_string())?;
    let final_url = res.url().to_string();
    
    // If it's the direct download page, we might need to parse it again or just use it
    let res = client.get(final_url).send().await.map_err(|e| e.to_string())?;
    
    let total_size = res.content_length().ok_or("Failed to get content length")?;
    let mut downloaded: u64 = 0;
    let mut stream = res.bytes_stream();

    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;
    let download_dir = home_dir.join("DragonCityToolkit").join("downloads");
    fs::create_dir_all(&download_dir).map_err(|e| e.to_string())?;
    
    let file_path = download_dir.join(format!("dragon_city_{}.xapk", version));
    let mut file = fs::File::create(&file_path).map_err(|e| e.to_string())?;

    while let Some(item) = stream.next().await {
        let chunk = item.map_err(|e| e.to_string())?;
        file.write_all(&chunk).map_err(|e| e.to_string())?;
        downloaded += chunk.len() as u64;

        let progress = (downloaded as f64 / total_size as f64) * 100.0;
        app.emit("download-progress", ProgressPayload {
            progress,
            total: total_size,
            downloaded,
            status: "Downloading...".to_string(),
        }).map_err(|e| e.to_string())?;
    }

    Ok(file_path.to_string_lossy().to_string())
}

#[tauri::command]
async fn extract_package<R: Runtime>(
    app: AppHandle<R>,
    file_path: String,
    version: String,
) -> Result<String, String> {
    let path = Path::new(&file_path);
    if !path.exists() {
        return Err("File not found".to_string());
    }

    let home_dir = dirs::home_dir().ok_or("Could not find home directory")?;
    let extract_base_dir = home_dir.join("DragonCityToolkit").join("extracted").join(&version);
    fs::create_dir_all(&extract_base_dir).map_err(|e| e.to_string())?;

    app.emit("extract-progress", "Extracting package...").map_err(|e| e.to_string())?;

    // Check if it's XAPK (which is just a zip containing APKs)
    let file = fs::File::open(path).map_err(|e| e.to_string())?;
    let mut archive = ZipArchive::new(file).map_err(|e| e.to_string())?;

    let mut is_xapk = false;
    for i in 0..archive.len() {
        let file = archive.by_index(i).map_err(|e| e.to_string())?;
        if file.name().ends_with(".apk") {
            is_xapk = true;
            break;
        }
    }

    if is_xapk {
        // Extract all contents first
        archive.extract(&extract_base_dir).map_err(|e| e.to_string())?;
        
        // Find base.apk or the largest apk
        let mut base_apk = extract_base_dir.join("com.socialpoint.DragonCity.apk");
        if !base_apk.exists() {
             // Fallback: finding largest apk
             let mut largest_size = 0;
             for entry in fs::read_dir(&extract_base_dir).map_err(|e| e.to_string())? {
                 let entry = entry.map_err(|e| e.to_string())?;
                 let path = entry.path();
                 if path.extension().map_or(false, |ext| ext == "apk") {
                     let size = fs::metadata(&path).map_err(|e| e.to_string())?.len();
                     if size > largest_size {
                         largest_size = size;
                         base_apk = path;
                     }
                 }
             }
        }

        if base_apk.exists() {
            app.emit("extract-progress", "Extracting main APK assets...").map_err(|e| e.to_string())?;
            let apk_file = fs::File::open(&base_apk).map_err(|e| e.to_string())?;
            let mut apk_archive = ZipArchive::new(apk_file).map_err(|e| e.to_string())?;
            let assets_dir = extract_base_dir.join("assets_extracted");
            apk_archive.extract(&assets_dir).map_err(|e| e.to_string())?;
        }
    } else {
        // Direct APK
        archive.extract(&extract_base_dir).map_err(|e| e.to_string())?;
    }

    Ok(extract_base_dir.to_string_lossy().to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            get_latest_version,
            download_apk,
            extract_package
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
