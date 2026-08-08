/**
 * SWAPI leaves `species` empty for most Human characters, so callers should
 * fall back to species uid "1" (Human) when a character's species array is empty.
 */
export const HUMAN_SPECIES_UID = '1';

const CURATED: Record<string, string> = {
  human: '#4FD6E8',
  droid: '#E8A33D',
  wookiee: '#C97B4A',
  rodian: '#7ED957',
  hutt: '#D9576B',
  "twi'lek": '#B98BE0',
  ewok: '#D2A857',
  gungan: '#6FBF73',
  'mon calamari': '#F08A6C',
  trandoshan: '#9DBF4B',
  zabrak: '#E0576B',
  "yoda's species": '#8FD989',
  neimodian: '#8FBF6A',
  kaminoan: '#7FA9C9',
  unknown: '#5A6270',
};

const FALLBACK_PALETTE = ['#4FD6E8', '#E8A33D', '#7ED957', '#B98BE0', '#D9576B', '#C97B4A', '#6FBF73', '#F08A6C'];

/** Deterministic color for any species name, curated first, hashed fallback otherwise. */
export function colorForSpecies(name: string | null | undefined): string {
  const key = (name ?? 'unknown').trim().toLowerCase();
  if (CURATED[key]) return CURATED[key];
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return FALLBACK_PALETTE[hash % FALLBACK_PALETTE.length];
}
