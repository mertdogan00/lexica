import { useCallback, useMemo, useState } from 'react';
import type { IntervalPreview, LearningMode, ReviewQuality, Word } from '../../domain/index.ts';
import { previewIntervals, scheduleNext } from '../../domain/index.ts';
import { todayStr } from '../../../shared/index.ts';
import { useContainer } from '../di/index.ts';
import { useSettings } from '../settings/index.ts';
import { useWordLibrary } from '../words/index.ts';
import { useGamification } from '../gamification/index.ts';

// useReviewSession models a single review session as an in-memory
// finite state machine: a queue of words, a current index, a revealed
// flag, and accumulated session stats. The queue is built once at
// startSession() from the current library snapshot so new words added
// mid-session don't disrupt pacing.

export type CardFace = 'english' | 'turkish';

export interface ReviewCardView {
  word: Word;
  frontFace: CardFace;
  backFace: CardFace;
  frontText: string;
  backText: string;
  intervals: IntervalPreview;
}

export interface ReviewSessionStats {
  again: number;
  hard: number;
  good: number;
  easy: number;
  mixedCount: number;
}

export interface AnswerResult {
  sessionComplete: boolean;
  dailyCount: number;
}

export interface ReviewSessionApi {
  queueSize: number;
  currentIndex: number;
  currentCard: ReviewCardView | null;
  revealed: boolean;
  stats: ReviewSessionStats;
  dailyCount: number;
  hasSession: boolean;
  startSession: () => void;
  reveal: () => void;
  answer: (quality: ReviewQuality) => Promise<AnswerResult>;
  endSession: () => void;
}

interface InternalSlot {
  word: Word;
  frontFace: CardFace;
}

function pickFrontFace(mode: LearningMode): CardFace {
  if (mode === 'en_to_tr') return 'english';
  if (mode === 'tr_to_en') return 'turkish';
  return Math.random() > 0.5 ? 'english' : 'turkish';
}

function buildQueue(words: readonly Word[], mode: LearningMode): InternalSlot[] {
  const today = todayStr();
  const overdue = words.filter((w) => w.nextReviewDate !== null && w.nextReviewDate < today);
  const todayWords = words.filter((w) => w.nextReviewDate === today);
  const sortedOverdue = [...overdue].sort((a, b) =>
    (a.nextReviewDate ?? '').localeCompare(b.nextReviewDate ?? ''),
  );
  const merged = [...sortedOverdue, ...todayWords];
  return merged.map((word) => ({ word, frontFace: pickFrontFace(mode) }));
}

const EMPTY_STATS: ReviewSessionStats = {
  again: 0,
  hard: 0,
  good: 0,
  easy: 0,
  mixedCount: 0,
};

export function useReviewSession(): ReviewSessionApi {
  const container = useContainer();
  const { settings } = useSettings();
  const { words, putRaw } = useWordLibrary();
  const { recordReview, recordSessionEnd } = useGamification();

  const [queue, setQueue] = useState<InternalSlot[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [stats, setStats] = useState<ReviewSessionStats>(EMPTY_STATS);
  const [hasSession, setHasSession] = useState<boolean>(false);
  const [dailyCount, setDailyCount] = useState<number>(() =>
    container.dailyProgressStore.getCount(todayStr()),
  );

  const startSession = useCallback((): void => {
    const next = buildQueue(words, settings.mode);
    setQueue(next);
    setCurrentIndex(0);
    setRevealed(false);
    setStats(EMPTY_STATS);
    setHasSession(true);
    setDailyCount(container.dailyProgressStore.getCount(todayStr()));
  }, [words, settings.mode, container]);

  const reveal = useCallback((): void => {
    setRevealed(true);
  }, []);

  const endSession = useCallback((): void => {
    setHasSession(false);
    setQueue([]);
    setCurrentIndex(0);
    setRevealed(false);
    setStats(EMPTY_STATS);
  }, []);

  const answer = useCallback(
    async (quality: ReviewQuality): Promise<AnswerResult> => {
      const slot = queue[currentIndex];
      if (!slot) return { sessionComplete: true, dailyCount };

      const now = new Date().toISOString();
      const updated = scheduleNext(slot.word, quality, settings.system, { nowIso: now });
      await putRaw(updated);

      const isMixed = settings.mode === 'mixed';
      const nextStats: ReviewSessionStats = {
        ...stats,
        [quality]: stats[quality] + 1,
        mixedCount: isMixed ? stats.mixedCount + 1 : stats.mixedCount,
      };
      setStats(nextStats);

      const today = todayStr();
      const nextDaily = container.dailyProgressStore.increment(today);
      setDailyCount(nextDaily);

      // Record the review with the gamification layer using the word
      // library as it stands right now. We pass the library rather than
      // the newly-updated slot so badge evaluation sees the current
      // mastered count including the word we just scheduled.
      const newWords = words.map((w) => (w.id === updated.id ? updated : w));
      recordReview(quality, newWords);

      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setRevealed(false);

      const sessionComplete = nextIndex >= queue.length;
      if (sessionComplete) {
        recordSessionEnd({
          words: newWords,
          dailyGoal: settings.goal,
          dailyCount: nextDaily,
          sessionAgainCount: nextStats.again,
          sessionMixedCount: nextStats.mixedCount,
        });
      }

      return { sessionComplete, dailyCount: nextDaily };
    },
    [
      queue,
      currentIndex,
      dailyCount,
      stats,
      settings.system,
      settings.mode,
      settings.goal,
      container,
      putRaw,
      words,
      recordReview,
      recordSessionEnd,
    ],
  );

  const currentCard = useMemo<ReviewCardView | null>(() => {
    const slot = queue[currentIndex];
    if (!slot) return null;
    const frontFace = slot.frontFace;
    const backFace: CardFace = frontFace === 'english' ? 'turkish' : 'english';
    const frontText = frontFace === 'english' ? slot.word.english : slot.word.turkish;
    const backText = backFace === 'english' ? slot.word.english : slot.word.turkish;
    return {
      word: slot.word,
      frontFace,
      backFace,
      frontText,
      backText,
      intervals: previewIntervals(slot.word, settings.system),
    };
  }, [queue, currentIndex, settings.system]);

  return {
    queueSize: queue.length,
    currentIndex,
    currentCard,
    revealed,
    stats,
    dailyCount,
    hasSession,
    startSession,
    reveal,
    answer,
    endSession,
  };
}
