export const THINKING_LEVELS = ['off', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max'];

export function formatModelChoice(model) {
  return `${model.provider}/${model.id}`;
}

export function modelChoices(models) {
  return models.map(formatModelChoice).sort((a, b) => a.localeCompare(b));
}

export function parseModelChoice(choice) {
  const slash = choice.indexOf('/');
  if (slash === -1) return undefined;
  return {
    provider: choice.slice(0, slash),
    model: choice.slice(slash + 1),
  };
}
