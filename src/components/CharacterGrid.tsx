import type { Character } from '../types/swapi';
import { CharacterCard } from './CharacterCard';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';

interface Props {
  characters: Character[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onOpen: (character: Character) => void;
  speciesNameFor: (character: Character) => string;
  sessionSeed: string;
}

export function CharacterGrid({ characters, loading, error, onRetry, onOpen, speciesNameFor, sessionSeed }: Props) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (characters.length === 0) return <EmptyState />;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {characters.map((character) => (
        <CharacterCard
          key={character.uid}
          character={character}
          speciesName={speciesNameFor(character)}
          sessionSeed={sessionSeed}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}
