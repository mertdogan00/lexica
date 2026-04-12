import { createContext, useContext, type ReactNode } from 'react';
import type { Container } from '../../ports/index.ts';

// ContainerContext hands the DI container down the React tree. Hooks in
// the application layer read their adapters through useContainer() so
// that the same code works against a mock container in tests.

const ContainerContext = createContext<Container | null>(null);

export interface ContainerProviderProps {
  container: Container;
  children: ReactNode;
}

export function ContainerProvider({ container, children }: ContainerProviderProps): ReactNode {
  return <ContainerContext.Provider value={container}>{children}</ContainerContext.Provider>;
}

export function useContainer(): Container {
  const ctx = useContext(ContainerContext);
  if (!ctx) {
    throw new Error('useContainer must be called inside <ContainerProvider>');
  }
  return ctx;
}
