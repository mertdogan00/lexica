# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/).

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
