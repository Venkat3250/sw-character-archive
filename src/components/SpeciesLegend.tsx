import { colorForSpecies } from '../utils/speciesColors';

export function SpeciesLegend({ speciesNames }: { speciesNames: string[] }) {
  if (speciesNames.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5">
      <span className="text-[10px] font-mono uppercase tracking-wider text-muted">Species key:</span>
      {speciesNames.map((name) => (
        <span key={name} className="flex items-center gap-1.5 text-xs font-mono text-muted">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{ backgroundColor: colorForSpecies(name), boxShadow: `0 0 6px ${colorForSpecies(name)}` }}
            aria-hidden="true"
          />
          {name}
        </span>
      ))}
    </div>
  );
}
