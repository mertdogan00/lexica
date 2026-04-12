// DailyProgressStore tracks how many reviews the user has completed on a
// given calendar day. It is deliberately separate from GamificationStore
// so that a hotfix to the XP system doesn't risk the goal bar's state.

export interface DailyProgressStore {
  getCount(dayYmd: string): number;
  increment(dayYmd: string): number;
  reset(dayYmd: string): void;
}
