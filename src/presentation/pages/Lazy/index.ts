import { lazy } from 'react';

// Route-level lazy imports keep large pages out of the initial bundle.

export const LazyDashboard = lazy(async () => {
  const mod = await import('../Dashboard/index.ts');
  return { default: mod.Dashboard };
});

export const LazyWords = lazy(async () => {
  const mod = await import('../Words/index.ts');
  return { default: mod.Words };
});

export const LazyReview = lazy(async () => {
  const mod = await import('../Review/index.ts');
  return { default: mod.Review };
});

export const LazySettings = lazy(async () => {
  const mod = await import('../Settings/index.ts');
  return { default: mod.Settings };
});
