import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';
import { CharacterExplorer } from '../components/CharacterExplorer';

const lukeProperties = {
  name: 'Luke Skywalker',
  height: '172',
  mass: '77',
  hair_color: 'blond',
  skin_color: 'fair',
  eye_color: 'blue',
  birth_year: '19BBY',
  gender: 'male',
  homeworld: 'https://www.swapi.tech/api/planets/1/',
  films: ['https://www.swapi.tech/api/films/1/'],
  species: [] as string[],
  vehicles: [] as string[],
  starships: [] as string[],
  url: 'https://www.swapi.tech/api/people/1/',
  created: '2014-12-09T13:50:51.644000Z',
  edited: '2014-12-20T21:17:56.891000Z',
};

const tatooineProperties = {
  name: 'Tatooine',
  climate: 'arid',
  terrain: 'desert',
  population: '200000',
  diameter: '10465',
  gravity: '1 standard',
  orbital_period: '304',
  rotation_period: '23',
  surface_water: '1',
  residents: [] as string[],
  films: [] as string[],
  url: 'https://www.swapi.tech/api/planets/1/',
  created: '2014-12-09T13:50:49.641000Z',
  edited: '2014-12-20T20:58:18.411000Z',
};

function jsonResponse(body: unknown): Promise<Response> {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(body),
  } as Response);
}

function mockFetchImpl(input: RequestInfo | URL): Promise<Response> {
  const url = input.toString();

  if (url.includes('/species/') && url.includes('limit=')) {
    return jsonResponse({
      message: 'ok',
      total_records: 1,
      total_pages: 1,
      previous: null,
      next: null,
      results: [
        {
          uid: '1',
          properties: { name: 'Human', classification: 'mammal', language: 'Galactic Basic', url: 'https://www.swapi.tech/api/species/1/' },
        },
      ],
    });
  }

  if (url.includes('/planets/') && url.includes('limit=')) {
    return jsonResponse({
      message: 'ok',
      total_records: 1,
      total_pages: 1,
      previous: null,
      next: null,
      results: [{ uid: '1', properties: tatooineProperties }],
    });
  }

  if (url.includes('/films/') && url.includes('limit=')) {
    return jsonResponse({
      message: 'ok',
      total_records: 1,
      total_pages: 1,
      previous: null,
      next: null,
      results: [
        {
          uid: '1',
          properties: {
            title: 'A New Hope',
            episode_id: 4,
            director: 'George Lucas',
            release_date: '1977-05-25',
            url: 'https://www.swapi.tech/api/films/1/',
          },
        },
      ],
    });
  }

  if (url.includes('/people/') && url.includes('page=')) {
    return jsonResponse({
      message: 'ok',
      total_records: 1,
      total_pages: 1,
      previous: null,
      next: null,
      results: [{ uid: '1', properties: lukeProperties }],
    });
  }

  if (/\/planets\/1\/?$/.test(url)) {
    return jsonResponse({
      message: 'ok',
      result: { uid: '1', _id: 'planet-1', description: 'A planet', properties: tatooineProperties },
    });
  }

  return Promise.reject(new Error(`Unhandled fetch call in test: ${url}`));
}

describe('CharacterModal integration', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(mockFetchImpl));
  });

  it('opens with the correct person information when their card is clicked', async () => {
    render(
      <AuthProvider>
        <CharacterExplorer />
      </AuthProvider>
    );

    const card = await screen.findByRole('button', { name: /Luke Skywalker/i });
    fireEvent.click(card);

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: 'Luke Skywalker' })).toBeInTheDocument();

    // Person stats, correctly formatted.
    expect(within(dialog).getByText('1.72 m')).toBeInTheDocument(); // height in meters
    expect(within(dialog).getByText('77 kg')).toBeInTheDocument(); // mass in kg
    expect(within(dialog).getByText('19BBY')).toBeInTheDocument(); // birth year
    expect(within(dialog).getByText('09-12-2014')).toBeInTheDocument(); // created, dd-MM-yyyy

    const filmsRow = within(dialog).getByText('Film appearances');
    expect(filmsRow.nextElementSibling).toHaveTextContent('1');

    // Homeworld is fetched asynchronously after the modal opens and rendered once it resolves.
    await waitFor(() => expect(within(dialog).getByText('Tatooine')).toBeInTheDocument());
    expect(within(dialog).getByText('arid')).toBeInTheDocument();
    expect(within(dialog).getByText('desert')).toBeInTheDocument();
    expect(within(dialog).getByText('200,000')).toBeInTheDocument();
  });

  it('closes the modal when the close button is clicked', async () => {
    render(
      <AuthProvider>
        <CharacterExplorer />
      </AuthProvider>
    );

    const card = await screen.findByRole('button', { name: /Luke Skywalker/i });
    fireEvent.click(card);
    await screen.findByRole('dialog');

    fireEvent.click(screen.getByRole('button', { name: /close character details/i }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});
