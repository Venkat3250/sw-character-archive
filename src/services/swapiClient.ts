import type {
  Character,
  FilmProperties,
  HomeworldInfo,
  PersonProperties,
  PlanetProperties,
  SpeciesProperties,
  SwapiDetailResponse,
  SwapiListResponse,
} from '../types/swapi';
import { SwapiError } from '../types/swapi';

const BASE_URL = 'https://www.swapi.tech/api';

/** Force https so a deployed (https) site never triggers mixed-content blocks. */
export function normalizeSwapiUrl(url: string): string {
  return url.replace(/^http:\/\//i, 'https://');
}

async function request<T>(url: string, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(normalizeSwapiUrl(url), { signal });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err;
    throw new SwapiError('Could not reach the archive. The server may be down or your connection dropped.');
  }

  if (!response.ok) {
    throw new SwapiError(`The archive responded with an error (status ${response.status}).`, response.status);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new SwapiError('The archive sent back a response we could not read.');
  }
}

export function getPeoplePage(page: number, limit = 10, signal?: AbortSignal) {
  return request<SwapiListResponse<PersonProperties>>(
    `${BASE_URL}/people/?page=${page}&limit=${limit}&expanded=true`,
    signal
  );
}

/** Fetches the full roster in one shot (used only once search/filter mode kicks in). */
export function getAllPeople(signal?: AbortSignal) {
  return request<SwapiListResponse<PersonProperties>>(
    `${BASE_URL}/people/?page=1&limit=200&expanded=true`,
    signal
  );
}

export function getAllPlanets(signal?: AbortSignal) {
  return request<SwapiListResponse<PlanetProperties>>(
    `${BASE_URL}/planets/?page=1&limit=200&expanded=true`,
    signal
  );
}

export function getAllFilms(signal?: AbortSignal) {
  return request<SwapiListResponse<FilmProperties>>(
    `${BASE_URL}/films/?page=1&limit=200&expanded=true`,
    signal
  );
}

export function getAllSpecies(signal?: AbortSignal) {
  return request<SwapiListResponse<SpeciesProperties>>(
    `${BASE_URL}/species/?page=1&limit=200&expanded=true`,
    signal
  );
}

export async function getHomeworld(url: string, signal?: AbortSignal): Promise<HomeworldInfo> {
  const res = await request<SwapiDetailResponse<PlanetProperties>>(url, signal);
  const p = res.result.properties;
  return { name: p.name, climate: p.climate, terrain: p.terrain, population: p.population };
}

export function toCharacter(uid: string, p: PersonProperties): Character {
  return {
    uid,
    name: p.name,
    height: p.height,
    mass: p.mass,
    birthYear: p.birth_year,
    gender: p.gender,
    homeworld: p.homeworld,
    films: p.films ?? [],
    species: p.species ?? [],
    created: p.created,
    url: p.url,
  };
}
