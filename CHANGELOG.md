# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.2] - 2026-04-12

### Fixed

- Settings picker modals (learning mode, repetition system, daily goal, theme, language) now update the selected highlight immediately on tap
- Avatar picker preview and selected style highlight now stay in sync when switching styles or shuffling

### Changed

- Extracted `SettingsPickerModal` and `AvatarPickerModal` components that read settings via hooks internally, replacing stale-closure inline JSX

## [1.0.1] - 2026-04-12

### Added

- Route-level code splitting with React.lazy and Suspense fallback
- Loading fallback component and styling for lazy page transitions
- Browser language detection for default UI language on first load

### Changed

- Raised Vite chunk size warning limit to 1.5 MB
- Organized lazy-load helpers under `presentation/pages/Lazy` and loading UI under `presentation/pages/Loading`

## [1.0.0] - 2026-04-12

### Added

- Initial Lexica port from the `work/index.html` / `temp/index.html` prototype
- Clean Architecture layering (domain, application, ports, infrastructure,
  presentation, bootstrap) with barrel-first imports
- Gamification domain (XP, levels, streaks, badges) with pure-function core
- Onboarding flow: user name capture, DiceBear avatar picker, SRS preset,
  daily goal, and learning mode
- Dashboard with greeting, daily goal bar, review stats, streak and XP card,
  and quick actions
- Words page with search, status filters, add/edit/delete modals
- Review flow with flashcard reveal, four-quality answer buttons, and
  confetti on perfect days
- Settings page with learning, appearance, data, and profile sections
- Bilingual UI (Turkish / English), light / dark / auto theme, animation
  toggle, and JSON import / export (overwrite + merge)
- IndexedDB word repository and localStorage adapters for settings,
  daily progress, and gamification state
- Modern split CSS under `src/styles/*` using `@layer`, `color-mix()`,
  `oklch()`, native nesting, and `@property`
