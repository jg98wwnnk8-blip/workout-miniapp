import { useMemo, useState } from 'react';
import type { FiltersResponse } from '../lib/types';

type Props = {
  filters: FiltersResponse;
  onSearch: (input: {
    muscleGroupId?: number;
    exerciseId?: number;
    periodMonths?: number;
  }) => void;
};

export function SearchPanel({ filters, onSearch }: Props): JSX.Element {
  const [muscleGroupId, setMuscleGroupId] = useState<number | ''>('');
  const [exerciseId, setExerciseId] = useState<number | ''>('');
  const [periodMonths, setPeriodMonths] = useState<number | ''>('');

  const exerciseOptions = useMemo(() => {
    if (!muscleGroupId) return filters.exercises;
    return filters.exercises.filter((e) => e.muscle_group_id === muscleGroupId);
  }, [filters.exercises, muscleGroupId]);

  return (
    <div className="panel">
      <h4>Поиск</h4>
      <div className="row gap">
        <select
          value={muscleGroupId}
          onChange={(e) => {
            const v = e.target.value ? Number(e.target.value) : '';
            setMuscleGroupId(v);
            setExerciseId('');
          }}
        >
          <option value="">Все группы</option>
          {filters.muscle_groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.emoji} {g.name}
            </option>
          ))}
        </select>

        <select value={exerciseId} onChange={(e) => setExerciseId(e.target.value ? Number(e.target.value) : '')}>
          <option value="">Все упражнения</option>
          {exerciseOptions.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>

        <select value={periodMonths} onChange={(e) => setPeriodMonths(e.target.value ? Number(e.target.value) : '')}>
          <option value="">Все время</option>
          <option value="1">1 месяц</option>
          <option value="3">3 месяца</option>
          <option value="6">6 месяцев</option>
        </select>

        <button
          onClick={() =>
            onSearch({
              muscleGroupId: muscleGroupId || undefined,
              exerciseId: exerciseId || undefined,
              periodMonths: periodMonths || undefined
            })
          }
        >
          Найти
        </button>
      </div>
    </div>
  );
}
