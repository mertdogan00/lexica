import { useEffect, useState } from 'react';
import type { Word } from '../../../core/domain/index.ts';
import {
  useModal,
  useToast,
  useTranslation,
  useWordLibrary,
} from '../../../core/application/index.ts';

// WordFormModal is the single create/edit form for the Word aggregate.
// It is rendered inside the global modal and receives an optional
// "editing" word; when present it flips into edit mode and submits a
// patch to useWordLibrary.updateWord instead of addWord.

export interface WordFormModalProps {
  editing?: Word;
}

export function WordFormModal({ editing }: WordFormModalProps): React.ReactNode {
  const { t } = useTranslation();
  const { show } = useToast();
  const { close } = useModal();
  const { addWord, updateWord } = useWordLibrary();

  const [english, setEnglish] = useState<string>(editing?.english ?? '');
  const [turkish, setTurkish] = useState<string>(editing?.turkish ?? '');
  const [example, setExample] = useState<string>(editing?.exampleSentence ?? '');
  const [notes, setNotes] = useState<string>(editing?.notes ?? '');

  // Auto-focus the English field when the modal opens. The timeout
  // matches the slide-up transition so the caret lands after the
  // sheet finishes animating.
  useEffect(() => {
    const id = window.setTimeout(() => {
      document.getElementById('word-form-english')?.focus();
    }, 280);
    return () => window.clearTimeout(id);
  }, []);

  const submit = async (): Promise<void> => {
    const en = english.trim();
    const tr = turkish.trim();
    if (!en || !tr) {
      show(t('fill_required'));
      return;
    }
    if (editing) {
      await updateWord(editing.id, {
        english: en,
        turkish: tr,
        exampleSentence: example.trim(),
        notes: notes.trim(),
      });
      show(t('word_updated'));
    } else {
      await addWord({
        english: en,
        turkish: tr,
        exampleSentence: example.trim(),
        notes: notes.trim(),
      });
      show(t('word_saved'));
    }
    close();
  };

  return (
    <form
      className="word-form"
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      <div className="form-group">
        <label htmlFor="word-form-english" className="form-label">
          {t('english')} *
        </label>
        <input
          id="word-form-english"
          className="form-input"
          type="text"
          value={english}
          onChange={(e) => setEnglish(e.target.value)}
          autoComplete="off"
        />
      </div>
      <div className="form-group">
        <label htmlFor="word-form-turkish" className="form-label">
          {t('turkish')} *
        </label>
        <input
          id="word-form-turkish"
          className="form-input"
          type="text"
          value={turkish}
          onChange={(e) => setTurkish(e.target.value)}
          autoComplete="off"
        />
      </div>
      <div className="form-group">
        <label htmlFor="word-form-example" className="form-label">
          {t('example')}
        </label>
        <textarea
          id="word-form-example"
          className="form-textarea"
          value={example}
          onChange={(e) => setExample(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="word-form-notes" className="form-label">
          {t('notes')}
        </label>
        <textarea
          id="word-form-notes"
          className="form-textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary btn-block btn-lg">
        {t('save')}
      </button>
    </form>
  );
}
