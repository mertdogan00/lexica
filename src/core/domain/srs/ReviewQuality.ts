// ReviewQuality models the four buttons the learner taps after revealing a
// flashcard. The order below matches the visual order in the review actions.

export type ReviewQuality = 'again' | 'hard' | 'good' | 'easy';

export const REVIEW_QUALITIES: readonly ReviewQuality[] = ['again', 'hard', 'good', 'easy'];
