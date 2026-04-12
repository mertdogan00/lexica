import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

// ModalContext is the global one-slot modal host. Pages call open()
// with a React node and close() when done, so there is exactly one
// overlay element in the DOM and a single set of transitions shared
// across every feature that needs a sheet.

export interface ModalOptions {
  title: string;
}

export interface ModalPayload extends ModalOptions {
  content: ReactNode;
}

export interface ModalApi {
  open: (options: ModalOptions, content: ReactNode) => void;
  close: () => void;
  payload: ModalPayload | null;
  isOpen: boolean;
}

const ModalContext = createContext<ModalApi | null>(null);

export function ModalProvider({ children }: { children: ReactNode }): ReactNode {
  const [payload, setPayload] = useState<ModalPayload | null>(null);

  const open = useCallback((options: ModalOptions, content: ReactNode): void => {
    setPayload({ ...options, content });
  }, []);

  const close = useCallback((): void => {
    setPayload(null);
  }, []);

  const api = useMemo<ModalApi>(
    () => ({ open, close, payload, isOpen: payload !== null }),
    [open, close, payload],
  );

  return <ModalContext.Provider value={api}>{children}</ModalContext.Provider>;
}

export function useModal(): ModalApi {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be called inside <ModalProvider>');
  return ctx;
}
