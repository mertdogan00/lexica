import { createAvatar, type Style } from '@dicebear/core';
import * as collection from '@dicebear/collection';
import type { AvatarStyle } from '../../core/domain/index.ts';

// renderAvatar builds a DiceBear SVG data URI for a given style + seed.
// We map each AvatarStyle in the domain to a concrete style module from
// @dicebear/collection. Data URIs are used instead of remote URLs so the
// avatar keeps working offline after the initial page load.

// Style<Record<string, unknown>> is the common supertype of every collection module.
// We centralise the map so adding a new style is a two-line change
// (domain enum + this record).
const STYLE_MODULES: Readonly<Record<AvatarStyle, Style<Record<string, unknown>>>> = {
  adventurer: collection.adventurer as Style<Record<string, unknown>>,
  avataaars: collection.avataaars as Style<Record<string, unknown>>,
  bottts: collection.bottts as Style<Record<string, unknown>>,
  lorelei: collection.lorelei as Style<Record<string, unknown>>,
  notionists: collection.notionists as Style<Record<string, unknown>>,
  'pixel-art': collection.pixelArt as Style<Record<string, unknown>>,
  'fun-emoji': collection.funEmoji as Style<Record<string, unknown>>,
  thumbs: collection.thumbs as Style<Record<string, unknown>>,
};

export function renderAvatarDataUri(style: AvatarStyle, seed: string): string {
  const module = STYLE_MODULES[style];
  const avatar = createAvatar(module, {
    seed,
    radius: 50,
  });
  return avatar.toDataUri();
}

export function generateRandomSeed(): string {
  return Math.random().toString(36).slice(2, 10);
}
