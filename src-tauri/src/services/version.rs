use crate::models::apk::ApkVersion;
use scraper::{Html, Selector};
use reqwest::Client;

fn extract_data_url(html: &str) -> Result<String, String> {
    let document = Html::parse_document(html);
    let button_selector = Selector::parse("button#detail-download-button").unwrap();
    
    document.select(&button_selector)
        .next()
        .and_then(|el| el.value().attr("data-url"))
        .map(|s| s.to_string())
        .ok_or_else(|| {
            "Could not find detail-download-button or data-url on download page".to_string()
        })
}

pub async fn check_latest_version() -> Result<ApkVersion, String> {
    let url = "https://dragon-city.en.uptodown.com/android";
    let client = Client::builder()
        .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        .build()
        .map_err(|e| e.to_string())?;

    let response = client.get(url)
        .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8")
        .header("Accept-Language", "en-US,en;q=0.9")
        .header("Referer", "https://en.uptodown.com/")
        .send()
        .await
        .map_err(|e| format!("Network error: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("Uptodown returned error status: {}", response.status()));
    }

    let html = response.text().await.map_err(|e| e.to_string())?;
    let (version, download_page_url) = {
        let document = Html::parse_document(&html);
        
        let version_selector = Selector::parse("div.info div.version").unwrap();
        let download_page_selector = Selector::parse("a#button-download-page-link").unwrap();

        let version = document.select(&version_selector)
            .next()
            .map(|el| el.text().collect::<String>().trim().to_string())
            .ok_or("Could not find version number on Uptodown")?;

        let download_page_url = document.select(&download_page_selector)
            .next()
            .and_then(|el| el.value().attr("href"))
            .map(|url| url.to_string())
            .ok_or("Could not find download button on Uptodown")?;
            
        Ok::<_, String>((version, download_page_url))
    }?;

    // Now we need the actual direct link from the download page
    let response = client.get(&download_page_url)
        .header("Referer", url)
        .send()
        .await
        .map_err(|e| format!("Network error accessing download page: {}", e))?;

    let html = response.text().await.map_err(|e| e.to_string())?;
    let data_url = extract_data_url(&html)?;
    let final_url = format!("https://dw.uptodown.com/dwn/{}", data_url);

    Ok(ApkVersion {
        version,
        url: final_url,
        size_mb: None, // We don't have it easily yet
        release_date: None,
    })
}
