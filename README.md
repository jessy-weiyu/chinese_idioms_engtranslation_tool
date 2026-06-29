# Chinese Idioms English Translation Tool

A Chinese idiom translation website built with Next.js 15, TypeScript, Tailwind CSS, and ShadCN-style UI components.

The site helps users search Chinese idioms, review English translations, copy results, save favorites, and keep local search history. It uses a static PETCI-based idiom translation dataset and can enrich Chinese explanations, pinyin, sources, synonyms, antonyms, and examples through a third-party Chinese idiom dictionary API.

## Live Site

https://jessy-weiyu.github.io/chinese_idioms_engtranslation_tool/

## Features

- Chinese idiom search with English translation results
- English phrase search for reverse idiom matching
- Literal translation, literary translation, and equivalent proverb sections
- Optional Chinese dictionary details from a third-party API
- Local search history stored in `localStorage`
- Local favorites stored in `localStorage`
- Copy-to-clipboard actions for translation content
- Light and dark theme support
- Responsive layout for mobile and desktop
- Static export support for GitHub Pages deployment

## Tech Stack

- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS
- ShadCN-style reusable UI primitives
- Sonner toast notifications
- GitHub Actions and GitHub Pages

## Data Source

The English idiom translation data is prepared from PETCI:

https://github.com/kenantang/petci

The build script converts the source JSON file into:

```text
public/data/idioms.json
```

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local `.env` file:

```bash
NEXT_PUBLIC_CHENGYU_API_ID=your_api_id
NEXT_PUBLIC_CHENGYU_API_KEY=your_api_key
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run lint
```

Runs the Next.js lint check.

```bash
npm run prepare:data
```

Generates the public idiom dataset from the PETCI source data.

```bash
npm run build
```

Prepares the idiom dataset and builds the static site.

## GitHub Pages Deployment

This project is configured for GitHub Pages under the repository path:

```text
/chinese_idioms_engtranslation_tool
```

The workflow file is:

```text
.github/workflows/deploy.yml
```

For production deployment, set these repository secrets:

```text
NEXT_PUBLIC_CHENGYU_API_ID
NEXT_PUBLIC_CHENGYU_API_KEY
```

The site is deployed automatically when changes are pushed to the `main` branch.

## Project Structure

```text
app/                  Next.js App Router pages and global styles
components/           Shared UI, layout, idiom, history, and favorite components
lib/api/              Third-party API request wrapper
lib/search/           Idiom search and translation helpers
lib/storage/          localStorage helpers for history and favorites
public/data/          Generated static idiom dataset
scripts/              Data preparation scripts
types/                Shared TypeScript types
```

## Notes

This is a static frontend application. Values prefixed with `NEXT_PUBLIC_` are exposed to the browser bundle during build time. For stricter API key protection, move the dictionary API call behind a server-side proxy or backend service.
