# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-09-21

### Added

- Session profile picker on Pi startup and `/new`.
- First-run setup wizard when `~/.pi/agent/session-profiles.json` is missing.
- Optional JSON config at `~/.pi/agent/session-profiles.json` for prompt text, `askOn` reasons, and custom profile labels/models/thinking levels.
- Built-in defaults: `Personal` → `opencode-go/mimo-v2.6-pro` (high) and `Work` → `openai-codex/gpt-5.6-sol` (high).
- Fallback to built-in defaults with a warning when the config file is invalid.
- Graceful fallback when a config file cannot be written (profiles apply to the current session only).

[Unreleased]: https://github.com/unairada/pi-session-profile-selector/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/unairada/pi-session-profile-selector/releases/tag/v0.1.0
