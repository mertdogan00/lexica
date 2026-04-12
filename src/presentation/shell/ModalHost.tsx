import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useModal } from '../../core/application/index.ts';

// ModalHost renders the single global modal overlay. It owns the
// Escape-to-close and click-outside-to-close interactions so pages can
// stay focused on their content instead of reimplementing the same
// dismissal shortcuts.

export function ModalHost(): React.ReactNode {
  const { payload, close, isOpen } = useModal();

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, close]);

  return (
    <div
      className={`modal-overlay${isOpen ? ' show' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      aria-hidden={!isOpen}
    >
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-handle" />
        <div className="modal-header">
          <div className="modal-title">{payload?.title ?? ''}</div>
          <button type="button" className="modal-close" onClick={close} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">{payload?.content}</div>
      </div>
    </div>
  );
}
