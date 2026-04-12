import type { Word } from '../../../core/domain/index.ts';
import { getIntervalTable } from '../../../core/domain/index.ts';
import {
  useModal,
  useSettings,
  useToast,
  useTranslation,
  useWordLibrary,
} from '../../../core/application/index.ts';
import { formatDateRelative, formatDateShort } from '../../../shared/index.ts';
import { WordFormModal } from './WordFormModal.tsx';

// WordDetailModal is the read-only inspector for a single word. It
// also hosts the edit and delete actions so every mutation path for
// a word is routed through the same UI.

export interface WordDetailModalProps {
  word: Word;
}

export function WordDetailModal({ word }: WordDetailModalProps): React.ReactNode {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const { open, close } = useModal();
  const { show } = useToast();
  const { deleteWord } = useWordLibrary();

  const maxLevel = getIntervalTable(settings.system).length - 1;

  const goEdit = (): void => {
    close();
    // Reopen the modal with the edit form so the global host only
    // manages one modal at a time.
    window.setTimeout(() => {
      open({ title: t('edit_word') }, <WordFormModal editing={word} />);
    }, 50);
  };

  const confirmAndDelete = async (): Promise<void> => {
    if (!window.confirm(t('delete_word_confirm'))) return;
    await deleteWord(word.id);
    show(t('word_deleted'));
    close();
  };

  return (
    <div className="word-detail">
      <div className="word-detail-header">
        <div className="word-detail-en">{word.english}</div>
        <div className="word-detail-tr">{word.turkish}</div>
      </div>

      {word.exampleSentence ? (
        <div className="word-detail-section">
          <div className="word-detail-label">{t('example')}</div>
          <div className="word-detail-value word-detail-italic">{word.exampleSentence}</div>
        </div>
      ) : null}

      {word.notes ? (
        <div className="word-detail-section">
          <div className="word-detail-label">{t('notes')}</div>
          <div className="word-detail-value">{word.notes}</div>
        </div>
      ) : null}

      <div className="word-detail-section">
        <div className="word-detail-label">{t('level')}</div>
        <div className="word-detail-value">
          {word.level} / {maxLevel}
        </div>
      </div>

      <div className="word-detail-section">
        <div className="word-detail-label">{t('repetitions')}</div>
        <div className="word-detail-value">{word.repetitionCount}</div>
      </div>

      <div className="word-detail-section">
        <div className="word-detail-label">{t('next_review')}</div>
        <div className="word-detail-value">
          {word.nextReviewDate
            ? `${formatDateRelative(word.nextReviewDate, { t })} (${formatDateShort(
                word.nextReviewDate,
                settings.lang,
              )})`
            : t('never')}
        </div>
      </div>

      <div className="word-detail-section">
        <div className="word-detail-label">{t('last_review')}</div>
        <div className="word-detail-value">
          {word.lastReviewedAt ? formatDateShort(word.lastReviewedAt, settings.lang) : t('never')}
        </div>
      </div>

      <div className="word-detail-section">
        <div className="word-detail-label">{t('created')}</div>
        <div className="word-detail-value">{formatDateShort(word.createdAt, settings.lang)}</div>
      </div>

      <div className="word-detail-actions">
        <button type="button" className="btn btn-secondary" onClick={goEdit}>
          {t('edit_word')}
        </button>
        <button type="button" className="btn btn-danger" onClick={() => void confirmAndDelete()}>
          {t('delete')}
        </button>
      </div>
    </div>
  );
}
