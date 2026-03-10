import { useEffect, useMemo, useState } from 'react';

import { SearchPanel } from './components/SearchPanel';
import { WorkoutDetailView } from './components/WorkoutDetail';
import { WorkoutList } from './components/WorkoutList';
import { authWebApp, fetchFilters, fetchWorkoutDetail, fetchWorkouts, searchWorkouts } from './lib/api';
import type { FiltersResponse, WorkoutDetail, WorkoutListItem } from './lib/types';

type TelegramWebAppWindow = Window & {
  Telegram?: {
    WebApp?: {
      initData?: string;
      ready?: () => void;
      expand?: () => void;
      MainButton?: {
        hide?: () => void;
      };
    };
  };
};

type ViewMode = 'history' | 'search' | 'detail';

export function App(): JSX.Element {
  const [token, setToken] = useState<string>('');
  const [initDataInput, setInitDataInput] = useState<string>('');
  const [workouts, setWorkouts] = useState<WorkoutListItem[]>([]);
  const [searchItems, setSearchItems] = useState<WorkoutListItem[]>([]);
  const [detail, setDetail] = useState<WorkoutDetail | null>(null);
  const [filters, setFilters] = useState<FiltersResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [historyTotal, setHistoryTotal] = useState<number>(0);
  const [view, setView] = useState<ViewMode>('history');

  const hasToken = useMemo(() => Boolean(token), [token]);

  useEffect(() => {
    const tgWindow = window as TelegramWebAppWindow;
    tgWindow.Telegram?.WebApp?.ready?.();
    tgWindow.Telegram?.WebApp?.expand?.();
    tgWindow.Telegram?.WebApp?.MainButton?.hide?.();

    const savedToken = window.localStorage.getItem('mini_app_access_token');
    if (savedToken) {
      setToken(savedToken);
    }

    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const tgWebAppData =
      searchParams.get('tgWebAppData') || hashParams.get('tgWebAppData') || '';
    const initDataFromUrl = tgWebAppData ? decodeURIComponent(tgWebAppData) : '';

    const tryAuth = (initData: string) => {
      setLoading(true);
      authWebApp(initData)
        .then((auth) => {
          setToken(auth.access_token);
          window.localStorage.setItem('mini_app_access_token', auth.access_token);
        })
        .catch((e: Error) => setError(e.message))
        .finally(() => setLoading(false));
    };

    const initData = tgWindow.Telegram?.WebApp?.initData || initDataFromUrl;
    if (initData) {
      tryAuth(initData);
      return;
    }

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      const liveInitData = tgWindow.Telegram?.WebApp?.initData || '';
      if (liveInitData) {
        window.clearInterval(timer);
        tryAuth(liveInitData);
      } else if (attempts >= 10) {
        window.clearInterval(timer);
      }
    }, 300);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!hasToken) return;
    setLoading(true);
    Promise.all([fetchWorkouts(token), fetchFilters(token)])
      .then(([workoutsResp, filtersResp]) => {
        setWorkouts(workoutsResp.items);
        setSearchItems([]);
        setFilters(filtersResp);
        setHistoryTotal(workoutsResp.total);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [hasToken, token]);

  const handleManualAuth = async (): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const auth = await authWebApp(initDataInput);
      setToken(auth.access_token);
      window.localStorage.setItem('mini_app_access_token', auth.access_token);
      setInitDataInput('');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const openWorkout = async (id: number): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const payload = await fetchWorkoutDetail(token, id);
      setDetail(payload);
      setView('detail');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const runSearch = async (params: {
    muscleGroupId?: number;
    exerciseId?: number;
    periodMonths?: number;
  }): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const payload = await searchWorkouts(token, params);
      setSearchItems(payload.items);
      setDetail(null);
      setView('search');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const resetToHistory = async (): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchWorkouts(token);
      setWorkouts(res.items);
      setSearchItems([]);
      setDetail(null);
      setView('history');
      setHistoryTotal(res.total);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreHistory = async (): Promise<void> => {
    if (loadingMore) return;
    setLoadingMore(true);
    setError('');
    try {
      const res = await fetchWorkouts(token, 20, workouts.length);
      setWorkouts((prev) => [...prev, ...res.items]);
      setHistoryTotal(res.total);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <main className="app">
      <header className="header">
        <h1>Workout Mini App</h1>
        <p className="muted">История тренировок, детали и поиск</p>
        {hasToken && (
          <div className="tabs">
            <button className={view === 'history' ? 'tab active' : 'tab'} onClick={() => setView('history')}>
              История
            </button>
            <button className={view === 'search' ? 'tab active' : 'tab'} onClick={() => setView('search')}>
              Поиск
            </button>
            <button
              className="tab danger"
              onClick={() => {
                window.localStorage.removeItem('mini_app_access_token');
                setToken('');
                setFilters(null);
                setWorkouts([]);
                setSearchItems([]);
                setDetail(null);
                setView('history');
              }}
            >
              Выйти
            </button>
          </div>
        )}
      </header>

      {!hasToken && (
        <section className="panel">
          <h3>Авторизация</h3>
          <p className="muted">Если Mini App открыт не из Telegram, вставь initData вручную:</p>
          <textarea
            value={initDataInput}
            onChange={(e) => setInitDataInput(e.target.value)}
            rows={4}
            placeholder="query-string initData"
          />
          <button onClick={handleManualAuth} disabled={!initDataInput || loading}>
            Получить токен
          </button>
        </section>
      )}

      {hasToken && filters && (
        <>
          <SearchPanel filters={filters} onSearch={runSearch} />
          {view === 'history' && (
            <section className="panel">
              <div className="row between">
                <h3>История</h3>
                <button onClick={resetToHistory}>Обновить</button>
              </div>
              <WorkoutList items={workouts} onOpen={openWorkout} />
              {workouts.length < historyTotal && (
                <button onClick={loadMoreHistory} disabled={loadingMore}>
                  {loadingMore ? 'Загрузка...' : 'Загрузить еще'}
                </button>
              )}
            </section>
          )}

          {view === 'search' && (
            <section className="panel">
              <div className="row between">
                <h3>Результаты поиска</h3>
                <button onClick={resetToHistory}>Сбросить</button>
              </div>
              <WorkoutList items={searchItems} onOpen={openWorkout} />
            </section>
          )}

          {view === 'detail' && detail && (
            <section className="panel">
              <div className="row between">
                <h3>Детали тренировки</h3>
                <button onClick={() => setView(searchItems.length ? 'search' : 'history')}>Назад</button>
              </div>
              <WorkoutDetailView detail={detail} />
            </section>
          )}
        </>
      )}

      {loading && <p className="muted">Загрузка...</p>}
      {error && <p className="error">{error}</p>}
    </main>
  );
}
