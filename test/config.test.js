import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import {
  DEFAULT_CONFIG,
  loadConfig,
  shouldPromptForSessionStart,
} from '../src/profiles.js';

async function withTempDir(fn) {
  const dir = await mkdtemp(join(tmpdir(), 'pi-session-profiles-'));
  try {
    return await fn(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

test('loadConfig returns defaults when config file is missing', async () => {
  await withTempDir(async (dir) => {
    const result = await loadConfig(join(dir, 'missing.json'));

    assert.equal(result.source, 'default');
    assert.deepEqual(result.config, DEFAULT_CONFIG);
  });
});

test('loadConfig uses custom prompt, askOn, and profiles from config file', async () => {
  await withTempDir(async (dir) => {
    const path = join(dir, 'session-profiles.json');
    await writeFile(path, JSON.stringify({
      prompt: 'Pick your context',
      askOn: ['new'],
      profiles: [
        {
          label: 'Research',
          provider: 'openrouter',
          model: 'perplexity/sonar',
          thinkingLevel: 'medium',
        },
      ],
    }), 'utf8');

    const result = await loadConfig(path);

    assert.equal(result.source, 'file');
    assert.equal(result.path, path);
    assert.deepEqual(result.config, {
      prompt: 'Pick your context',
      askOn: ['new'],
      profiles: [
        {
          label: 'Research',
          provider: 'openrouter',
          model: 'perplexity/sonar',
          thinkingLevel: 'medium',
        },
      ],
    });
  });
});

test('loadConfig falls back to defaults with an error for invalid config', async () => {
  await withTempDir(async (dir) => {
    const path = join(dir, 'session-profiles.json');
    await writeFile(path, JSON.stringify({ profiles: [] }), 'utf8');

    const result = await loadConfig(path);

    assert.equal(result.source, 'default');
    assert.match(result.error.message, /at least one profile/i);
    assert.deepEqual(result.config, DEFAULT_CONFIG);
  });
});

test('shouldPromptForSessionStart respects configured askOn reasons', () => {
  assert.equal(shouldPromptForSessionStart({ reason: 'startup' }, ['new']), false);
  assert.equal(shouldPromptForSessionStart({ reason: 'new' }, ['new']), true);
  assert.equal(shouldPromptForSessionStart({ reason: 'resume' }, ['startup', 'new']), false);
});
