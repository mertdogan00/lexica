import { useToast } from '../../core/application/index.ts';

// ToastHost renders the queue of active toasts in a fixed container
// near the top of the viewport. Toasts dismiss themselves after a
// timeout set by ToastContext, so this component is pure presentation.

export function ToastHost(): React.ReactNode {
  const { toasts } = useToast();
  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast">
          {toast.message}
        </div>
      ))}
    </div>
  );
}
