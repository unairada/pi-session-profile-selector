import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const VALID_REASONS = new Set(['startup', 'new', 'resume', 'fork', 'reload']);
const VALID_THINKING_LEVELS = new Set(['off', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max']);

export const DEFAULT_CONFIG = {
  prompt: 'Is this Pi session Personal or Work?',
  askOn: ['startup', 'new'],
  profiles: [
    {
      label: 'Personal',
      provider: 'opencode-go',
      model: 'mimo-v2.6-pro',
      thinkingLevel: 'high',
    },
    {
      label: 'Work',
      provider: 'openai-codex',
      model: 'gpt-5.6-sol',
      thinkingLevel: 'high',
    },
  ],
};

export const PROFILES = DEFAULT_CONFIG.profiles;

export function getProfile(label, profiles = PROFILES) {
  return profiles.find((profile) => profile.label === label);
}

export function shouldPromptForSessionStart(event, askOn = DEFAULT_CONFIG.askOn) {
  return askOn.includes(event?.reason);
}

export async function loadConfig(configPath) {
  try {
    const raw = await readFile(configPath, 'utf8');
    const parsed = JSON.parse(raw);
    const config = normalizeConfig(parsed);
    return { source: 'file', path: configPath, config };
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return { source: 'default', config: DEFAULT_CONFIG, missing: true };
    }
    return { source: 'default', config: DEFAULT_CONFIG, error };
  }
}

export async function saveConfig(configPath, config) {
  const normalized = normalizeConfig(config);
  await mkdir(dirname(configPath), { recursive: true });
  await writeFile(configPath, `${JSON.stringify(normalized, null, 2)}\n`, 'utf8');
}

function normalizeConfig(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Config must be a JSON object.');
  }

  const prompt = input.prompt === undefined ? DEFAULT_CONFIG.prompt : input.prompt;
  if (typeof prompt !== 'string' || prompt.trim() === '') {
    throw new Error('Config prompt must be a non-empty string.');
  }

  const askOn = input.askOn === undefined ? DEFAULT_CONFIG.askOn : input.askOn;
  if (!Array.isArray(askOn) || askOn.length === 0) {
    throw new Error('Config askOn must include at least one session reason.');
  }
  for (const reason of askOn) {
    if (!VALID_REASONS.has(reason)) {
      throw new Error(`Invalid askOn reason: ${reason}`);
    }
  }

  const profiles = input.profiles === undefined ? DEFAULT_CONFIG.profiles : input.profiles;
  if (!Array.isArray(profiles) || profiles.length === 0) {
    throw new Error('Config must include at least one profile.');
  }

  return {
    prompt: prompt.trim(),
    askOn: [...askOn],
    profiles: profiles.map(normalizeProfile),
  };
}

function normalizeProfile(profile, index) {
  if (!profile || typeof profile !== 'object' || Array.isArray(profile)) {
    throw new Error(`Profile ${index + 1} must be an object.`);
  }

  const normalized = {
    label: requireNonEmptyString(profile.label, `Profile ${index + 1} label`),
    provider: requireNonEmptyString(profile.provider, `Profile ${index + 1} provider`),
    model: requireNonEmptyString(profile.model, `Profile ${index + 1} model`),
    thinkingLevel: profile.thinkingLevel ?? 'off',
  };

  if (!VALID_THINKING_LEVELS.has(normalized.thinkingLevel)) {
    throw new Error(`Profile ${index + 1} has invalid thinkingLevel: ${normalized.thinkingLevel}`);
  }

  return normalized;
}

function requireNonEmptyString(value, label) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${label} must be a non-empty string.`);
  }
  return value.trim();
}
