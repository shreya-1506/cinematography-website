/**
 * Deep merge used to layer content overrides on top of the authored defaults.
 *
 * Rules, chosen so the admin editor behaves predictably:
 *   - plain objects merge key by key
 *   - arrays REPLACE wholesale (the editor owns the whole list, including order
 *     and deletions, so merging by index would resurrect removed entries)
 *   - `undefined` in the override means "not set", so the default survives
 *   - `null` is a real value and clears the default
 */

export function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function deepMerge(base, override) {
  if (override === undefined) return base;
  if (!isPlainObject(base) || !isPlainObject(override)) return override;

  const out = { ...base };
  for (const key of Object.keys(override)) {
    const next = override[key];
    if (next === undefined) continue;
    out[key] = isPlainObject(base[key]) && isPlainObject(next) ? deepMerge(base[key], next) : next;
  }
  return out;
}

/** Structural clone that survives older browsers without structuredClone. */
export function clone(value) {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value);
    } catch {
      /* fall through to JSON */
    }
  }
  return JSON.parse(JSON.stringify(value));
}

/**
 * The inverse of merge: keep only what actually differs from the defaults, so a
 * saved content.json stays small and future default changes still flow through.
 */
export function diffAgainst(defaults, current) {
  if (!isPlainObject(defaults) || !isPlainObject(current)) {
    return JSON.stringify(defaults) === JSON.stringify(current) ? undefined : current;
  }

  const out = {};
  let changed = false;

  for (const key of Object.keys(current)) {
    const a = defaults[key];
    const b = current[key];
    if (isPlainObject(a) && isPlainObject(b)) {
      const nested = diffAgainst(a, b);
      if (nested !== undefined) {
        out[key] = nested;
        changed = true;
      }
    } else if (JSON.stringify(a) !== JSON.stringify(b)) {
      out[key] = b;
      changed = true;
    }
  }

  // Keys the editor removed entirely
  for (const key of Object.keys(defaults)) {
    if (!(key in current)) {
      out[key] = null;
      changed = true;
    }
  }

  return changed ? out : undefined;
}
