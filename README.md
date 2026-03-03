# workout-miniapp

Telegram Mini App frontend scaffold for workout history/search.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

Environment:
- `VITE_API_URL` - backend API base URL (default: `http://localhost:8000`).

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import project in Vercel.
3. Add environment variable:
   - `VITE_API_URL=https://<your-backend>.onrender.com`
4. Deploy; get URL:
   - `https://<your-miniapp>.vercel.app`
5. Put this URL into backend env:
   - `WEBAPP_URL=https://<your-miniapp>.vercel.app`
   - `API_CORS_ORIGINS=https://<your-miniapp>.vercel.app`
6. Restart `workout-api` and `workout-bot` on Render.

After that, Telegram button `📱 Открыть приложение` opens this Mini App directly in Telegram.

## Local fallback preview

```bash
npm run dev -- --host 0.0.0.0 --port 5173
```

## Implemented screens

- Auth bootstrap via Telegram WebApp `initData` (with manual fallback input).
- Workout history list (`GET /workouts`).
- Workout detail view (`GET /workouts/{id}`).
- Search panel (`GET /workouts/search`).
- Filters bootstrap (`GET /filters`).
