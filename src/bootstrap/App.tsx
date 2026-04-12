import { Suspense, useMemo, type ReactNode } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppProviders } from '../core/application/index.ts';
import { AppShell } from '../presentation/index.ts';
import {
  LazyDashboard,
  LazyReview,
  LazySettings,
  LazyWords,
  LoadingFallback,
} from '../presentation/index.ts';
import { createContainer } from './container.ts';

// App is the root React tree. It stands up the DI container exactly
// once, wraps the tree in every application-layer provider, and
// defines the top-level route table. The four top-level routes all
// share AppShell via nested routing so the header, bottom nav, FAB,
// modal and toast hosts stay mounted across navigations.

// Route-level Suspense wrapper to keep lazy screens consistent.
const withFallback = (node: ReactNode): ReactNode => (
  <Suspense fallback={<LoadingFallback />}>{node}</Suspense>
);

export function App(): ReactNode {
  const container = useMemo(() => createContainer(), []);

  return (
    <AppProviders container={container}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={withFallback(<LazyDashboard />)} />
            <Route path="/words" element={withFallback(<LazyWords />)} />
            <Route path="/review" element={withFallback(<LazyReview />)} />
            <Route path="/settings" element={withFallback(<LazySettings />)} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}
