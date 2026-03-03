import type { WorkoutListItem } from '../lib/types';

type Props = {
  items: WorkoutListItem[];
  onOpen: (id: number) => void;
};

export function WorkoutList({ items, onOpen }: Props): JSX.Element {
  if (!items.length) return <p>Нет завершённых тренировок.</p>;

  return (
    <div className="card-list">
      {items.map((item) => (
        <button key={item.id} className="card" onClick={() => onOpen(item.id)}>
          <div className="row between">
            <strong>{item.title}</strong>
            <span>{new Date(item.date_utc).toLocaleDateString()}</span>
          </div>
          <div className="muted">{item.comment ?? 'Без комментариев'}</div>
          <div className="row between small">
            <span>{item.exercise_count} упражнений</span>
            <span>{item.total_volume.toFixed(1)} кг объём</span>
          </div>
        </button>
      ))}
    </div>
  );
}
