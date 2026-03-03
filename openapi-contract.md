# API Contract (MVP)

Base URL: provided by backend deployment.

## GET /health

Response:

```json
{"status": "ok"}
```

## POST /auth/webapp

Request:

```json
{"initData": "query-string-from-telegram"}
```

Response:

```json
{
  "access_token": "token",
  "token_type": "bearer",
  "expires_in": 900,
  "user_id": 123456
}
```

## Authorization

All endpoints below require:

```http
Authorization: Bearer <access_token>
```

## GET /workouts?limit=20&offset=0

Response:

```json
{
  "items": [
    {
      "id": 101,
      "title": "Грудь + трицепс",
      "date_utc": "2026-03-03T08:00:00+00:00",
      "comment": "Хороший прогресс",
      "exercise_count": 4,
      "total_volume": 1890.0
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
```

## GET /workouts/{workout_id}

Response:

```json
{
  "id": 101,
  "title": "Грудь + трицепс",
  "date_utc": "2026-03-03T08:00:00+00:00",
  "comment": "Хороший прогресс",
  "status": "completed",
  "exercises": [
    {
      "workout_exercise_id": 1001,
      "exercise_id": 11,
      "exercise_name": "Жим лёжа",
      "comment": "Можно прибавить",
      "sets": [
        {"set_number": 1, "weight": 100.0, "reps": 10},
        {"set_number": 2, "weight": 105.0, "reps": 8}
      ]
    }
  ]
}
```

## GET /workouts/search?muscle_group_id=&exercise_id=&period_months=

All query params are optional.

Response:

```json
{
  "items": [
    {
      "id": 101,
      "title": "Грудь + трицепс",
      "date_utc": "2026-03-03T08:00:00+00:00",
      "comment": "Хороший прогресс",
      "exercise_count": 4,
      "total_volume": 1890.0
    }
  ],
  "total": 1
}
```

## GET /filters

Response:

```json
{
  "muscle_groups": [
    {"id": 1, "name": "Грудь", "emoji": "🔴"}
  ],
  "exercises": [
    {"id": 11, "muscle_group_id": 1, "name": "Жим лёжа"}
  ]
}
```
