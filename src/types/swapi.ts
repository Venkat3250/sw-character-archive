/**
 * Types for swapi.tech (the actively-maintained SWAPI mirror).
 * We always request `expanded=true` on list routes so `results[].properties`
 * carries the full record instead of just { uid, name, url }.
 */

export interface SwapiListResponse<TProps> {
  message: string;
  total_records: number;
  total_pages: number;
  previous: string | null;
  next: string | null;
  results: Array<{
    properties: TProps;
    _id?: string;
    uid: string;
    description?: string;
  }>;
}

export interface SwapiDetailResponse<TProps> {
  message: string;
  result: {
    properties: TProps;
    description: string;
    uid: string;
    _id: string;
  };
}

export interface PersonProperties {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  url: string;
  created: string;
  edited: string;
}

export interface PlanetProperties {
  name: string;
  climate: string;
  terrain: string;
  population: string;
  diameter: string;
  gravity: string;
  orbital_period: string;
  rotation_period: string;
  surface_water: string;
  residents: string[];
  films: string[];
  url: string;
  created: string;
  edited: string;
}

export interface FilmProperties {
  title: string;
  episode_id: number;
  director: string;
  release_date: string;
  url: string;
}

export interface SpeciesProperties {
  name: string;
  classification: string;
  language: string;
  url: string;
}

/** Flattened, UI-friendly shape used throughout the app. */
export interface Character {
  uid: string;
  name: string;
  height: string;
  mass: string;
  birthYear: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  created: string;
  url: string;
}

export interface Option {
  id: string;
  name: string;
}

export interface HomeworldInfo {
  name: string;
  climate: string;
  terrain: string;
  population: string;
}

export class SwapiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'SwapiError';
    this.status = status;
  }
}
