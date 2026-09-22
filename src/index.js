import { homedir } from 'node:os';
import { join } from 'node:path';

import {
  DEFAULT_CONFIG,
  getProfile,
  loadConfig,
  saveConfig,
  shouldOfferFirstRunSetup,
  shouldPromptForSessionStart,
} from './profiles.js';
import { THINKING_LEVELS, modelChoices, parseModelChoice } from './wizard.js';

const STATUS_KEY = 'session-profile';
const CONFIG_PATH = join(homedir(), '.pi', 'agent', 'session-profiles.json');

/**
 * @param {import('@earendil-works/pi-coding-agent').ExtensionAPI} pi
 */
export default function sessionProfileSelector(pi) {
  pi.on('session_start', async (event, ctx) => {
    const loaded = await loadConfig(CONFIG_PATH);
    const active = await resolveConfigForSession(loaded, ctx, event);
    if (!active) return;

    const { prompt, askOn, profiles } = active;

    if (!shouldPromptForSessionStart(event, askOn)) return;

    if (!ctx.hasUI) {
      return;
    }

    const choice = await ctx.ui.select(
      prompt,
      profiles.map((profile) => profile.label),
    );

    if (!choice) {
      ctx.ui.notify('No session profile selected; keeping the current model.', 'warning');
      return;
    }

    const profile = getProfile(choice, profiles);
    if (!profile) {
      ctx.ui.notify(`Unknown session profile: ${choice}`, 'error');
      return;
    }

    const model = ctx.modelRegistry.find(profile.provider, profile.model);
    if (!model) {
      ctx.ui.notify(
        `Could not find model ${profile.provider}/${profile.model}. Check /model or run pi update --models.`,
        'error',
      );
      return;
    }

    const selected = await pi.setModel(model);
    if (!selected) {
      ctx.ui.notify(
        `No authentication is configured for ${profile.provider}/${profile.model}. Run /login for ${profile.provider}.`,
        'error',
      );
      return;
    }

    pi.setThinkingLevel(profile.thinkingLevel);
    ctx.ui.setStatus(STATUS_KEY, `${profile.label}: ${profile.provider}/${profile.model}:${profile.thinkingLevel}`);
    ctx.ui.notify(
      `${profile.label} session: ${profile.provider}/${profile.model} with ${profile.thinkingLevel} thinking.`,
      'info',
    );
  });
}

async function resolveConfigForSession(loaded, ctx, event) {
  if (loaded.error && ctx.hasUI) {
    ctx.ui.notify(
      `Could not load ${CONFIG_PATH}: ${loaded.error.message}. Using built-in session profiles.`,
      'warning',
    );
    return loaded.config;
  }

  if (!shouldOfferFirstRunSetup(loaded, event) || !ctx.hasUI) {
    return loaded.config;
  }

  const action = await ctx.ui.select(
    'No session profiles are configured yet. Set them up now?',
    ['Configure profiles', 'Use built-in defaults', 'Skip for now'],
  );

  if (action === 'Use built-in defaults') {
    await persistConfig(ctx, DEFAULT_CONFIG);
    return DEFAULT_CONFIG;
  }

  if (action === 'Configure profiles') {
    const config = await runSetupWizard(ctx);
    if (!config) {
      ctx.ui.notify('Session profile setup cancelled; keeping the current model.', 'warning');
      return undefined;
    }

    await persistConfig(ctx, config);
    return config;
  }

  ctx.ui.notify('Session profile setup skipped; keeping the current model.', 'warning');
  return undefined;
}

async function persistConfig(ctx, config) {
  try {
    await saveConfig(CONFIG_PATH, config);
    ctx.ui.notify(`Saved session profiles to ${CONFIG_PATH}.`, 'info');
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    ctx.ui.notify(
      `Could not save ${CONFIG_PATH}: ${message}. Using these profiles for this session only.`,
      'error',
    );
    return false;
  }
}

async function runSetupWizard(ctx) {
  const models = ctx.modelRegistry.getAll();
  const choices = modelChoices(models);
  if (choices.length === 0) {
    ctx.ui.notify('No models are available in Pi yet. Run pi update --models or configure a provider first.', 'error');
    return undefined;
  }

  const personal = await askForProfile(ctx, 'Personal', choices);
  if (!personal) return undefined;

  const work = await askForProfile(ctx, 'Work', choices);
  if (!work) return undefined;

  return {
    prompt: 'What kind of session is this?',
    askOn: ['startup', 'new'],
    profiles: [personal, work],
  };
}

async function askForProfile(ctx, defaultLabel, choices) {
  const labelInput = await ctx.ui.input(
    `${defaultLabel} profile label`,
    `Press Enter for "${defaultLabel}" or type a custom label`,
  );
  if (labelInput === undefined) return undefined;
  const label = labelInput.trim() || defaultLabel;

  const modelChoice = await ctx.ui.select(`Model for ${label}`, choices);
  if (!modelChoice) return undefined;

  const parsed = parseModelChoice(modelChoice);
  if (!parsed) {
    ctx.ui.notify(`Invalid model choice: ${modelChoice}`, 'error');
    return undefined;
  }

  const thinkingLevel = await ctx.ui.select(`Thinking level for ${label}`, THINKING_LEVELS);
  if (!thinkingLevel) return undefined;

  return {
    label,
    provider: parsed.provider,
    model: parsed.model,
    thinkingLevel,
  };
}
