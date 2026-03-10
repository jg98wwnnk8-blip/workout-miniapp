import type {
  FiltersResponse,
  SearchResponse,
  WorkoutDetail,
  WorkoutListResponse
} from './types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

async function http<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status}: ${text}`);
  }
  return (await response.json()) as T;
}

export async function authWebApp(initData: string): Promise<{ access_token: string }> {
  return http('/auth/webapp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initData })
  });
}

export async function fetchWorkouts(
  token: string,
  limit = 20,
  offset = 0
): Promise<WorkoutListResponse> {
  return http(`/workouts?limit=${limit}&offset=${offset}`, {
    method: 'GET',
    headers: authHeaders(token)
  });
}

export async function fetchWorkoutDetail(token: string, workoutId: number): Promise<WorkoutDetail> {
  return http(`/workouts/${workoutId}`, {
    method: 'GET',
    headers: authHeaders(token)
  });
}

export async function fetchFilters(token: string): Promise<FiltersResponse> {
  return http('/filters', {
    method: 'GET',
    headers: authHeaders(token)
  });
}

export async function searchWorkouts(
  token: string,
  params: { muscleGroupId?: number; exerciseId?: number; periodMonths?: number }
): Promise<SearchResponse> {
  const qs = new URLSearchParams();
  if (params.muscleGroupId) qs.set('muscle_group_id', String(params.muscleGroupId));
  if (params.exerciseId) qs.set('exercise_id', String(params.exerciseId));
  if (params.periodMonths) qs.set('period_months', String(params.periodMonths));

  return http(`/workouts/search?${qs.toString()}`, {
    method: 'GET',
    headers: authHeaders(token)
  });
}
