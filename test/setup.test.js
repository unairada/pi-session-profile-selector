import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import {
  DEFAULT_CONFIG,
  loadConfig,
  saveConfig,
} from '../src/profiles.js';

async function withTempDir(fn) {
  const dir = await mkdtemp(join(tmpdir(), 'pi-session-setup-'));
  try {
    return await fn(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

test('saveConfig writes readable JSON that loadConfig can read', async () => {
  await withTempDir(async (dir) => {
    const path = join(dir, 'nested', 'session-profiles.json');

    await saveConfig(path, DEFAULT_CONFIG);

    const raw = await readFile(path, 'utf8');
    assert.equal(raw.endsWith('\n'), true);
    assert.deepEqual(JSON.parse(raw), DEFAULT_CONFIG);

    const loaded = await loadConfig(path);
    assert.equal(loaded.source, 'file');
    assert.deepEqual(loaded.config, DEFAULT_CONFIG);
  });
});

test('loadConfig reports missing config separately from invalid config', async () => {
  await withTempDir(async (dir) => {
    const result = await loadConfig(join(dir, 'missing.json'));

    assert.equal(result.source, 'default');
    assert.equal(result.missing, true);
    assert.equal(result.error, undefined);
  });
});
