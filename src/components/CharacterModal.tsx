import { useEffect, useRef, useState } from 'react';
import type { Character, HomeworldInfo } from '../types/swapi';
import { getHomeworld } from '../services/swapiClient';
import { formatBirthYear, formatDateDDMMYYYY, formatHeightMeters, formatMassKg, formatPopulation } from '../utils/formatters';
import { colorForSpecies } from '../utils/speciesColors';

interface Props {
  character: Character;
  speciesName: string;
  onClose: () => void;
}

type HomeworldState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: HomeworldInfo };

export function CharacterModal({ character, speciesName, onClose }: Props) {
  const [homeworld, setHomeworld] = useState<HomeworldState>({ status: 'loading' });
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const color = colorForSpecies(speciesName);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function loadHomeworld() {
      setHomeworld({ status: 'loading' });
      try {
        const data = await getHomeworld(character.homeworld, controller.signal);
        if (!cancelled) setHomeworld({ status: 'ready', data });
      } catch (err) {
        if (cancelled || (err instanceof DOMException && err.name === 'AbortError')) return;
        setHomeworld({
          status: 'error',
          message: err instanceof Error ? err.message : 'Could not load homeworld data.',
        });
      }
    }

    loadHomeworld();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [character.homeworld]);

  useEffect(() => {
    closeButtonRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  function retryHomeworld() {
    setHomeworld({ status: 'loading' });
    getHomeworld(character.homeworld)
      .then((data) => setHomeworld({ status: 'ready', data }))
      .catch((err) =>
        setHomeworld({ status: 'error', message: err instanceof Error ? err.message : 'Could not load homeworld data.' })
      );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="character-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-panel border border-rail rounded-lg overflow-hidden animate-riseIn max-h-[85vh] flex flex-col"
        style={{ boxShadow: `0 0 0 1px ${color}33, 0 20px 60px -12px ${color}44` }}
      >
        <div className="flex items-start justify-between gap-4 p-5 border-b border-rail" style={{ borderTopColor: color }}>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">Character record</p>
            <h2 id="character-modal-title" className="font-display text-xl font-bold text-ink mt-1">
              {character.name}
            </h2>
            <span
              className="inline-block mt-2 text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded"
              style={{ color, backgroundColor: `${color}1a`, border: `1px solid ${color}55` }}
            >
              {speciesName}
            </span>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close character details"
            className="focus-ring shrink-0 text-muted hover:text-ink text-xl leading-none px-2 py-1 rounded hover:bg-rail transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5">
          <dl className="grid grid-cols-2 gap-3 font-mono text-sm">
            <Stat label="Height" value={formatHeightMeters(character.height)} />
            <Stat label="Mass" value={formatMassKg(character.mass)} />
            <Stat label="Birth year" value={formatBirthYear(character.birthYear)} />
            <Stat label="Added to archive" value={formatDateDDMMYYYY(character.created)} />
            <Stat label="Film appearances" value={String(character.films.length)} />
            <Stat label="Gender" value={character.gender || 'Unknown'} />
          </dl>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted mb-2">Homeworld</p>

            {homeworld.status === 'loading' && (
              <div className="flex items-center gap-2 text-muted text-sm py-3" role="status" aria-live="polite">
                <span className="inline-block w-3 h-3 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
                Fetching homeworld record…
              </div>
            )}

            {homeworld.status === 'error' && (
              <div className="text-sm text-rose-300 bg-rose-950/20 border border-rose-900/40 rounded p-3 flex items-center justify-between gap-3">
                <span>{homeworld.message}</span>
                <button
                  onClick={retryHomeworld}
                  className="focus-ring shrink-0 border border-rose-800 rounded px-2 py-1 text-xs font-mono hover:bg-rose-900/30"
                >
                  Retry
                </button>
              </div>
            )}

            {homeworld.status === 'ready' && (
              <dl className="grid grid-cols-2 gap-3 font-mono text-sm bg-void/60 border border-rail rounded p-3">
                <Stat label="Name" value={homeworld.data.name} />
                <Stat label="Climate" value={homeworld.data.climate} />
                <Stat label="Terrain" value={homeworld.data.terrain} />
                <Stat label="Residents" value={formatPopulation(homeworld.data.population)} />
              </dl>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-muted">{label}</dt>
      <dd className="text-ink mt-0.5">{value}</dd>
    </div>
  );
}
