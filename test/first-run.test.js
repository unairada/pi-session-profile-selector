import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DEFAULT_CONFIG,
  shouldOfferFirstRunSetup,
} from '../src/profiles.js';

const MISSING = { source: 'default', config: DEFAULT_CONFIG, missing: true };
const PRESENT = { source: 'file', config: DEFAULT_CONFIG };

test('shouldOfferFirstRunSetup is true only when config is missing and session is startup or new', () => {
  assert.equal(shouldOfferFirstRunSetup(MISSING, { reason: 'startup' }), true);
  assert.equal(shouldOfferFirstRunSetup(MISSING, { reason: 'new' }), true);
  assert.equal(shouldOfferFirstRunSetup(MISSING, { reason: 'resume' }), false);
  assert.equal(shouldOfferFirstRunSetup(MISSING, { reason: 'fork' }), false);
  assert.equal(shouldOfferFirstRunSetup(MISSING, { reason: 'reload' }), false);
});

test('shouldOfferFirstRunSetup is false when a config file exists', () => {
  assert.equal(shouldOfferFirstRunSetup(PRESENT, { reason: 'startup' }), false);
  assert.equal(shouldOfferFirstRunSetup(PRESENT, { reason: 'new' }), false);
});

test('shouldOfferFirstRunSetup is false when config load failed with an error', () => {
  const errored = { source: 'default', config: DEFAULT_CONFIG, error: new Error('boom') };
  assert.equal(shouldOfferFirstRunSetup(errored, { reason: 'startup' }), false);
});
