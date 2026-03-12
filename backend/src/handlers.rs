use axum::{
    extract::{Path, State, Json, Query},
    http::StatusCode,
    response::IntoResponse,
};
use sqlx::{query_as};
use uuid::Uuid;
use crate::AppState;
use crate::models::{Workout, Meal, FoodLog, UserProfile, ChatRequest, ChatResponse, AuthRequest, AuthResponse, UserResponse};
use crate::ai::get_ai_coach_reply;
use crate::auth::{register_user, login_user, create_jwt};

pub async fn register_handler(
    State(state): State<AppState>,
    Json(req): Json<AuthRequest>,
) -> impl IntoResponse {
    match register_user(&state.pool, req).await {
        Ok(user) => {
            let token = create_jwt(user.id, &state.jwt_secret);
            (StatusCode::CREATED, Json(AuthResponse {
                token,
                user: UserResponse { id: user.id, username: user.username, email: user.email },
            })).into_response()
        },
        Err(e) => (StatusCode::BAD_REQUEST, e.to_string()).into_response(),
    }
}

pub async fn login_handler(
    State(state): State<AppState>,
    Json(req): Json<AuthRequest>,
) -> impl IntoResponse {
    match login_user(&state.pool, req).await {
        Some(user) => {
            let token = create_jwt(user.id, &state.jwt_secret);
            (StatusCode::OK, Json(AuthResponse {
                token,
                user: UserResponse { id: user.id, username: user.username, email: user.email },
            })).into_response()
        },
        None => (StatusCode::UNAUTHORIZED, "Invalid credentials").into_response(),
    }
}

pub async fn list_workouts(
    State(state): State<AppState>,
    Path(user_id): Path<Uuid>,
) -> impl IntoResponse {
    let workouts = query_as!(
        Workout,
        "SELECT id, user_id, title, duration, calories_burned, workout_type, logged_at FROM workouts WHERE user_id = $1 ORDER BY logged_at DESC",
        user_id
    )
    .fetch_all(&state.pool)
    .await
    .unwrap_or_default();

    Json(workouts)
}

pub async fn create_workout(
    State(state): State<AppState>,
    Path(user_id): Path<Uuid>,
    Json(req): Json<Workout>,
) -> impl IntoResponse {
    let workout = query_as!(
        Workout,
        "INSERT INTO workouts (user_id, title, duration, calories_burned, workout_type) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id, title, duration, calories_burned, workout_type, logged_at",
        user_id,
        req.title,
        req.duration,
        req.calories_burned,
        req.workout_type
    )
    .fetch_one(&state.pool)
    .await;

    match workout {
        Ok(w) => (StatusCode::CREATED, Json(w)).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

pub async fn search_meals(
    State(state): State<AppState>,
    Query(params): Query<std::collections::HashMap<String, String>>,
) -> impl IntoResponse {
    let query_str = params.get("q").cloned().unwrap_or_default();
    let meals = query_as!(
        Meal,
        "SELECT id, name, calories, protein, carbs, fats, category FROM meals WHERE name ILIKE $1",
        format!("%{}%", query_str)
    )
    .fetch_all(&state.pool)
    .await
    .unwrap_or_default();

    Json(meals)
}

pub async fn list_food_logs(
    State(state): State<AppState>,
    Path(user_id): Path<Uuid>,
) -> impl IntoResponse {
    let logs = query_as!(
        FoodLog,
        "SELECT id, user_id, food_name, calories, protein, carbs, fats, serving_size, logged_at FROM food_logs WHERE user_id = $1 ORDER BY logged_at DESC",
        user_id
    )
    .fetch_all(&state.pool)
    .await
    .unwrap_or_default();

    Json(logs)
}

pub async fn log_food(
    State(state): State<AppState>,
    Path(user_id): Path<Uuid>,
    Json(req): Json<FoodLog>,
) -> impl IntoResponse {
    let log = query_as!(
        FoodLog,
        "INSERT INTO food_logs (user_id, food_name, calories, protein, carbs, fats, serving_size) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, user_id, food_name, calories, protein, carbs, fats, serving_size, logged_at",
        user_id,
        req.food_name,
        req.calories,
        req.protein,
        req.carbs,
        req.fats,
        req.serving_size
    )
    .fetch_one(&state.pool)
    .await;

    match log {
        Ok(l) => (StatusCode::CREATED, Json(l)).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

pub async fn get_profile(
    State(state): State<AppState>,
    Path(user_id): Path<Uuid>,
) -> impl IntoResponse {
    let profile = query_as!(
        UserProfile,
        "SELECT user_id, full_name, age, gender, weight, height, fitness_goal, daily_calorie_target, updated_at FROM user_profiles WHERE user_id = $1",
        user_id
    )
    .fetch_one(&state.pool)
    .await;

    match profile {
        Ok(p) => Json(p).into_response(),
        Err(e) => (StatusCode::NOT_FOUND, e.to_string()).into_response(),
    }
}

pub async fn update_profile(
    State(state): State<AppState>,
    Path(user_id): Path<Uuid>,
    Json(req): Json<UserProfile>,
) -> impl IntoResponse {
    let profile = query_as!(
        UserProfile,
        "UPDATE user_profiles SET full_name = $1, age = $2, gender = $3, weight = $4, height = $5, fitness_goal = $6, daily_calorie_target = $7, updated_at = CURRENT_TIMESTAMP WHERE user_id = $8 RETURNING user_id, full_name, age, gender, weight, height, fitness_goal, daily_calorie_target, updated_at",
        req.full_name,
        req.age,
        req.gender,
        req.weight,
        req.height,
        req.fitness_goal,
        req.daily_calorie_target,
        user_id
    )
    .fetch_one(&state.pool)
    .await;

    match profile {
        Ok(p) => Json(p).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

pub async fn chat_with_coach(
    Json(req): Json<ChatRequest>,
) -> impl IntoResponse {
    match get_ai_coach_reply(req).await {
        Ok(reply) => Json(ChatResponse { reply }).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e).into_response(),
    }
}
