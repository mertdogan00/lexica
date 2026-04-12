import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type {
  BadgeEvaluationContext,
  BadgeId,
  GamificationState,
  LevelState,
  ReviewQuality,
  Word,
} from '../../domain/index.ts';
import {
  XP_DAILY_GOAL_BONUS,
  XP_PERFECT_DAY_BONUS,
  bumpStreak,
  checkBadgeUnlocks,
  levelFromXp,
  xpForReview,
} from '../../domain/index.ts';
import { fireConfetti, todayStr } from '../../../shared/index.ts';
import { useContainer } from '../di/index.ts';

// useGamification is the application-layer orchestrator for XP, levels,
// streaks and badges. It owns the reactive gamification state, persists
// every mutation, and fires confetti on level-ups and perfect days.
//
// The shape is intentionally event-driven: the review flow calls
// recordReview() after each answer and recordSessionEnd() when the
// session finishes. The hook takes care of streak rollover, goal bonus,
// perfect-day bonus, and badge evaluation so none of that logic leaks
// into presentation code.

export interface RecordReviewResult {
  xpGained: number;
  leveledUp: boolean;
  newBadges: readonly BadgeId[];
}

export interface SessionEndInput {
  words: readonly Word[];
  dailyGoal: number;
  dailyCount: number;
  sessionAgainCount: number;
  sessionMixedCount: number;
}

export interface SessionEndResult {
  xpGained: number;
  leveledUp: boolean;
  newBadges: readonly BadgeId[];
  perfectDay: boolean;
  goalReached: boolean;
}

export interface GamificationApi {
  state: GamificationState;
  levelState: LevelState;
  recordReview: (quality: ReviewQuality, words: readonly Word[]) => RecordReviewResult;
  recordSessionEnd: (input: SessionEndInput) => SessionEndResult;
  unlockedBadgeSet: ReadonlySet<BadgeId>;
  reset: () => void;
}

const GamificationContext = createContext<GamificationApi | null>(null);

export function GamificationProvider({ children }: { children: ReactNode }): ReactNode {
  const container = useContainer();
  const [state, setState] = useState<GamificationState>(() => container.gamificationStore.load());

  const persist = useCallback(
    (next: GamificationState): void => {
      container.gamificationStore.save(next);
      setState(next);
    },
    [container],
  );

  const recordReview = useCallback(
    (quality: ReviewQuality, words: readonly Word[]): RecordReviewResult => {
      const xpGained = xpForReview(quality);
      const today = todayStr();
      const previousLevel = levelFromXp(state.xp).level;

      const nextState: GamificationState = {
        ...state,
        xp: state.xp + xpGained,
        streak: bumpStreak(state.streak, today),
      };

      const newLevel = levelFromXp(nextState.xp).level;
      const leveledUp = newLevel > previousLevel;

      const badgeCtx: BadgeEvaluationContext = {
        words,
        totalReviews: 1,
        mixedModeReviews: 0,
        perfectDayAwardedToday: false,
      };
      const newBadges = checkBadgeUnlocks(nextState, badgeCtx);
      const stateWithBadges: GamificationState = {
        ...nextState,
        unlockedBadges: newBadges.length
          ? [...nextState.unlockedBadges, ...newBadges]
          : nextState.unlockedBadges,
      };

      persist(stateWithBadges);

      if (leveledUp) fireConfetti('level_up');

      return { xpGained, leveledUp, newBadges };
    },
    [state, persist],
  );

  const recordSessionEnd = useCallback(
    (input: SessionEndInput): SessionEndResult => {
      const today = todayStr();
      const goalReached =
        input.dailyCount >= input.dailyGoal &&
        state.lastGoalBonusDay !== today &&
        input.dailyGoal > 0;

      const perfectDay =
        goalReached && input.sessionAgainCount === 0 && state.lastPerfectDay !== today;

      let xpGained = 0;
      let bonusState: GamificationState = state;

      if (goalReached) {
        xpGained += XP_DAILY_GOAL_BONUS;
        bonusState = {
          ...bonusState,
          xp: bonusState.xp + XP_DAILY_GOAL_BONUS,
          lastGoalBonusDay: today,
        };
      }
      if (perfectDay) {
        xpGained += XP_PERFECT_DAY_BONUS;
        bonusState = {
          ...bonusState,
          xp: bonusState.xp + XP_PERFECT_DAY_BONUS,
          lastPerfectDay: today,
        };
      }

      const previousLevel = levelFromXp(state.xp).level;
      const newLevel = levelFromXp(bonusState.xp).level;
      const leveledUp = newLevel > previousLevel;

      const badgeCtx: BadgeEvaluationContext = {
        words: input.words,
        totalReviews: input.dailyCount,
        mixedModeReviews: input.sessionMixedCount,
        perfectDayAwardedToday: perfectDay,
      };
      const newBadges = checkBadgeUnlocks(bonusState, badgeCtx);
      const finalState: GamificationState = {
        ...bonusState,
        unlockedBadges: newBadges.length
          ? [...bonusState.unlockedBadges, ...newBadges]
          : bonusState.unlockedBadges,
      };

      persist(finalState);

      if (perfectDay) fireConfetti('perfect_day');
      else if (leveledUp) fireConfetti('level_up');

      return { xpGained, leveledUp, newBadges, perfectDay, goalReached };
    },
    [state, persist],
  );

  const reset = useCallback((): void => {
    const fresh: GamificationState = {
      xp: 0,
      streak: { current: 0, best: 0, lastActiveDay: null },
      unlockedBadges: [],
      lastGoalBonusDay: null,
      lastPerfectDay: null,
    };
    persist(fresh);
  }, [persist]);

  const levelState = useMemo(() => levelFromXp(state.xp), [state.xp]);
  const unlockedBadgeSet = useMemo(() => new Set(state.unlockedBadges), [state.unlockedBadges]);

  const api = useMemo<GamificationApi>(
    () => ({ state, levelState, recordReview, recordSessionEnd, unlockedBadgeSet, reset }),
    [state, levelState, recordReview, recordSessionEnd, unlockedBadgeSet, reset],
  );

  return <GamificationContext.Provider value={api}>{children}</GamificationContext.Provider>;
}

export function useGamification(): GamificationApi {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error('useGamification must be called inside <GamificationProvider>');
  return ctx;
}
