use jsonwebtoken::{encode, decode, Header, Validation, EncodingKey, DecodingKey};
use serde::{Serialize, Deserialize};
use uuid::Uuid;
use chrono::{Utc, Duration};
use bcrypt::{hash, verify, DEFAULT_COST};
use crate::models::{User, AuthRequest, UserResponse};
use sqlx::PgPool;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: Uuid,
    pub exp: usize,
}

pub fn create_jwt(user_id: Uuid, secret: &str) -> String {
    let expiration = Utc::now()
        .checked_add_signed(Duration::days(7))
        .expect("valid timestamp")
        .timestamp();

    let claims = Claims {
        sub: user_id,
        exp: expiration as usize,
    };

    encode(&Header::default(), &claims, &EncodingKey::from_secret(secret.as_ref()))
        .expect("JWT encoding failed")
}

pub fn decode_jwt(token: &str, secret: &str) -> Option<Claims> {
    decode::<Claims>(token, &DecodingKey::from_secret(secret.as_ref()), &Validation::default())
        .ok()
        .map(|data| data.claims)
}

pub async fn register_user(pool: &PgPool, req: AuthRequest) -> Result<User, sqlx::Error> {
    let password_hash = hash(req.password, DEFAULT_COST).expect("Hashing failed");
    let user = sqlx::query_as!(
        User,
        "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, password_hash, created_at",
        req.username.unwrap_or_default(),
        req.email,
        password_hash
    )
    .fetch_one(pool)
    .await?;

    // Create a default profile
    sqlx::query!(
        "INSERT INTO user_profiles (user_id) VALUES ($1)",
        user.id
    )
    .execute(pool)
    .await?;

    Ok(user)
}

pub async fn login_user(pool: &PgPool, req: AuthRequest) -> Option<User> {
    let user = sqlx::query_as!(
        User,
        "SELECT id, username, email, password_hash, created_at FROM users WHERE email = $1",
        req.email
    )
    .fetch_optional(pool)
    .await
    .ok()??;

    if verify(req.password, &user.password_hash).ok()? {
        Some(user)
    } else {
        None
    }
}
