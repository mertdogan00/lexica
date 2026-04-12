// genId produces a compact, sort-stable, collision-resistant id for a
// new Word or avatar seed. It uses the current millisecond timestamp as
// a prefix so ids from the same session sort naturally, plus a short
// random suffix to disambiguate two ids created in the same millisecond.

export function genId(): string {
  const timePart = Date.now().toString(36);
  const randomPart = Math.random().toString(36).slice(2, 7);
  return timePart + randomPart;
}
