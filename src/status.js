/**
 * Renders the profile status line shown in Pi's footer.
 *
 * The status is `"<label>: <provider>/<modelId>:<thinkingLevel>"`, where the
 * model and thinking level reflect Pi's *current* state rather than the values
 * baked into the profile — so a mid-session `/model` or `/thinking` change is
 * picked up automatically. Returns `undefined` before a profile is selected
 * (or after `clear()`), which callers use to skip rendering entirely.
 */
export function createProfileStatus() {
  let label = null;

  return {
    select(nextLabel) {
      label = typeof nextLabel === 'string' && nextLabel.trim() !== '' ? nextLabel.trim() : null;
    },

    clear() {
      label = null;
    },

    label() {
      return label;
    },

    render(model, level) {
      if (!label || !model) return undefined;
      return `${label}: ${model.provider}/${model.id}:${level}`;
    },
  };
}
