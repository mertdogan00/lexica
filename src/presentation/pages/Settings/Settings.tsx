import {
  BookMarked,
  Brain,
  Download,
  Languages,
  Palette,
  RefreshCw,
  Sparkles,
  Target,
  Trash2,
  Upload,
  User,
} from 'lucide-react';
import { useRef } from 'react';
import type { Language, LearningMode, SrsPresetId, Theme } from '../../../core/domain/index.ts';
import {
  useDataIo,
  useModal,
  useSettings,
  useToast,
  useTranslation,
  useWordLibrary,
} from '../../../core/application/index.ts';
import { Avatar } from '../../shell/Avatar.tsx';
import { AvatarPickerModal, SettingsPickerModal } from './SettingsOptionModal.tsx';

// Settings is the single-screen preferences page. It is grouped into
// four sections — profile, learning, appearance, data — and each
// setting row either toggles inline (animations) or opens a picker
// modal via the global modal host.

export function Settings(): React.ReactNode {
  const { t } = useTranslation();
  const { settings, update, updateProfile } = useSettings();
  const { open, close } = useModal();
  const { exportJson, parseImport, applyImport } = useDataIo();
  const { show } = useToast();
  const { reload } = useWordLibrary();
  const importFileRef = useRef<HTMLInputElement>(null);

  const systemLabel: Record<SrsPresetId, string> = {
    default: t('default_sys'),
    aggressive: t('aggressive_sys'),
    relaxed: t('relaxed_sys'),
  };
  const modeLabel: Record<LearningMode, string> = {
    en_to_tr: t('en_to_tr'),
    tr_to_en: t('tr_to_en'),
    mixed: t('mixed'),
  };
  const themeLabel: Record<Theme, string> = {
    light: t('theme_light'),
    dark: t('theme_dark'),
    auto: t('theme_auto'),
  };
  const langLabel: Record<Language, string> = {
    tr: 'Türkçe',
    en: 'English',
  };

  const openSystemPicker = (): void => {
    const sysOptions = (['default', 'aggressive', 'relaxed'] as const).map((id) => ({
      id,
      label:
        id === 'default'
          ? t('ob_sys_default')
          : id === 'aggressive'
            ? t('ob_sys_aggressive')
            : t('ob_sys_relaxed'),
    }));
    open(
      { title: t('select_system') },
      <SettingsPickerModal
        options={sysOptions}
        settingsKey="system"
        onSelect={(id) => update({ system: id })}
      />,
    );
  };

  const openGoalPicker = (): void => {
    const goalOptions = [5, 10, 15, 20, 30, 50].map((goal) => ({
      id: goal,
      label: String(goal),
    }));
    open(
      { title: t('select_goal') },
      <SettingsPickerModal
        options={goalOptions}
        settingsKey="goal"
        onSelect={(goal) => update({ goal })}
      />,
    );
  };

  const openModePicker = (): void => {
    const modeOptions = (['en_to_tr', 'tr_to_en', 'mixed'] as const).map((id) => ({
      id,
      label: modeLabel[id],
    }));
    open(
      { title: t('select_mode') },
      <SettingsPickerModal
        options={modeOptions}
        settingsKey="mode"
        onSelect={(id) => update({ mode: id })}
      />,
    );
  };

  const openThemePicker = (): void => {
    const themeOptions = (['light', 'dark', 'auto'] as const).map((id) => ({
      id,
      label: themeLabel[id],
    }));
    open(
      { title: t('select_theme') },
      <SettingsPickerModal
        options={themeOptions}
        settingsKey="theme"
        onSelect={(id) => update({ theme: id })}
      />,
    );
  };

  const openLangPicker = (): void => {
    const langOptions = (['tr', 'en'] as const).map((id) => ({
      id,
      label: langLabel[id],
    }));
    open(
      { title: t('select_lang') },
      <SettingsPickerModal
        options={langOptions}
        settingsKey="lang"
        onSelect={(id) => update({ lang: id })}
      />,
    );
  };

  const openAvatarPicker = (): void => {
    open({ title: t('profile_avatar') }, <AvatarPickerModal />);
  };

  const openNameEditor = (): void => {
    const content = (
      <form
        className="name-editor"
        onSubmit={(e) => {
          e.preventDefault();
          const input = (e.currentTarget.elements.namedItem('profileName') as HTMLInputElement)
            .value;
          updateProfile({ name: input.trim() });
          show(t('word_updated'));
          close();
        }}
      >
        <label className="form-group">
          <span className="form-label">{t('ob_profile_name_label')}</span>
          <input
            className="form-input"
            type="text"
            name="profileName"
            defaultValue={settings.profile.name}
            placeholder={t('ob_profile_name_placeholder')}
            autoFocus
          />
        </label>
        <button type="submit" className="btn btn-primary btn-block btn-lg">
          {t('save')}
        </button>
      </form>
    );
    open({ title: t('profile_name') }, content);
  };

  const onImportFileSelected = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const raw = await file.text();
    const payload = parseImport(raw);
    if (!payload) {
      show(t('invalid_file'));
      return;
    }
    const options = (
      <div className="ob-options">
        <button
          type="button"
          className="ob-option"
          onClick={() => {
            void applyImport(payload, 'overwrite').then((summary) => {
              show(`${t('imported')} (${summary.imported})`);
              close();
            });
          }}
        >
          <strong>{t('overwrite')}</strong>
          <br />
          <span className="ob-option-desc">{t('overwrite_desc')}</span>
        </button>
        <button
          type="button"
          className="ob-option"
          onClick={() => {
            void applyImport(payload, 'merge').then((summary) => {
              show(`${t('imported')} (${summary.imported})`);
              close();
            });
          }}
        >
          <strong>{t('merge')}</strong>
          <br />
          <span className="ob-option-desc">{t('merge_desc')}</span>
        </button>
      </div>
    );
    open({ title: t('import_mode') }, options);
  };

  const confirmReset = async (): Promise<void> => {
    if (!window.confirm(t('confirm_reset'))) return;
    // Clear every Lexica key so onboarding runs fresh on next load.
    localStorage.clear();
    // IndexedDB clear is done via the repository through a reload.
    // We cannot delete the whole DB without re-opening, so we just
    // truncate via the same path the import/overwrite flow uses.
    await applyImport(
      { version: 1, settings, words: [], exportDate: new Date().toISOString() },
      'overwrite',
    );
    await reload();
    show(t('data_reset'));
    window.location.reload();
  };

  return (
    <section className="page">
      <h1 className="dash-greeting">{t('settings')}</h1>

      <div className="settings-group">
        <div className="settings-group-title">{t('sg_profile')}</div>
        <div className="settings-item settings-item-profile">
          <div className="settings-item-left">
            <Avatar
              style={settings.profile.avatarStyle}
              seed={settings.profile.avatarSeed}
              size="md"
            />
            <div>
              <div className="settings-item-label">
                {settings.profile.name || t('profile_name')}
              </div>
              <div className="settings-item-value">{t('profile_edit')}</div>
            </div>
          </div>
          <div className="settings-item-actions">
            <button type="button" className="btn-chip" onClick={openNameEditor}>
              <User size={14} />
              {t('profile_name')}
            </button>
            <button type="button" className="btn-chip" onClick={openAvatarPicker}>
              <Sparkles size={14} />
              {t('profile_avatar')}
            </button>
          </div>
        </div>
      </div>

      <div className="settings-group">
        <div className="settings-group-title">{t('sg_learning')}</div>
        <button type="button" className="settings-item" onClick={openSystemPicker}>
          <div className="settings-item-left">
            <div className="settings-item-icon green">
              <RefreshCw size={16} />
            </div>
            <div className="settings-item-label">{t('repetition_system')}</div>
          </div>
          <div className="settings-item-value">{systemLabel[settings.system]}</div>
        </button>
        <button type="button" className="settings-item" onClick={openGoalPicker}>
          <div className="settings-item-left">
            <div className="settings-item-icon yellow">
              <Target size={16} />
            </div>
            <div className="settings-item-label">{t('daily_goal')}</div>
          </div>
          <div className="settings-item-value">{settings.goal}</div>
        </button>
        <button type="button" className="settings-item" onClick={openModePicker}>
          <div className="settings-item-left">
            <div className="settings-item-icon success">
              <Brain size={16} />
            </div>
            <div className="settings-item-label">{t('learning_mode')}</div>
          </div>
          <div className="settings-item-value">{modeLabel[settings.mode]}</div>
        </button>
      </div>

      <div className="settings-group">
        <div className="settings-group-title">{t('sg_appearance')}</div>
        <button type="button" className="settings-item" onClick={openThemePicker}>
          <div className="settings-item-left">
            <div className="settings-item-icon neutral">
              <Palette size={16} />
            </div>
            <div className="settings-item-label">{t('theme')}</div>
          </div>
          <div className="settings-item-value">{themeLabel[settings.theme]}</div>
        </button>
        <button type="button" className="settings-item" onClick={openLangPicker}>
          <div className="settings-item-left">
            <div className="settings-item-icon neutral">
              <Languages size={16} />
            </div>
            <div className="settings-item-label">{t('language')}</div>
          </div>
          <div className="settings-item-value">{langLabel[settings.lang]}</div>
        </button>
        <div className="settings-item">
          <div className="settings-item-left">
            <div className="settings-item-icon neutral">
              <Sparkles size={16} />
            </div>
            <div className="settings-item-label">{t('animations')}</div>
          </div>
          <button
            type="button"
            className={`toggle${settings.animations ? ' on' : ''}`}
            onClick={() => update({ animations: !settings.animations })}
            aria-pressed={settings.animations}
            aria-label={t('animations')}
          />
        </div>
      </div>

      <div className="settings-group">
        <div className="settings-group-title">{t('sg_data')}</div>
        <button type="button" className="settings-item" onClick={() => void exportJson()}>
          <div className="settings-item-left">
            <div className="settings-item-icon green">
              <Download size={16} />
            </div>
            <div className="settings-item-label">{t('export')}</div>
          </div>
          <div className="settings-item-value">JSON</div>
        </button>
        <button
          type="button"
          className="settings-item"
          onClick={() => importFileRef.current?.click()}
        >
          <div className="settings-item-left">
            <div className="settings-item-icon yellow">
              <Upload size={16} />
            </div>
            <div className="settings-item-label">{t('import')}</div>
          </div>
          <div className="settings-item-value">JSON</div>
        </button>
        <button
          type="button"
          className="settings-item settings-item-danger"
          onClick={() => void confirmReset()}
        >
          <div className="settings-item-left">
            <div className="settings-item-icon red">
              <Trash2 size={16} />
            </div>
            <div className="settings-item-label">{t('reset_data')}</div>
          </div>
          <div className="settings-item-value">
            <BookMarked size={14} aria-hidden="true" />
          </div>
        </button>
        <input
          ref={importFileRef}
          type="file"
          accept=".json"
          className="visually-hidden"
          onChange={(e) => void onImportFileSelected(e)}
        />
      </div>
    </section>
  );
}
