# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- The default `Work` profile now uses `openai-codex/gpt-6-sol` instead of `openai-codex/gpt-5.6-sol`.

## [0.1.2] - 2026-09-23

### Added

- The footer status now tracks Pi's live state: switching model (`/model`, `Ctrl+P`) or thinking level (`/thinking`) mid-session updates the status line to match, keeping the profile label.

### Fixed

- The status line and startup notification now report the *effective* thinking level (after Pi clamps it to the model's capabilities) instead of the requested level.

## [0.1.1] - 2026-09-22

### Added

- `pi.image` metadata so the Pi package gallery renders a preview from the README screenshot.
- A "Scope" section in the README spelling out what the package does and does not do.
- npm and CI badges in the README.

### Fixed

- `repository.url` now uses the `git+https://` form instead of `git+ssh://`, matching the format the Pi package gallery can turn into a clickable `[repo]` link.

### Changed

- `pi install npm:pi-session-profile-selector` is now the recommended install path in the README, with the git URL documented as an alternative.

## [0.1.0] - 2026-09-22

### Added

- Session profile picker on Pi startup and `/new`.
- First-run setup wizard when `~/.pi/agent/session-profiles.json` is missing.
- Optional JSON config at `~/.pi/agent/session-profiles.json` for prompt text, `askOn` reasons, and custom profile labels/models/thinking levels.
- Built-in defaults: `Personal` → `opencode-go/mimo-v2.6-pro` (high) and `Work` → `openai-codex/gpt-5.6-sol` (high).
- Fallback to built-in defaults with a warning when the config file is invalid.
- Graceful fallback when a config file cannot be written (profiles apply to the current session only).
- Screenshot in README showing the profile picker.
- `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1) and `SECURITY.md`.
- GitHub issue templates (bug report, feature request) and a pull-request template.
- CI workflow running the test suite and `npm pack --dry-run` across Node 20/22/24.
- Published to npm as `pi-session-profile-selector`.

[Unreleased]: https://github.com/unairada/pi-session-profile-selector/compare/v0.1.2...HEAD
[0.1.2]: https://github.com/unairada/pi-session-profile-selector/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/unairada/pi-session-profile-selector/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/unairada/pi-session-profile-selector/releases/tag/v0.1.0
