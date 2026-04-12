import type { Word } from './Word.ts';

// WordFactory owns the contract for creating new Word aggregates.
// Centralising creation keeps the defaults (level, dates, status) in one place
// so application code never has to know the full shape of a fresh Word.

export interface NewWordInput {
  id: string;
  english: string;
  turkish: string;
  exampleSentence: string;
  notes: string;
}

export interface CreateNewWordContext {
  // ISO-8601 timestamp for createdAt/updatedAt — injected so the domain
  // stays free of ambient clock reads.
  nowIso: string;
  // yyyy-mm-dd value used as the initial nextReviewDate so a new word is
  // reviewable on the day it is created.
  todayYmd: string;
}

export function createNewWord(input: NewWordInput, ctx: CreateNewWordContext): Word {
  return {
    id: input.id,
    english: input.english,
    turkish: input.turkish,
    exampleSentence: input.exampleSentence,
    notes: input.notes,
    level: 0,
    intervalDays: 0,
    repetitionCount: 0,
    status: 'new',
    createdAt: ctx.nowIso,
    updatedAt: ctx.nowIso,
    lastReviewedAt: null,
    nextReviewDate: ctx.todayYmd,
  };
}
