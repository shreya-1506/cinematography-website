/** Small shared helpers. */

/** Conditional className joiner. */
export function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

/** Clamp a number into a range. */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/** Split a string into words, preserving spacing for masked reveals. */
export function toWords(text) {
  return String(text ?? '')
    .split(/\s+/)
    .filter(Boolean);
}

/** Split a string into individual characters (spaces kept as entries). */
export function toChars(text) {
  return Array.from(String(text ?? ''));
}

/** "2014 – 2026" style range, collapsing when the years match. */
export function yearRange(startYear, endYear = new Date().getFullYear()) {
  return startYear === endYear ? String(endYear) : startYear + ' – ' + endYear;
}

/** Zero-padded index, e.g. 3 -> "03". */
export function pad(number, length = 2) {
  return String(number).padStart(length, '0');
}

/** Look up a category label from the categories config. */
export function categoryLabel(categories, id) {
  const found = categories.find((c) => c.id === id);
  return found ? found.label : id;
}

/** Promise-based delay. */
export function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** True when the current device is most likely touch-primary. */
export function isTouchDevice() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: none), (pointer: coarse)').matches;
}
