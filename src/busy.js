// Tiny global "something is loading" counter. Wrap any promise in track() and the top loading bar shows until it settles.
let count = 0;
const subs = new Set();
const emit = () => subs.forEach((f) => f(count));
export function track(promise) {
  count += 1; emit();
  return Promise.resolve(promise).finally(() => { count = Math.max(0, count - 1); emit(); });
}
export function subscribe(fn) { subs.add(fn); fn(count); return () => subs.delete(fn); }
