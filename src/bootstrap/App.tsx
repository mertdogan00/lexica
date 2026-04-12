import { useMemo } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppProviders } from '../core/application/index.ts';
import { AppShell } from '../presentation/index.ts';
import { Dashboard, Words, Review, Settings } from '../presentation/index.ts';
import { createContainer } from './container.ts';

// App is the root React tree. It stands up the DI container exactly
// once, wraps the tree in every application-layer provider, and
// defines the top-level route table. The four top-level routes all
// share AppShell via nested routing so the header, bottom nav, FAB,
// modal and toast hosts stay mounted across navigations.

export function App(): React.ReactNode {
  const container = useMemo(() => createContainer(), []);

  return (
    <AppProviders container={container}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="/words" element={<Words />} />
            <Route path="/review" element={<Review />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}
