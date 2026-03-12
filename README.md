# FitFreak - AI-Powered Fitness & Meal Planner

A modern full-stack fitness application built with **Rust (Axum)** and **React (Vite + TypeScript)**.

## Features
- **AI Fitness Coach:** Integrated Gemini AI for real-time fitness and nutrition advice.
- **Global Meal Database:** Search and log international meals with nutritional data.
- **Workout Logging:** Track exercises, duration, and calories burned.
- **Progress Charts:** Visualize weight and calorie trends using Recharts.
- **Emerald Gradient UI:** Modern, responsive glassmorphism design.
- **Secure Auth:** JWT-based authentication with PostgreSQL.

## Prerequisites
- Rust (Latest stable)
- Node.js (v18+)
- PostgreSQL

## Setup
1. **Database:**
   - Create a PostgreSQL database named `fitfreak`.
   - Update `backend/.env` with your `DATABASE_URL`.

2. **AI Key:**
   - Get a Gemini AI API key from [Google AI Studio](https://aistudio.google.com/).
   - Add it to `backend/.env` as `GEMINI_API_KEY`.

3. **Install Dependencies:**
   ```bash
   npm run setup
   ```

4. **Run Application:**
   ```bash
   npm run dev
   ```

## Production
Build both projects:
```bash
npm run build
```
Run the backend:
```bash
npm run start
```
