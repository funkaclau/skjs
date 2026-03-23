// src/utils/helpers.js

export const addrEq = (a, b) =>
  a && b ? a.toLowerCase() === b.toLowerCase() : false;

export function uniqBy(arr, keyFn) {
  const m = new Map();
  for (const x of arr) m.set(keyFn(x), x);
  return [...m.values()];
}

