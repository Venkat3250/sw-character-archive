import { useMemo, useState } from 'react';
import { useCharacterExplorer } from '../hooks/useCharacterExplorer';
import { createSessionSeed } from '../utils/picsum';
import type { Character } from '../types/swapi';
import { Header } from './Header';
import { SearchFilterBar } from './SearchFilterBar';
import { SpeciesLegend } from './SpeciesLegend';
import { CharacterGrid } from './CharacterGrid';
import { Pagination } from './Pagination';
import { CharacterModal } from './CharacterModal';

export function CharacterExplorer() {
  const {
    characters,
    page,
    setPage,
    totalPages,
    totalRecords,
    loading,
    error,
    retry,
    searchInput,
    setSearchInput,
    filters,
    setFilters,
    clearFilters,
    isFiltering,
    filterOptions,
    metaError,
    speciesNameFor,
  } = useCharacterExplorer();

  const [selected, setSelected] = useState<Character | null>(null);
  const [sessionSeed] = useState(createSessionSeed);

  const visibleSpeciesNames = useMemo(
    () => Array.from(new Set(characters.map((c) => speciesNameFor(c)))).sort(),
    [characters, speciesNameFor]
  );

  return (
    <div className="min-h-screen pb-16">
      <Header />

      <SearchFilterBar
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        filters={filters}
        onFiltersChange={setFilters}
        options={filterOptions}
        onClear={clearFilters}
        isFiltering={isFiltering}
        metaError={metaError}
      />

      <SpeciesLegend speciesNames={visibleSpeciesNames} />

      <main className="max-w-6xl mx-auto px-4 mt-4">
        <CharacterGrid
          characters={characters}
          loading={loading}
          error={error}
          onRetry={retry}
          onOpen={setSelected}
          speciesNameFor={speciesNameFor}
          sessionSeed={sessionSeed}
        />

        <Pagination page={page} totalPages={totalPages} totalRecords={totalRecords} onChange={setPage} disabled={loading} />
      </main>

      {selected && (
        <CharacterModal character={selected} speciesName={speciesNameFor(selected)} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
