import { useMemo } from 'react';
import type { AvatarStyle } from '../../core/domain/index.ts';
import { renderAvatarDataUri } from '../../shared/index.ts';

// Avatar is the presentational wrapper around DiceBear. It only takes a
// style + seed and a size class, and memoises the data URI so scrolling
// lists of avatars do not regenerate SVGs on every render.

export interface AvatarProps {
  style: AvatarStyle;
  seed: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  alt?: string;
}

export function Avatar({ style, seed, size = 'md', alt = 'avatar' }: AvatarProps): React.ReactNode {
  const src = useMemo(() => renderAvatarDataUri(style, seed), [style, seed]);
  return <img className={`avatar avatar-${size}`} src={src} alt={alt} draggable={false} />;
}
