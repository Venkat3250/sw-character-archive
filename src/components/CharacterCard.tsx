import type { Character } from '../types/swapi';
import { characterImageUrl } from '../utils/picsum';
import { colorForSpecies } from '../utils/speciesColors';

interface Props {
  character: Character;
  speciesName: string;
  sessionSeed: string;
  onOpen: (character: Character) => void;
}

export function CharacterCard({ character, speciesName, sessionSeed, onOpen }: Props) {
  const color = colorForSpecies(speciesName);
  const imageUrl = characterImageUrl(character.uid, sessionSeed);

  return (
    <button
      onClick={() => onOpen(character)}
      className="focus-ring group relative text-left bg-panel border border-rail rounded-lg overflow-hidden transition-transform duration-200 hover:-translate-y-1"
      style={{ boxShadow: `0 0 0 1px ${color}22` }}
      aria-haspopup="dialog"
    >
      <span
        className="absolute left-0 top-0 bottom-0 w-1 z-10"
        style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}` }}
        aria-hidden="true"
      />

      <div className="relative aspect-[4/5] overflow-hidden bg-void">
        <img
          src={imageUrl}
          alt={`Portrait for ${character.name}`}
          loading="lazy"
          className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
        />
        <div
          className="pointer-events-none absolute inset-x-0 h-1/3 opacity-0 group-hover:opacity-100 group-hover:animate-scan transition-opacity"
          style={{ background: `linear-gradient(to bottom, transparent, ${color}55, transparent)` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/10 to-transparent" />
      </div>

      <div className="p-3 pl-4">
        <h3 className="font-display font-semibold text-sm text-ink truncate">{character.name}</h3>
        <span
          className="inline-block mt-1 text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded"
          style={{ color, backgroundColor: `${color}1a`, border: `1px solid ${color}55` }}
        >
          {speciesName}
        </span>
      </div>
    </button>
  );
}
