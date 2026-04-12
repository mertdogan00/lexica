import type { Word } from '../../../core/domain/index.ts';
import { useSettings, useTranslation } from '../../../core/application/index.ts';
import { formatDateRelative } from '../../../shared/index.ts';

// WordCard is the row item rendered inside the filtered list. It
// shows a level indicator, the pair of translations, a relative
// review date and a repetition-count chip.

export interface WordCardProps {
  word: Word;
  onOpen: (word: Word) => void;
}

function repClass(count: number): 'low' | 'mid' | 'high' {
  if (count <= 2) return 'low';
  if (count <= 5) return 'mid';
  return 'high';
}

export function WordCard({ word, onOpen }: WordCardProps): React.ReactNode {
  const { t } = useTranslation();
  useSettings();
  const level = Math.min(word.level, 7);
  const rep = word.repetitionCount;
  const dateInfo = word.nextReviewDate ? formatDateRelative(word.nextReviewDate, { t }) : '';

  return (
    <button type="button" className="word-card" onClick={() => onOpen(word)}>
      <div className={`word-level l${level}`} aria-hidden="true" />
      <div className="word-main">
        <div className="word-en">{word.english}</div>
        <div className="word-tr">{word.turkish}</div>
      </div>
      <div className="word-meta">
        <div className="word-date">{dateInfo}</div>
        <div className={`word-rep ${repClass(rep)}`}>×{rep}</div>
      </div>
    </button>
  );
}
