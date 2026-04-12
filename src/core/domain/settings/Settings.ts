import type { SrsPresetId } from '../srs/index.ts';
import type { AvatarStyle } from './AvatarStyle.ts';
import type { Language } from './Language.ts';
import type { LearningMode } from './LearningMode.ts';
import type { Theme } from './Theme.ts';

// Settings is the single root of user preferences and profile.
// It is stored verbatim in localStorage under a single key so there is
// only one write site when anything here changes.

export interface UserProfile {
  // Display name captured during onboarding. Optional — empty string means
  // the user chose to skip the name step.
  name: string;
  // Seed fed into DiceBear to deterministically regenerate the avatar.
  // Shuffle produces a new random seed.
  avatarSeed: string;
  avatarStyle: AvatarStyle;
}

export interface Settings {
  system: SrsPresetId;
  // Number of reviews the user commits to per day. Drives the goal bar
  // and the daily reward bonus.
  goal: number;
  mode: LearningMode;
  theme: Theme;
  lang: Language;
  animations: boolean;
  onboarded: boolean;
  profile: UserProfile;
}

export const DEFAULT_SETTINGS: Settings = {
  system: 'default',
  goal: 10,
  mode: 'en_to_tr',
  theme: 'auto',
  lang: 'tr',
  animations: true,
  onboarded: false,
  profile: {
    name: '',
    avatarSeed: 'lexica',
    avatarStyle: 'adventurer',
  },
};
