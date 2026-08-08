export function formatHeightMeters(heightCm: string): string {
  const n = Number(heightCm);
  if (!heightCm || Number.isNaN(n)) return 'Unknown';
  return `${(n / 100).toFixed(2)} m`;
}

export function formatMassKg(mass: string): string {
  if (!mass || mass.toLowerCase() === 'unknown') return 'Unknown';
  const n = Number(mass.replace(/,/g, ''));
  if (Number.isNaN(n)) return 'Unknown';
  return `${n.toLocaleString('en-US')} kg`;
}

/** SWAPI's `created` field, e.g. 2014-12-09T13:50:51.644Z -> dd-MM-yyyy */
export function formatDateDDMMYYYY(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'Unknown';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export function formatPopulation(pop?: string): string {
  if (!pop || pop.toLowerCase() === 'unknown') return 'Unknown';
  const n = Number(pop.replace(/,/g, ''));
  if (Number.isNaN(n)) return pop;
  return n.toLocaleString('en-US');
}

export function formatBirthYear(birthYear: string): string {
  if (!birthYear || birthYear.toLowerCase() === 'unknown') return 'Unknown';
  return birthYear;
}

/** Pulls the trailing numeric id off any SWAPI resource URL. */
export function extractId(url: string): string {
  const match = url.match(/(\d+)\/?$/);
  return match ? match[1] : url;
}
