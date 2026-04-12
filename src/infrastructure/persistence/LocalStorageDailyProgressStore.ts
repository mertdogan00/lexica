import type { DailyProgressStore } from '../../core/ports/index.ts';

// LocalStorageDailyProgressStore keeps a per-day review counter under
// "lexica_today_<yyyy-mm-dd>" so stale counters from earlier days
// naturally fall out of hot paths without requiring an explicit sweep.

const prefix = 'lexica_today_';

export class LocalStorageDailyProgressStore implements DailyProgressStore {
  getCount(dayYmd: string): number {
    try {
      const raw = localStorage.getItem(prefix + dayYmd);
      if (!raw) return 0;
      const n = parseInt(raw, 10);
      return Number.isFinite(n) ? n : 0;
    } catch {
      return 0;
    }
  }

  increment(dayYmd: string): number {
    const next = this.getCount(dayYmd) + 1;
    try {
      localStorage.setItem(prefix + dayYmd, String(next));
    } catch {
      // Silent swallow; caller should not crash on quota errors.
    }
    return next;
  }

  reset(dayYmd: string): void {
    try {
      localStorage.removeItem(prefix + dayYmd);
    } catch {
      // ignore
    }
  }
}
