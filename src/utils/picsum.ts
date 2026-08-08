/**
 * Builds a Picsum URL seeded per-character-per-session, so every card gets a
 * stable picture while browsing, and a fresh set appears after a page refresh
 * (a new session seed is generated on each app load).
 */
export function characterImageUrl(uid: string, sessionSeed: string, width = 400, height = 520): string {
  const seed = encodeURIComponent(`${uid}-${sessionSeed}`);
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

export function createSessionSeed(): string {
  return Math.random().toString(36).slice(2, 10);
}
