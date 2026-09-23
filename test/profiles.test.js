import test from 'node:test';
import assert from 'node:assert/strict';

import {
  PROFILES,
  getProfile,
  shouldPromptForSessionStart,
} from '../src/profiles.js';

test('personal profile uses opencode-go mimo on high thinking', () => {
  assert.deepEqual(getProfile('Personal'), {
    label: 'Personal',
    provider: 'opencode-go',
    model: 'mimo-v2.6-pro',
    thinkingLevel: 'high',
  });
});

test('work profile uses OpenAI Codex gpt-6-sol on high thinking', () => {
  assert.deepEqual(getProfile('Work'), {
    label: 'Work',
    provider: 'openai-codex',
    model: 'gpt-6-sol',
    thinkingLevel: 'high',
  });
});

test('profiles expose concise labels for the startup picker', () => {
  assert.deepEqual(PROFILES.map((profile) => profile.label), ['Personal', 'Work']);
});

test('startup picker appears only for startup and new sessions', () => {
  assert.equal(shouldPromptForSessionStart({ reason: 'startup' }), true);
  assert.equal(shouldPromptForSessionStart({ reason: 'new' }), true);
  assert.equal(shouldPromptForSessionStart({ reason: 'resume' }), false);
  assert.equal(shouldPromptForSessionStart({ reason: 'fork' }), false);
  assert.equal(shouldPromptForSessionStart({ reason: 'reload' }), false);
});
