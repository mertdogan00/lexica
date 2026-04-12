// LearningMode picks which side of the flashcard the learner sees first.
// "mixed" randomly flips the direction per card so both retrieval
// directions are practiced in the same session.

export type LearningMode = 'en_to_tr' | 'tr_to_en' | 'mixed';

export const LEARNING_MODES: readonly LearningMode[] = ['en_to_tr', 'tr_to_en', 'mixed'];
