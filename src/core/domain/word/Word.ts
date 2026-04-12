// Word is the central aggregate of the Lexica domain.
// A Word carries its own SRS state (level, interval, next review date)
// alongside the learning content and a status derived from the SRS level.

export type WordStatus = 'new' | 'learning' | 'mastered';

export interface Word {
  id: string;
  english: string;
  turkish: string;
  exampleSentence: string;
  notes: string;
  // SRS level is an index into the active preset's interval table.
  level: number;
  // Most recently scheduled interval in days — kept for display and auditing.
  intervalDays: number;
  // Number of times the user has answered this card during review.
  repetitionCount: number;
  status: WordStatus;
  // ISO-8601 timestamp (date + time).
  createdAt: string;
  updatedAt: string;
  // ISO-8601 timestamp or null before the first review.
  lastReviewedAt: string | null;
  // yyyy-mm-dd (date only) or null when never scheduled.
  nextReviewDate: string | null;
}
