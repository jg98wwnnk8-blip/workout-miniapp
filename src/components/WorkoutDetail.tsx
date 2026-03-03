import type { WorkoutDetail } from '../lib/types';

type Props = {
  detail: WorkoutDetail;
};

export function WorkoutDetailView({ detail }: Props): JSX.Element {
  return (
    <div className="detail">
      <h3>{detail.title}</h3>
      <p className="muted">
        {new Date(detail.date_utc).toLocaleString()} · {detail.status}
      </p>
      <p>{detail.comment ?? 'Без комментария к тренировке'}</p>

      {detail.exercises.map((ex) => (
        <div key={ex.workout_exercise_id} className="exercise-block">
          <strong>{ex.exercise_name}</strong>
          <p className="muted">{ex.comment ?? 'Без комментария к упражнению'}</p>
          <ul>
            {ex.sets.map((s) => (
              <li key={s.set_number}>
                Подход {s.set_number}: {s.weight} кг × {s.reps}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
