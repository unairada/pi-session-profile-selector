import test from 'node:test';
import assert from 'node:assert/strict';

import { createProfileStatus } from '../src/status.js';

const MIMO = { provider: 'opencode-go', id: 'mimo-v2.6-pro' };
const GPT = { provider: 'openai-codex', id: 'gpt-5.6-sol' };

test('profile status is empty before a profile is selected', () => {
  const status = createProfileStatus();

  assert.equal(status.render(MIMO, 'high'), undefined);
});

test('profile status shows the label with the profile default model and level', () => {
  const status = createProfileStatus();
  status.select('Personal');

  assert.equal(status.render(MIMO, 'high'), 'Personal: opencode-go/mimo-v2.6-pro:high');
});

test('profile status follows a mid-session model change, keeping the profile label', () => {
  const status = createProfileStatus();
  status.select('Personal');

  assert.equal(
    status.render(GPT, 'high'),
    'Personal: openai-codex/gpt-5.6-sol:high',
    'status should show the new model, not the profile default',
  );
});

test('profile status follows a mid-session thinking level change', () => {
  const status = createProfileStatus();
  status.select('Work');

  assert.equal(
    status.render(GPT, 'low'),
    'Work: openai-codex/gpt-5.6-sol:low',
    'status should show the effective level, not the profile default',
  );
});

test('profile status is empty after being cleared', () => {
  const status = createProfileStatus();
  status.select('Personal');
  status.clear();

  assert.equal(status.render(MIMO, 'high'), undefined);
});
