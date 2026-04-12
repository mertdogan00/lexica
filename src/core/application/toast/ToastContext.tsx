import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

// ToastContext exposes a tiny imperative toast API to every component
// in the tree. Toasts are plain transient strings — anything more
// structured would force consumers to think about layout, timing and
// cleanup themselves.

export interface ToastItem {
  id: number;
  message: string;
}

export interface ToastApi {
  toasts: readonly ToastItem[];
  show: (message: string) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const TOAST_DURATION_MS = 3000;

export function ToastProvider({ children }: { children: ReactNode }): ReactNode {
  const [toasts, setToasts] = useState<readonly ToastItem[]>([]);

  const dismiss = useCallback((id: number): void => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message: string): void => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      setToasts((prev) => [...prev, { id, message }]);
      window.setTimeout(() => dismiss(id), TOAST_DURATION_MS);
    },
    [dismiss],
  );

  const api = useMemo<ToastApi>(() => ({ toasts, show, dismiss }), [toasts, show, dismiss]);

  return <ToastContext.Provider value={api}>{children}</ToastContext.Provider>;
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be called inside <ToastProvider>');
  return ctx;
}
