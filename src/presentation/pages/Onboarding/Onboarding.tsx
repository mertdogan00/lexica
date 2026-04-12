import { ArrowLeft, Shuffle } from 'lucide-react';
import { useOnboarding, useTranslation } from '../../../core/application/index.ts';
import { AVATAR_STYLES } from '../../../core/domain/index.ts';
import { Avatar } from '../../shell/Avatar.tsx';

// Onboarding renders the 5-step first-run overlay. The flow is a pure
// finite state machine owned by useOnboarding — this component is
// just the view side, picking which step markup to render.

export function Onboarding(): React.ReactNode {
  const { t } = useTranslation();
  const ob = useOnboarding();

  return (
    <div className="onboarding-overlay" aria-modal="true" role="dialog">
      <div className="ob-inner">
        {!ob.isFirst ? (
          <button type="button" className="ob-back" onClick={ob.back} aria-label={t('ob_back')}>
            <ArrowLeft size={18} />
          </button>
        ) : null}

        {ob.step === 'welcome' ? (
          <section className="ob-step active">
            <div className="ob-icon">📚</div>
            <h1 className="ob-title">{t('ob_welcome_title')}</h1>
            <p className="ob-desc">{t('ob_welcome_desc')}</p>
            <button type="button" className="btn btn-primary btn-lg btn-block" onClick={ob.next}>
              {t('ob_start')}
            </button>
          </section>
        ) : null}

        {ob.step === 'profile' ? (
          <section className="ob-step active">
            <div className="ob-profile-preview">
              <Avatar style={ob.draft.avatarStyle} seed={ob.draft.avatarSeed} size="xl" />
            </div>
            <h1 className="ob-title">{t('ob_profile_title')}</h1>
            <p className="ob-desc">{t('ob_profile_desc')}</p>

            <label className="form-group form-group-inline">
              <span className="form-label">{t('ob_profile_name_label')}</span>
              <input
                className="form-input"
                type="text"
                value={ob.draft.name}
                onChange={(e) => ob.setName(e.target.value)}
                placeholder={t('ob_profile_name_placeholder')}
                autoComplete="off"
              />
            </label>

            <div className="form-group form-group-inline">
              <div className="form-label-row">
                <span className="form-label">{t('ob_profile_avatar_label')}</span>
                <button
                  type="button"
                  className="btn-chip"
                  onClick={ob.shuffleAvatar}
                  aria-label={t('ob_profile_shuffle')}
                >
                  <Shuffle size={14} />
                  {t('ob_profile_shuffle')}
                </button>
              </div>
              <div className="avatar-style-grid">
                {AVATAR_STYLES.map((style) => (
                  <button
                    key={style}
                    type="button"
                    className={`avatar-style-item${ob.draft.avatarStyle === style ? ' selected' : ''}`}
                    onClick={() => ob.setAvatarStyle(style)}
                  >
                    <Avatar style={style} seed={ob.draft.avatarSeed} size="sm" />
                  </button>
                ))}
              </div>
            </div>

            <button type="button" className="btn btn-primary btn-lg btn-block" onClick={ob.next}>
              {t('ob_next')}
            </button>
          </section>
        ) : null}

        {ob.step === 'system' ? (
          <section className="ob-step active">
            <div className="ob-icon">🔄</div>
            <h1 className="ob-title">{t('ob_system_title')}</h1>
            <p className="ob-desc">{t('ob_system_desc')}</p>
            <div className="ob-options">
              {(
                [
                  { id: 'default', key: 'ob_sys_default' },
                  { id: 'aggressive', key: 'ob_sys_aggressive' },
                  { id: 'relaxed', key: 'ob_sys_relaxed' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`ob-option${ob.draft.system === opt.id ? ' selected' : ''}`}
                  onClick={() => ob.setSystem(opt.id)}
                >
                  {t(opt.key)}
                </button>
              ))}
            </div>
            <button type="button" className="btn btn-primary btn-lg btn-block" onClick={ob.next}>
              {t('ob_next')}
            </button>
          </section>
        ) : null}

        {ob.step === 'goal' ? (
          <section className="ob-step active">
            <div className="ob-icon">🎯</div>
            <h1 className="ob-title">{t('ob_goal_title')}</h1>
            <p className="ob-desc">{t('ob_goal_desc')}</p>
            <div className="ob-options">
              {[5, 10, 20, 30].map((goal) => (
                <button
                  key={goal}
                  type="button"
                  className={`ob-option${ob.draft.goal === goal ? ' selected' : ''}`}
                  onClick={() => ob.setGoal(goal)}
                >
                  {goal}
                </button>
              ))}
            </div>
            <button type="button" className="btn btn-primary btn-lg btn-block" onClick={ob.next}>
              {t('ob_next')}
            </button>
          </section>
        ) : null}

        {ob.step === 'mode' ? (
          <section className="ob-step active">
            <div className="ob-icon">🧠</div>
            <h1 className="ob-title">{t('ob_mode_title')}</h1>
            <p className="ob-desc">{t('ob_mode_desc')}</p>
            <div className="ob-options">
              {(
                [
                  { id: 'en_to_tr', key: 'ob_mode_en' },
                  { id: 'tr_to_en', key: 'ob_mode_tr' },
                  { id: 'mixed', key: 'ob_mode_mix' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`ob-option${ob.draft.mode === opt.id ? ' selected' : ''}`}
                  onClick={() => ob.setMode(opt.id)}
                >
                  {t(opt.key)}
                </button>
              ))}
            </div>
            <button type="button" className="btn btn-primary btn-lg btn-block" onClick={ob.finish}>
              {t('ob_finish')}
            </button>
          </section>
        ) : null}

        <div className="ob-dots" aria-hidden="true">
          {Array.from({ length: ob.totalSteps }).map((_, i) => (
            <div key={i} className={`ob-dot${i === ob.stepIndex ? ' active' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
