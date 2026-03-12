-- Create tables
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT,
    age INT,
    gender TEXT,
    weight FLOAT, -- in kg
    height FLOAT, -- in cm
    fitness_goal TEXT,
    daily_calorie_target INT DEFAULT 2000,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    calories INT NOT NULL, -- per 100g/serving
    protein FLOAT DEFAULT 0.0,
    carbs FLOAT DEFAULT 0.0,
    fats FLOAT DEFAULT 0.0,
    category TEXT -- breakfast, lunch, dinner, snack
);

CREATE TABLE IF NOT EXISTS food_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    food_name TEXT NOT NULL,
    calories INT NOT NULL,
    protein FLOAT DEFAULT 0.0,
    carbs FLOAT DEFAULT 0.0,
    fats FLOAT DEFAULT 0.0,
    serving_size FLOAT NOT NULL, -- e.g., 1 serving or 100g
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    duration INT NOT NULL, -- in minutes
    calories_burned INT NOT NULL,
    workout_type TEXT, -- cardio, strength, etc.
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed some international food data
INSERT INTO meals (name, calories, protein, carbs, fats, category) VALUES
('Nasi Goreng', 250, 8.0, 30.0, 12.0, 'lunch'),
('Sushi (Salmon Nigiri)', 150, 6.0, 20.0, 4.0, 'lunch'),
('Burger (Cheeseburger)', 300, 15.0, 25.0, 16.0, 'lunch'),
('Pasta Carbonara', 350, 12.0, 45.0, 18.0, 'dinner'),
('Salad (Chicken Caesar)', 220, 18.0, 10.0, 12.0, 'lunch'),
('Pizza Margherita', 260, 10.0, 32.0, 10.0, 'dinner'),
('Steak (Beef Ribeye)', 290, 24.0, 0.0, 22.0, 'dinner'),
('Oatmeal with Fruits', 150, 5.0, 28.0, 3.0, 'breakfast'),
('Greek Yogurt', 100, 10.0, 6.0, 5.0, 'breakfast'),
('Dim Sum (Siu Mai)', 180, 8.0, 12.0, 10.0, 'snack'),
('Ramen (Shoyu)', 140, 6.0, 22.0, 3.5, 'dinner'),
('Kebab (Chicken)', 200, 16.0, 18.0, 7.0, 'lunch');
