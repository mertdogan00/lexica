import { Shuffle } from 'lucide-react';
import type { ReactNode } from 'react';
import type { AvatarStyle } from '../../../core/domain/index.ts';
import { AVATAR_STYLES } from '../../../core/domain/index.ts';
import { useModal, useSettings, useTranslation } from '../../../core/application/index.ts';
import { generateRandomSeed } from '../../../shared/index.ts';
import { Avatar } from '../../shell/Avatar.tsx';

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

// SettingsPickerModal reads settings internally so it re-renders when
// the user taps an option, keeping the "selected" highlight in sync.

export interface PickerOption<T extends string | number> {
  id: T;
  label: string;
}

export interface SettingsPickerModalProps<T extends string | number> {
  options: PickerOption<T>[];
  settingsKey: string;
  onSelect: (id: T) => void;
}

export function SettingsPickerModal<T extends string | number>({
  options,
  settingsKey,
  onSelect,
}: SettingsPickerModalProps<T>): React.ReactNode {
  const { settings } = useSettings();
  const { close } = useModal();

  // Read the current value from settings using the dot-separated key
  const currentValue = settingsKey.split('.').reduce<unknown>((obj, key) => {
    return (obj as Record<string, unknown>)?.[key];
  }, settings) as T;

  return (
    <div className="settings-option-modal">
      <div className="ob-options">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`ob-option${currentValue === opt.id ? ' selected' : ''}`}
            onClick={() => onSelect(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>
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

// AvatarPickerModal reads settings internally so the preview and
// selected highlight stay in sync as the user picks styles or shuffles.

export function AvatarPickerModal(): React.ReactNode {
  const { settings, updateProfile } = useSettings();
  const { t } = useTranslation();

  return (
    <div className="avatar-picker">
      <div className="avatar-picker-preview">
        <Avatar style={settings.profile.avatarStyle} seed={settings.profile.avatarSeed} size="xl" />
        <button
          type="button"
          className="btn-chip"
          onClick={() => updateProfile({ avatarSeed: generateRandomSeed() })}
        >
          <Shuffle size={14} />
          {t('avatar_shuffle')}
        </button>
      </div>
      <div className="avatar-style-grid">
        {AVATAR_STYLES.map((style: AvatarStyle) => (
          <button
            key={style}
            type="button"
            className={`avatar-style-item${settings.profile.avatarStyle === style ? ' selected' : ''}`}
            onClick={() => updateProfile({ avatarStyle: style })}
          >
            <Avatar style={style} seed={settings.profile.avatarSeed} size="sm" />
          </button>
        ))}
      </div>
    </div>
  );
}
