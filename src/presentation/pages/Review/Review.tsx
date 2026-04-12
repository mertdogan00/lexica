import { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ReviewQuality } from '../../../core/domain/index.ts';
import {
  useModal,
  useReviewSession,
  useTranslation,
  useWordLibrary,
} from '../../../core/application/index.ts';
import { WordFormModal } from '../Words/index.ts';

// Review owns the flashcard session loop: start on mount, present the
// current card, reveal on tap, grade with four quality buttons, and
// render the completion card once the queue is exhausted.

export function Review(): React.ReactNode {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { words, loading } = useWordLibrary();
  const session = useReviewSession();
  const { open } = useModal();

  // Start a session as soon as the page mounts. Re-run when the word
  // library finishes its initial load, otherwise the first open of
  // /review lands on an empty queue before words are ready.
  useEffect(() => {
    if (!loading) {
      session.startSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const openAdd = (): void => {
    open({ title: t('add_word') }, <WordFormModal />);
  };

  if (session.queueSize === 0 && session.hasSession) {
    return (
      <section className="page">
        <div className="review-empty">
          <div className="review-empty-icon">✅</div>
          <div className="review-empty-title">{t('no_review')}</div>
          <div className="review-empty-desc">{t('no_review_desc')}</div>
          <button
            type="button"
            className="btn btn-primary btn-lg review-empty-cta"
            onClick={openAdd}
          >
            <Plus size={18} />
            {t('add_word')}
          </button>
        </div>
      </section>
    );
  }

  if (session.currentIndex >= session.queueSize && session.hasSession) {
    const total =
      session.stats.again + session.stats.hard + session.stats.good + session.stats.easy;
    return (
      <section className="page">
        <div className="review-complete">
          <div className="review-complete-icon">🎉</div>
          <div className="review-complete-title">{t('review_done')}</div>
          <div className="review-complete-desc">{t('review_done_desc')}</div>
          <div className="review-complete-stats">
            <div className="rc-stat">
              <div className="rc-stat-num">{total}</div>
              <div className="rc-stat-label">{t('reviewed')}</div>
            </div>
            <div className="rc-stat">
              <div className="rc-stat-num success">{session.stats.good + session.stats.easy}</div>
              <div className="rc-stat-label">{t('good')}</div>
            </div>
            <div className="rc-stat">
              <div className="rc-stat-num danger">{session.stats.again}</div>
              <div className="rc-stat-label">{t('again')}</div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-lg btn-block"
            onClick={() => {
              session.endSession();
              void navigate('/');
            }}
          >
            {t('back_home')}
          </button>
        </div>
      </section>
    );
  }

  const card = session.currentCard;
  if (!card) {
    // While words are still loading or a session has not started yet.
    if (words.length === 0) {
      return (
        <section className="page">
          <div className="review-empty">
            <div className="review-empty-icon">📚</div>
            <div className="review-empty-title">{t('no_words')}</div>
            <div className="review-empty-desc">{t('no_words_desc')}</div>
            <button
              type="button"
              className="btn btn-primary btn-lg review-empty-cta"
              onClick={openAdd}
            >
              <Plus size={18} />
              {t('add_first')}
            </button>
          </div>
        </section>
      );
    }
    return <section className="page" />;
  }

  const pct = Math.round((session.currentIndex / session.queueSize) * 100);

  const buttons: readonly {
    quality: ReviewQuality;
    className: string;
    label: string;
    hint: string;
  }[] = [
    { quality: 'again', className: 'again', label: t('again'), hint: t('day_1') },
    {
      quality: 'hard',
      className: 'hard',
      label: t('hard'),
      hint: `${card.intervals.hard}${t('days')}`,
    },
    {
      quality: 'good',
      className: 'good',
      label: t('good'),
      hint: `${card.intervals.good}${t('days')}`,
    },
    {
      quality: 'easy',
      className: 'easy',
      label: t('easy'),
      hint: `${card.intervals.easy}${t('days')}`,
    },
  ];

  return (
    <section className="page">
      <div className="review-container">
        <div className="review-progress">
          <div className="review-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="review-counter">
          {session.currentIndex + 1} / {session.queueSize}
        </div>

        <button
          type="button"
          className="flashcard"
          onClick={() => {
            if (!session.revealed) session.reveal();
          }}
        >
          <div className="flashcard-label">
            {card.frontFace === 'english' ? 'ENGLISH' : 'TÜRKÇE'}
          </div>
          <div className="flashcard-word">{card.frontText}</div>
          {!session.revealed ? (
            <div className="flashcard-hint">{t('tap_to_reveal')}</div>
          ) : (
            <>
              <div className="flashcard-divider" />
              <div className="flashcard-label">
                {card.backFace === 'english' ? 'ENGLISH' : 'TÜRKÇE'}
              </div>
              <div className="flashcard-word flashcard-answer">{card.backText}</div>
              {card.word.exampleSentence ? (
                <div className="flashcard-example">&ldquo;{card.word.exampleSentence}&rdquo;</div>
              ) : null}
              {card.word.notes ? <div className="flashcard-notes">{card.word.notes}</div> : null}
            </>
          )}
        </button>

        {session.revealed ? (
          <div className="review-actions">
            {buttons.map((b) => (
              <button
                key={b.quality}
                type="button"
                className={`review-btn ${b.className}`}
                onClick={() => {
                  void session.answer(b.quality);
                }}
              >
                {b.label}
                <span>{b.hint}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
