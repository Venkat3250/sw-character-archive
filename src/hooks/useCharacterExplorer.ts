import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  getAllFilms,
  getAllPeople,
  getAllPlanets,
  getAllSpecies,
  getPeoplePage,
  toCharacter,
} from '../services/swapiClient';
import type { Character, Option } from '../types/swapi';
import { extractId } from '../utils/formatters';
import { HUMAN_SPECIES_UID } from '../utils/speciesColors';
import { useDebounce } from './useDebounce';

const PAGE_SIZE = 10;

export interface FilterState {
  homeworldId: string;
  filmId: string;
  speciesId: string;
}

const EMPTY_FILTERS: FilterState = { homeworldId: '', filmId: '', speciesId: '' };

export function useCharacterExplorer() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 350);
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

  const [characters, setCharacters] = useState<Character[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [speciesMap, setSpeciesMap] = useState<Map<string, string>>(new Map());
  const [filterOptions, setFilterOptions] = useState<{
    homeworlds: Option[];
    films: Option[];
    species: Option[];
  }>({ homeworlds: [], films: [], species: [] });
  const [metaError, setMetaError] = useState<string | null>(null);

  const fullCacheRef = useRef<Character[] | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const isFiltering = Boolean(debouncedSearch.trim() || filters.homeworldId || filters.filmId || filters.speciesId);

  // Load species / planet / film option lists once, for coloring + filter dropdowns.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [speciesRes, planetsRes, filmsRes] = await Promise.all([
          getAllSpecies(),
          getAllPlanets(),
          getAllFilms(),
        ]);
        if (cancelled) return;

        const map = new Map<string, string>();
        speciesRes.results.forEach((r) => map.set(r.uid, r.properties.name));
        setSpeciesMap(map);

        setFilterOptions({
          homeworlds: planetsRes.results
            .map((r) => ({ id: r.uid, name: r.properties.name }))
            .sort((a, b) => a.name.localeCompare(b.name)),
          films: filmsRes.results
            .map((r) => ({ id: r.uid, name: r.properties.title }))
            .sort((a, b) => a.name.localeCompare(b.name)),
          species: speciesRes.results
            .map((r) => ({ id: r.uid, name: r.properties.name }))
            .sort((a, b) => a.name.localeCompare(b.name)),
        });
      } catch {
        if (!cancelled) setMetaError('Filter options could not be loaded, but browsing still works.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const load = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      if (!isFiltering) {
        const res = await getPeoplePage(page, PAGE_SIZE, controller.signal);
        setCharacters(res.results.map((r) => toCharacter(r.uid, r.properties)));
        setTotalPages(Math.max(1, res.total_pages));
        setTotalRecords(res.total_records);
      } else {
        if (!fullCacheRef.current) {
          const res = await getAllPeople(controller.signal);
          fullCacheRef.current = res.results.map((r) => toCharacter(r.uid, r.properties));
        }
        let list = fullCacheRef.current;

        const q = debouncedSearch.trim().toLowerCase();
        if (q) list = list.filter((c) => c.name.toLowerCase().includes(q));
        if (filters.homeworldId) list = list.filter((c) => extractId(c.homeworld) === filters.homeworldId);
        if (filters.filmId) list = list.filter((c) => c.films.some((f) => extractId(f) === filters.filmId));
        if (filters.speciesId) {
          list = list.filter((c) =>
            c.species.length
              ? c.species.some((s) => extractId(s) === filters.speciesId)
              : filters.speciesId === HUMAN_SPECIES_UID
          );
        }

        const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
        const safePage = Math.min(page, pages);
        if (safePage !== page) setPage(safePage);

        const start = (safePage - 1) * PAGE_SIZE;
        setCharacters(list.slice(start, start + PAGE_SIZE));
        setTotalPages(pages);
        setTotalRecords(list.length);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Something went wrong while contacting the archive.');
      setCharacters([]);
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  }, [page, isFiltering, debouncedSearch, filters]);

  useEffect(() => {
    load();
    return () => abortRef.current?.abort();
  }, [load]);

  // Whenever the search term or filters change, jump back to page 1.
  const filterSignature = `${debouncedSearch}|${filters.homeworldId}|${filters.filmId}|${filters.speciesId}`;
  const prevSignatureRef = useRef(filterSignature);
  useEffect(() => {
    if (prevSignatureRef.current !== filterSignature) {
      prevSignatureRef.current = filterSignature;
      setPage(1);
    }
  }, [filterSignature]);

  const clearFilters = useCallback(() => {
    setSearchInput('');
    setFilters(EMPTY_FILTERS);
  }, []);

  const speciesNameFor = useMemo(
    () => (character: Character) => {
      const firstSpeciesUid = character.species.length ? extractId(character.species[0]) : HUMAN_SPECIES_UID;
      return speciesMap.get(firstSpeciesUid) ?? (character.species.length ? 'Unknown species' : 'Human');
    },
    [speciesMap]
  );

  return {
    characters,
    page,
    setPage,
    totalPages,
    totalRecords,
    loading,
    error,
    retry: load,
    searchInput,
    setSearchInput,
    filters,
    setFilters,
    clearFilters,
    isFiltering,
    filterOptions,
    metaError,
    speciesNameFor,
  };
}
