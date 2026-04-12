import type { ReactNode } from 'react';
import type { Container } from '../../ports/index.ts';
import { ContainerProvider } from '../di/index.ts';
import { SettingsProvider } from '../settings/index.ts';
import { ToastProvider } from '../toast/index.ts';
import { ModalProvider } from '../modal/index.ts';
import { WordLibraryProvider } from '../words/index.ts';
import { GamificationProvider } from '../gamification/index.ts';

// AppProviders composes every application-layer context into a single
// component so the bootstrap root only has to nest one provider. The
// order matters: Container must come first so other providers can read
// the adapters via useContainer(), and Settings comes before any
// provider that depends on the current language/theme.

export interface AppProvidersProps {
  container: Container;
  children: ReactNode;
}

export function AppProviders({ container, children }: AppProvidersProps): ReactNode {
  return (
    <ContainerProvider container={container}>
      <SettingsProvider>
        <ToastProvider>
          <ModalProvider>
            <WordLibraryProvider>
              <GamificationProvider>{children}</GamificationProvider>
            </WordLibraryProvider>
          </ModalProvider>
        </ToastProvider>
      </SettingsProvider>
    </ContainerProvider>
  );
}
