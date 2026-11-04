# CHANGELOG.md

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial documentation system (AGENTS.md, CLAUDE.md, README.md, ARCHITECTURE.md, TODO.md, CHANGELOG.md)
- Claude Code rules (.claude/rules/html.md, .claude/rules/css.md, .claude/rules/javascript.md)
- Claude Code settings (.claude/settings.json)
- Git ignore configuration (.gitignore)
- **Electric Violet design system** — New brand identity with centralized design tokens in `css/variables.css`
- **Base project structure** — `index.html`, CSS foundation (`variables.css`, `main.css`, `components.css`), JS foundation (`main.js`, `utils/dom.js`, `utils/events.js`)
- **Core components** — Button, Card (ProductCard, FeatureCard), Modal with confirm/alert helpers in `js/components/`
- **Favicon assets** — favicon.svg, apple-touch-icon.svg, manifest.json, generate-favicons.html

### Changed
- **Deprecated orange branding** (`#BF4408`, `#E65103`, `#2563eb`, `#1d4ed8`) replaced with Electric Violet palette
- Updated all documentation and rules to enforce Electric Violet as the official design system

---

## [1.0.0] - 2026-11-04

### Added
- Project initialization
- Initial README.md with project name

---

## Template for Future Releases

## [X.Y.Z] - YYYY-MM-DD

### Added
- New features

### Changed
- Changes in existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Now removed features

### Fixed
- Bug fixes

### Security
- Vulnerability fixes

---

*Do not fabricate historical changes. Only document actual changes as they happen.*