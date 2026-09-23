import test from 'node:test';
import assert from 'node:assert/strict';

import {
  formatModelChoice,
  modelChoices,
} from '../src/wizard.js';

test('formatModelChoice renders provider/model IDs', () => {
  assert.equal(
    formatModelChoice({ provider: 'openai-codex', id: 'gpt-6-sol' }),
    'openai-codex/gpt-6-sol',
  );
});

test('modelChoices sorts provider/model labels', () => {
  const choices = modelChoices([
    { provider: 'z-provider', id: 'b-model' },
    { provider: 'a-provider', id: 'c-model' },
    { provider: 'a-provider', id: 'a-model' },
  ]);

  assert.deepEqual(choices, [
    'a-provider/a-model',
    'a-provider/c-model',
    'z-provider/b-model',
  ]);
});
