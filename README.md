# Character Archive — Star Wars Character Explorer

A React + TypeScript app that browses, searches, filters, and inspects Star Wars
characters via a public API, built as a "records terminal" — a data-archive
UI where each character card is color-coded by species and opens into a
dossier-style modal on click.

> Rename this repo to `tsx-mern-<date_of_submission>` before you push (e.g. `tsx-mern-05Aug2026`), per the assignment's submission instructions.

## Live demo & video

- Hosted app: https://sw-character-archive.vercel.app/
- Walkthrough video: ???

## Screenshots
```
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/9f142b71-68ab-4140-bbf8-3273755fe265" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/fc4f9103-2def-4f3c-8abf-4fe0eee4e857" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/22243b82-0318-47bb-a71e-e9c9bc721aba" />

```

## Features

- **Character grid** from the `/people` endpoint with genuine **server-side pagination** (10 per page).
- **Loading skeletons**, and an **error state with retry** if the API is unreachable.
- A **random Picsum portrait** per character, seeded per browser session — refresh the page and every card gets a new picture.
- Cards are **color-coded by species** (with a legend) and have a **hover scan animation**.
- Clicking a card opens a **details modal**: name, height (m), mass (kg), birth year, date added to the archive (`dd-MM-yyyy`), and film-appearance count — plus a live-fetched **homeworld** panel (name, climate, terrain, residents).
- **Search by name** (partial, case-insensitive) and **filter by homeworld, film, or species**, combinable with each other and with the search box.
- **Mocked JWT authentication** with a login screen and **silent access-token refresh** (see below).
- **Tests**: unit tests for the formatting helpers, plus an integration test that opens a character card and verifies the modal renders that character's correct details, including the async homeworld fetch.

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run test      # run the test suite once
npm run build     # type-check + production build
npm run preview   # preview the production build locally
```

Node 18+ is recommended.

## Architecture notes

### API

Data comes from **[swapi.tech](https://www.swapi.tech/api)**, the actively
maintained SWAPI mirror (the original `swapi.dev`/`swapi.co` mirrors have a
history of going offline). Every list request uses `?expanded=true` so list
responses already carry full record properties, not just `{ uid, name, url }`.
The base URL lives in one place, `src/services/swapiClient.ts`, so pointing
the app at a different SWAPI-compatible mirror is a one-line change.

### Pagination strategy

- **Default browsing** hits `GET /people?page=N&limit=10&expanded=true` directly — real server-side paging, matching the assignment's "the API has paging" requirement.
- **Search/filtering** (brownie points) needs to match across the *whole* roster by name, homeworld, film, or species at once, which the API doesn't support as a single combined query. So the first time a search or filter is used, the app fetches the full ~80-character roster once (`limit=200`), caches it in memory, and filters/paginates it client-side (still 10 per page, same UI). Clearing all filters returns to plain server-side paging. This is documented in `useCharacterExplorer.ts`.
- Filter dropdown options (all homeworlds/films/species) are loaded once on mount, independent of the character list.

### "Amount of residents"

The homeworld panel shows this as **Residents**, backed by the planet's
`population` field (SWAPI's standard "how many people live here" figure).

### Species colors

`utils/speciesColors.ts` curates colors for the species that show up often
(Human, Droid, Wookiee, etc.) and deterministically hashes any other species
name to a color from a fallback palette, so every species gets a stable,
distinct color even without a hand-picked entry. Characters with no listed
species default to Human, matching SWAPI's own convention.

### Mocked JWT auth with silent refresh

`context/AuthContext.tsx` implements login/logout and a full access-token +
refresh-token lifecycle, entirely client-side (`services/mockJwt.ts` builds
structurally-real `header.payload.signature` tokens — there's no real backend
to sign against, since SWAPI needs no auth). On login:

1. An **access token** (45s TTL — short on purpose, so you can *see* it refresh live) and a **refresh token** (15 min TTL) are issued.
2. A timer fires 10 seconds before the access token expires and silently swaps in a new one, no user interaction needed. The header shows a live countdown to the next refresh so this is easy to demo/screen-record.
3. If the refresh token itself has expired, silent refresh fails closed and the user is signed back out.

Demo login: **`padawan` / `usetheforce`** (also shown on the login screen).

### Error handling

All API calls funnel through a single `request()` helper in `swapiClient.ts`
that normalizes network failures and non-2xx responses into a `SwapiError`.
The grid and the homeworld panel each show a scoped error state with a retry
action, so a homeworld hiccup doesn't take down the whole page.

## Testing

```bash
npm run test
```

- `src/test/formatters.test.ts` — unit tests for height/mass/date/population formatting and URL-id extraction.
- `src/test/CharacterModal.test.tsx` — integration test: mocks the API, clicks a rendered character card, and asserts the modal opens with that character's correct name, height, mass, birth year, creation date, film count, and (after it resolves) homeworld data. A second test confirms the modal closes.

## Tech stack

React 18, TypeScript, Vite, Tailwind CSS, Vitest, React Testing Library. No
UI kit — Tailwind tokens are defined in `tailwind.config.js`.

## Deploying

The app is a static Vite build (`npm run build` → `dist/`), so it deploys
as-is to Netlify, Vercel, or Cloudflare Pages with zero configuration:

- **Vercel**: import the repo, framework preset "Vite", defaults are fine.
- **Netlify**: build command `npm run build`, publish directory `dist`.AAAAAAAAAAAAAAAAAAAAAAA
