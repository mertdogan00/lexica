# Lexica

Mobile-first English vocabulary trainer powered by spaced repetition,
wrapped in a light gamification layer (XP, levels, streaks, badges).

Lexica is open source and designed to be easy to run, fork, and self-host.

## Features

- **Spaced repetition** with three presets (default, intensive, relaxed)
- **Bilingual review** — English→Turkish, Turkish→English, mixed
- **Gamification** — XP per review, level progression, daily streaks,
  unlockable badges, confetti on level-up and perfect days
- **Personalised onboarding** — user name and avatar captured upfront;
  avatar is rendered procedurally via [DiceBear](https://dicebear.com)
- **Offline-first** — IndexedDB for words, localStorage for settings,
  progress, gamification state
- **Dark / light / auto theme** with a manual toggle in the header
- **Bilingual UI** (Turkish / English), live switchable
- **Animation toggle** for reduced-motion preference
- **Import / export** JSON with overwrite and merge modes

## Architecture

Lexica follows a clean, layered frontend architecture:

- **Clean Architecture** layers: `core/domain` ← `core/application`
  ← `presentation` / `infrastructure` ← `bootstrap`
- **Barrel-first** imports — cross-layer access goes through the layer's
  top-level `index.ts`; internal paths are private
- **Dependency Injection** — infrastructure adapters (IndexedDB, localStorage)
  are wired in `bootstrap/container.ts` and passed through React Context;
  application hooks read from context and never import infrastructure directly
- **Pure domain** — SRS scheduling, XP, level, streak, badge logic are all
  pure functions with no framework awareness
- **Split CSS** — design tokens, reset, shell, pages and components each
  live in their own file under `src/styles/`, aggregated through a single
  `styles/index.css` barrel. Modern CSS only (`@layer`, `color-mix()`,
  `oklch()`, native nesting, `@property`, `backdrop-filter`).

## Scripts

```bash
npm install          # install dependencies
npm run dev          # start Vite dev server
npm run lint         # run ESLint
npm run typecheck    # tsc --noEmit (project references)
npm run build:raw    # vite build only
npm run build        # full production build with obfuscation
npm run preview      # serve the production build locally
```

## Getting Started

```bash
git clone https://github.com/mertdogan00/lexica.git
cd lexica
npm install
npm run dev
```

The app is fully local by default: words are stored in IndexedDB and user
preferences are stored in `localStorage`.

## Tech Stack

- React 19 + Vite 8 + TypeScript 5.9
- `react-router-dom` v7
- `lucide-react` for icons
- `@dicebear/core` + `@dicebear/collection` for avatars
- `canvas-confetti` for celebration moments
- `javascript-obfuscator` in the production build pipeline

## Data

- IndexedDB database `LexicaDB` (version 1), store `words`
- localStorage keys:
  - `lexica_settings` — user settings + profile
  - `lexica_gamification` — XP, level, streak, unlocked badges
  - `lexica_today_<yyyy-mm-dd>` — daily review counter

## License

MIT. See the local [LICENSE](./LICENSE) file for details.
