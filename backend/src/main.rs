mod models;
mod auth;
mod ai;
mod handlers;

use axum::{
    routing::{get, post, put},
    Router,
    extract::{State, Json, Path},
    http::{StatusCode, Method},
    response::IntoResponse,
};
use sqlx::postgres::PgPoolOptions;
use std::env;
use tower_http::cors::{Any, CorsLayer};
use dotenvy::dotenv;
use models::{AuthRequest, AuthResponse, UserResponse};
use auth::{register_user, login_user, create_jwt};

#[derive(Clone)]
pub struct AppState {
    pub pool: sqlx::PgPool,
    pub jwt_secret: String,
}

#[tokio::main]
async fn main() {
    dotenv().ok();
    tracing_subscriber::fmt::init();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to connect to database");

    let jwt_secret = env::var("JWT_SECRET").unwrap_or_else(|_| "super-secret".to_string());
    
    let state = AppState {
        pool,
        jwt_secret,
    };

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers(Any);

    let app = Router::new()
        // Auth routes
        .route("/api/auth/register", post(handlers::register_handler))
        .route("/api/auth/login", post(handlers::login_handler))
        // Protected routes
        .route("/api/users/:user_id/workouts", get(handlers::list_workouts).post(handlers::create_workout))
        .route("/api/users/:user_id/profile", get(handlers::get_profile).put(handlers::update_profile))
        .route("/api/meals/search", get(handlers::search_meals))
        .route("/api/users/:user_id/food-logs", get(handlers::list_food_logs).post(handlers::log_food))
        .route("/api/ai/chat", post(handlers::chat_with_coach))
        .layer(cors)
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    println!("Backend running on http://{}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}
