import { Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Word } from '../../../core/domain/index.ts';
import { useModal, useTranslation, useWordLibrary } from '../../../core/application/index.ts';
import { todayStr } from '../../../shared/index.ts';
import { WordCard } from './WordCard.tsx';
import { WordDetailModal } from './WordDetailModal.tsx';
import { WordFormModal } from './WordFormModal.tsx';

// Words is the list page: search, filter chips, list of word cards,
// and an empty state with a "add first" CTA. All mutations go through
// the modal host via the WordFormModal / WordDetailModal components.

type FilterId = 'all' | 'new' | 'learning' | 'mastered' | 'overdue';

const FILTERS: readonly {
  id: FilterId;
  labelKey: 'all' | 'new_w' | 'learning' | 'mastered' | 'filter_overdue';
}[] = [
  { id: 'all', labelKey: 'all' },
  { id: 'new', labelKey: 'new_w' },
  { id: 'learning', labelKey: 'learning' },
  { id: 'mastered', labelKey: 'mastered' },
  { id: 'overdue', labelKey: 'filter_overdue' },
];

export function Words(): React.ReactNode {
  const { t } = useTranslation();
  const { words } = useWordLibrary();
  const { open } = useModal();

  const [query, setQuery] = useState<string>('');
  const [filter, setFilter] = useState<FilterId>('all');

  const filtered = useMemo<readonly Word[]>(() => {
    const today = todayStr();
    let list = [...words];

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (w) => w.english.toLowerCase().includes(q) || w.turkish.toLowerCase().includes(q),
      );
    }

    switch (filter) {
      case 'new':
        list = list.filter((w) => w.status === 'new');
        break;
      case 'learning':
        list = list.filter((w) => w.status === 'learning');
        break;
      case 'mastered':
        list = list.filter((w) => w.status === 'mastered');
        break;
      case 'overdue':
        list = list.filter((w) => w.nextReviewDate !== null && w.nextReviewDate < today);
        break;
      case 'all':
      default:
        break;
    }

    list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return list;
  }, [words, query, filter]);

  const openDetail = (word: Word): void => {
    open({ title: t('word_detail') }, <WordDetailModal word={word} />);
  };

  const openAdd = (): void => {
    open({ title: t('add_word') }, <WordFormModal />);
  };

  return (
    <section className="page">
      <div className="search-bar">
        <Search size={18} aria-hidden="true" />
        <input
          type="text"
          placeholder={t('search_placeholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="filter-row">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`filter-chip${filter === f.id ? ' active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {t(f.labelKey)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📖</div>
          <div className="empty-title">{t('no_words')}</div>
          <div className="empty-desc">{t('no_words_desc')}</div>
          <button type="button" className="btn btn-primary" onClick={openAdd}>
            <Plus size={16} />
            {t('add_first')}
          </button>
        </div>
      ) : (
        <div className="word-list">
          {filtered.map((word) => (
            <WordCard key={word.id} word={word} onOpen={openDetail} />
          ))}
        </div>
      )}
    </section>
  );
}
