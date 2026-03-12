use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    pub password_hash: String,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct UserProfile {
    pub user_id: Uuid,
    pub full_name: Option<String>,
    pub age: Option<i32>,
    pub gender: Option<String>,
    pub weight: Option<f64>,
    pub height: Option<f64>,
    pub fitness_goal: Option<String>,
    pub daily_calorie_target: Option<i32>,
    pub updated_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Meal {
    pub id: Uuid,
    pub name: String,
    pub calories: i32,
    pub protein: Option<f64>,
    pub carbs: Option<f64>,
    pub fats: Option<f64>,
    pub category: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct FoodLog {
    pub id: Uuid,
    pub user_id: Option<Uuid>,
    pub food_name: String,
    pub calories: i32,
    pub protein: Option<f64>,
    pub carbs: Option<f64>,
    pub fats: Option<f64>,
    pub serving_size: f64,
    pub logged_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Workout {
    pub id: Uuid,
    pub user_id: Option<Uuid>,
    pub title: String,
    pub duration: i32,
    pub calories_burned: i32,
    pub workout_type: Option<String>,
    pub logged_at: Option<DateTime<Utc>>,
}

#[derive(Deserialize)]
pub struct AuthRequest {
    pub username: Option<String>,
    pub email: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub user: UserResponse,
}

#[derive(Serialize)]
pub struct UserResponse {
    pub id: Uuid,
    pub username: String,
    pub email: String,
}

#[derive(Deserialize)]
pub struct ChatRequest {
    pub message: String,
}

#[derive(Serialize)]
pub struct ChatResponse {
    pub reply: String,
}
