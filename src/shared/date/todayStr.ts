// todayStr returns the local calendar date as a yyyy-mm-dd string.
// It is intentionally a thin wrapper so the rest of the codebase never
// touches Date.toISOString().split('T')[0] directly.

export function todayStr(): string {
  return new Date().toISOString().split('T')[0] ?? '';
}
