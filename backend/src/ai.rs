use reqwest::Client;
use serde_json::json;
use crate::models::{ChatRequest, ChatResponse};
use std::env;

pub async fn get_ai_coach_reply(req: ChatRequest) -> Result<String, String> {
    let api_key = env::var("GEMINI_API_KEY").map_err(|_| "GEMINI_API_KEY not found")?;
    let client = Client::new();
    
    let url = format!(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={}",
        api_key
    );

    let prompt = format!(
        "You are FitFreak AI, a professional and motivating fitness coach. Answer the user's fitness or nutrition question concisely and with actionable advice. User says: {}",
        req.message
    );

    let body = json!({
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }]
    });

    let response = client.post(url)
        .json(&body)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;

    let json_response: serde_json::Value = response.json().await.map_err(|e| format!("JSON parsing failed: {}", e))?;
    
    let reply = json_response["candidates"][0]["content"]["parts"][0]["text"]
        .as_str()
        .ok_or("Invalid AI response")?
        .to_string();

    Ok(reply)
}
