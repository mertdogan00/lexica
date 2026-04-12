// Badges are one-shot achievements. Each badge has a stable id, a
// translation key pair for title and description, an icon name from
// lucide-react, and a predicate that decides whether the badge should
// unlock given the current gamification and library state.
//
// Unlock predicates are intentionally pure so the application layer can
// re-run them after any state change and receive a deterministic list of
// badges that need to flash to the user.

export type BadgeId =
  | 'first_word'
  | 'first_review'
  | 'words_10'
  | 'words_50'
  | 'words_100'
  | 'mastered_5'
  | 'mastered_25'
  | 'streak_3'
  | 'streak_7'
  | 'streak_30'
  | 'level_5'
  | 'level_10'
  | 'perfect_day'
  | 'polyglot';

export interface BadgeDefinition {
  id: BadgeId;
  titleKey: string;
  descKey: string;
  icon: string;
  tone: 'green' | 'yellow' | 'red' | 'blue' | 'purple';
}

export const BADGES: readonly BadgeDefinition[] = [
  {
    id: 'first_word',
    titleKey: 'badge_first_word',
    descKey: 'badge_first_word_desc',
    icon: 'BookPlus',
    tone: 'green',
  },
  {
    id: 'first_review',
    titleKey: 'badge_first_review',
    descKey: 'badge_first_review_desc',
    icon: 'Sparkles',
    tone: 'yellow',
  },
  {
    id: 'words_10',
    titleKey: 'badge_words_10',
    descKey: 'badge_words_10_desc',
    icon: 'Library',
    tone: 'green',
  },
  {
    id: 'words_50',
    titleKey: 'badge_words_50',
    descKey: 'badge_words_50_desc',
    icon: 'Library',
    tone: 'blue',
  },
  {
    id: 'words_100',
    titleKey: 'badge_words_100',
    descKey: 'badge_words_100_desc',
    icon: 'Library',
    tone: 'purple',
  },
  {
    id: 'mastered_5',
    titleKey: 'badge_mastered_5',
    descKey: 'badge_mastered_5_desc',
    icon: 'Crown',
    tone: 'yellow',
  },
  {
    id: 'mastered_25',
    titleKey: 'badge_mastered_25',
    descKey: 'badge_mastered_25_desc',
    icon: 'Crown',
    tone: 'purple',
  },
  {
    id: 'streak_3',
    titleKey: 'badge_streak_3',
    descKey: 'badge_streak_3_desc',
    icon: 'Flame',
    tone: 'yellow',
  },
  {
    id: 'streak_7',
    titleKey: 'badge_streak_7',
    descKey: 'badge_streak_7_desc',
    icon: 'Flame',
    tone: 'red',
  },
  {
    id: 'streak_30',
    titleKey: 'badge_streak_30',
    descKey: 'badge_streak_30_desc',
    icon: 'Flame',
    tone: 'purple',
  },
  {
    id: 'level_5',
    titleKey: 'badge_level_5',
    descKey: 'badge_level_5_desc',
    icon: 'Star',
    tone: 'blue',
  },
  {
    id: 'level_10',
    titleKey: 'badge_level_10',
    descKey: 'badge_level_10_desc',
    icon: 'Star',
    tone: 'purple',
  },
  {
    id: 'perfect_day',
    titleKey: 'badge_perfect_day',
    descKey: 'badge_perfect_day_desc',
    icon: 'Trophy',
    tone: 'yellow',
  },
  {
    id: 'polyglot',
    titleKey: 'badge_polyglot',
    descKey: 'badge_polyglot_desc',
    icon: 'Languages',
    tone: 'blue',
  },
];

export const BADGE_BY_ID: Readonly<Record<BadgeId, BadgeDefinition>> = Object.freeze(
  BADGES.reduce<Record<BadgeId, BadgeDefinition>>(
    (acc, badge) => {
      acc[badge.id] = badge;
      return acc;
    },
    {} as Record<BadgeId, BadgeDefinition>,
  ),
);
