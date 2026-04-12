import type { ReactNode } from 'react';
import { useModal } from '../../../core/application/index.ts';

// SettingsOptionModal is the small "pick one" picker used by every
// setting that opens a sheet (repetition system, daily goal, learning
// mode, theme, language). The caller supplies the rendered options
// and the save button just closes the modal — each option's onClick
// is responsible for persisting the change.

export interface SettingsOptionModalProps {
  children: ReactNode;
}

export function SettingsOptionModal({ children }: SettingsOptionModalProps): React.ReactNode {
  const { close } = useModal();
  return (
    <div className="settings-option-modal">
      <div className="ob-options">{children}</div>
      <button
        type="button"
        className="btn btn-primary btn-block btn-lg settings-option-save"
        onClick={close}
      >
        OK
      </button>
    </div>
  );
}
