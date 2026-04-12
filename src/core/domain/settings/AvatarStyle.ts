// AvatarStyle picks which DiceBear collection to render the user's avatar
// with. We expose a small curated set rather than all 30+ styles so the
// onboarding picker stays focused and the avatar.css styling can make
// reliable assumptions about background tone and silhouette.

export type AvatarStyle =
  | 'adventurer'
  | 'avataaars'
  | 'bottts'
  | 'lorelei'
  | 'notionists'
  | 'pixel-art'
  | 'fun-emoji'
  | 'thumbs';

export const AVATAR_STYLES: readonly AvatarStyle[] = [
  'adventurer',
  'avataaars',
  'bottts',
  'lorelei',
  'notionists',
  'pixel-art',
  'fun-emoji',
  'thumbs',
];
