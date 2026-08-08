import type { Option } from '../types/swapi';
import type { FilterState } from '../hooks/useCharacterExplorer';

interface Props {
  searchInput: string;
  onSearchChange: (value: string) => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  options: { homeworlds: Option[]; films: Option[]; species: Option[] };
  onClear: () => void;
  isFiltering: boolean;
  metaError: string | null;
}

export function SearchFilterBar({
  searchInput,
  onSearchChange,
  filters,
  onFiltersChange,
  options,
  onClear,
  isFiltering,
  metaError,
}: Props) {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-6">
      <div className="bg-panel border border-rail rounded-lg p-4 flex flex-col gap-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <label htmlFor="character-search" className="sr-only">
              Search characters by name
            </label>
            <input
              id="character-search"
              value={searchInput}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name…"
              className="focus-ring w-full bg-void border border-rail rounded px-3 py-2 text-ink placeholder:text-muted/60 font-mono text-sm"
            />
          </div>

          <select
            aria-label="Filter by homeworld"
            value={filters.homeworldId}
            onChange={(e) => onFiltersChange({ ...filters, homeworldId: e.target.value })}
            className="focus-ring bg-void border border-rail rounded px-3 py-2 text-sm font-mono text-ink min-w-[9rem]"
          >
            <option value="">All homeworlds</option>
            {options.homeworlds.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by film"
            value={filters.filmId}
            onChange={(e) => onFiltersChange({ ...filters, filmId: e.target.value })}
            className="focus-ring bg-void border border-rail rounded px-3 py-2 text-sm font-mono text-ink min-w-[9rem]"
          >
            <option value="">All films</option>
            {options.films.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by species"
            value={filters.speciesId}
            onChange={(e) => onFiltersChange({ ...filters, speciesId: e.target.value })}
            className="focus-ring bg-void border border-rail rounded px-3 py-2 text-sm font-mono text-ink min-w-[9rem]"
          >
            <option value="">All species</option>
            {options.species.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>

          {isFiltering && (
            <button
              onClick={onClear}
              className="focus-ring border border-rail rounded px-3 py-2 text-xs font-mono uppercase tracking-wider text-muted hover:text-amber hover:border-amber transition-colors whitespace-nowrap"
            >
              Clear all
            </button>
          )}
        </div>

        {metaError && <p className="text-xs text-amber/80 font-mono">{metaError}</p>}
      </div>
    </div>
  );
}
