import { ArrowRight, Flame, Plus, Sparkles, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  useDashboardStats,
  useGamification,
  useModal,
  useSettings,
  useTranslation,
} from '../../../core/application/index.ts';
import { Avatar } from '../../shell/Avatar.tsx';
import { WordFormModal } from '../Words/index.ts';

// Dashboard is the greeting + headline stats screen. The big goal
// card at the top doubles as the user's at-a-glance progress feedback
// and is flanked by a gamification strip showing level, XP to next,
// and the current streak flame.

export function Dashboard(): React.ReactNode {
  const { t, tFmt } = useTranslation();
  const { settings } = useSettings();
  const stats = useDashboardStats();
  const { state: gameState, levelState } = useGamification();
  const { open } = useModal();
  const navigate = useNavigate();

  const greeting = settings.profile.name
    ? tFmt('dash_hello_named', { name: settings.profile.name })
    : t('dash_hello');

  const sub = stats.hasOverdue
    ? `${stats.overdueWords} ${t('has_overdue')}`
    : stats.hasReviews
      ? `${t('today')}: ${stats.todayReviewWords} ${t('has_reviews')}`
      : t('free_today');

  const openAdd = (): void => {
    open({ title: t('add_word') }, <WordFormModal />);
  };

  const xpPct =
    levelState.xpForNextLevel > 0
      ? Math.min(100, Math.round((levelState.xpIntoLevel / levelState.xpForNextLevel) * 100))
      : 100;

  return (
    <section className="page">
      <header className="dash-header">
        {settings.profile.name ? (
          <Avatar
            style={settings.profile.avatarStyle}
            seed={settings.profile.avatarSeed}
            size="lg"
          />
        ) : null}
        <div>
          <h1 className="dash-greeting">{greeting}</h1>
          <p className="dash-sub">{sub}</p>
        </div>
      </header>

      <div className="game-strip">
        <div className="game-chip level">
          <Star size={16} />
          <div className="game-chip-body">
            <div className="game-chip-label">{t('level_label')}</div>
            <div className="game-chip-value">{levelState.level}</div>
          </div>
        </div>
        <div className="game-chip streak">
          <Flame size={16} />
          <div className="game-chip-body">
            <div className="game-chip-label">{t('streak_label')}</div>
            <div className="game-chip-value">{gameState.streak.current}</div>
          </div>
        </div>
        <div className="game-chip xp">
          <Zap size={16} />
          <div className="game-chip-body">
            <div className="game-chip-label">{t('xp_label')}</div>
            <div className="game-chip-value">{gameState.xp}</div>
          </div>
        </div>
      </div>

      <div className="xp-bar-wrap">
        <div className="xp-bar">
          <div className="xp-fill" style={{ width: `${xpPct}%` }} />
        </div>
        <div className="xp-bar-meta">
          {levelState.xpIntoLevel} / {levelState.xpForNextLevel} {t('xp_to_next')}
        </div>
      </div>

      <div className="goal-card">
        <div className="goal-header">
          <div className="goal-title">{t('daily_goal')}</div>
          <div className="goal-count">
            {stats.dailyCount}/{stats.dailyGoal}
          </div>
        </div>
        <div className="goal-bar">
          <div className="goal-fill" style={{ width: `${stats.goalPercent}%` }} />
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-num">{stats.totalWords}</div>
          <div className="stat-label">{t('total_words')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-num success">{stats.todayReviewWords}</div>
          <div className="stat-label">{t('today_review')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-num danger">{stats.overdueWords}</div>
          <div className="stat-label">{t('overdue')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-num warning">{stats.upcomingWords}</div>
          <div className="stat-label">{t('upcoming')}</div>
        </div>
      </div>

      <h2 className="section-title">{t('quick_actions')}</h2>

      {stats.hasOverdue ? (
        <button type="button" className="action-card" onClick={() => navigate('/review')}>
          <div className="action-icon red">
            <Zap size={20} />
          </div>
          <div className="action-info">
            <div className="action-title">
              {stats.overdueWords} {t('overdue_msg')}
            </div>
            <div className="action-desc">{t('start_review')}</div>
          </div>
          <ArrowRight className="action-arrow" size={18} />
        </button>
      ) : null}

      {stats.hasReviews ? (
        <button type="button" className="action-card" onClick={() => navigate('/review')}>
          <div className="action-icon green">
            <Sparkles size={20} />
          </div>
          <div className="action-info">
            <div className="action-title">{t('start_review')}</div>
            <div className="action-desc">
              {stats.todayReviewWords} {t('reviews_left')}
            </div>
          </div>
          <ArrowRight className="action-arrow" size={18} />
        </button>
      ) : null}

      <button type="button" className="action-card" onClick={openAdd}>
        <div className="action-icon yellow">
          <Plus size={20} />
        </div>
        <div className="action-info">
          <div className="action-title">{t('add_word')}</div>
          <div className="action-desc">{t('add_word_desc')}</div>
        </div>
        <ArrowRight className="action-arrow" size={18} />
      </button>
    </section>
  );
}
