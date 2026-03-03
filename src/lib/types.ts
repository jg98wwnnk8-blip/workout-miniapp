export type WorkoutListItem = {
  id: number;
  title: string;
  date_utc: string;
  comment: string | null;
  exercise_count: number;
  total_volume: number;
};

export type WorkoutListResponse = {
  items: WorkoutListItem[];
  total: number;
  limit: number;
  offset: number;
};

export type SetRow = {
  set_number: number;
  weight: number;
  reps: number;
};

export type WorkoutExercise = {
  workout_exercise_id: number;
  exercise_id: number;
  exercise_name: string;
  comment: string | null;
  sets: SetRow[];
};

export type WorkoutDetail = {
  id: number;
  title: string;
  date_utc: string;
  comment: string | null;
  status: string;
  exercises: WorkoutExercise[];
};

export type SearchResponse = {
  items: WorkoutListItem[];
  total: number;
};

export type FiltersResponse = {
  muscle_groups: Array<{ id: number; name: string; emoji: string }>;
  exercises: Array<{ id: number; muscle_group_id: number; name: string }>;
};
