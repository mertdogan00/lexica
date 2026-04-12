import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { NewWordInput, Word } from '../../domain/index.ts';
import { createNewWord } from '../../domain/index.ts';
import { genId, todayStr } from '../../../shared/index.ts';
import { useContainer } from '../di/index.ts';

// WordLibrary is the reactive source for the word list. It is exposed
// through a React context so that every page (dashboard stats, words
// list, review session) observes the same cache and stays in sync when
// one page mutates it. The provider owns the cache; components read via
// useWordLibrary().

export interface WordLibraryApi {
  words: readonly Word[];
  loading: boolean;
  reload: () => Promise<void>;
  addWord: (input: Omit<NewWordInput, 'id'>) => Promise<Word>;
  updateWord: (
    id: string,
    patch: Pick<Word, 'english' | 'turkish' | 'exampleSentence' | 'notes'>,
  ) => Promise<void>;
  deleteWord: (id: string) => Promise<void>;
  putRaw: (word: Word) => Promise<void>;
}

const WordLibraryContext = createContext<WordLibraryApi | null>(null);

export function WordLibraryProvider({ children }: { children: ReactNode }): ReactNode {
  const container = useContainer();
  const [words, setWords] = useState<readonly Word[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const reload = useCallback(async (): Promise<void> => {
    setLoading(true);
    const next = await container.wordRepository.getAll();
    setWords(next);
    setLoading(false);
  }, [container]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const addWord = useCallback(
    async (input: Omit<NewWordInput, 'id'>): Promise<Word> => {
      const word = createNewWord(
        { ...input, id: genId() },
        { nowIso: new Date().toISOString(), todayYmd: todayStr() },
      );
      await container.wordRepository.put(word);
      setWords((prev) => [...prev, word]);
      return word;
    },
    [container],
  );

  const updateWord = useCallback(
    async (
      id: string,
      patch: Pick<Word, 'english' | 'turkish' | 'exampleSentence' | 'notes'>,
    ): Promise<void> => {
      const existing = await container.wordRepository.get(id);
      if (!existing) return;
      const next: Word = {
        ...existing,
        ...patch,
        updatedAt: new Date().toISOString(),
      };
      await container.wordRepository.put(next);
      setWords((prev) => prev.map((w) => (w.id === id ? next : w)));
    },
    [container],
  );

  const deleteWord = useCallback(
    async (id: string): Promise<void> => {
      await container.wordRepository.delete(id);
      setWords((prev) => prev.filter((w) => w.id !== id));
    },
    [container],
  );

  // putRaw lets the review flow write a word back after scheduleNext
  // has advanced its SRS state, without requiring the scheduler to
  // understand the public "patch" shape of updateWord.
  const putRaw = useCallback(
    async (word: Word): Promise<void> => {
      await container.wordRepository.put(word);
      setWords((prev) => {
        const exists = prev.some((w) => w.id === word.id);
        return exists ? prev.map((w) => (w.id === word.id ? word : w)) : [...prev, word];
      });
    },
    [container],
  );

  const api = useMemo<WordLibraryApi>(
    () => ({ words, loading, reload, addWord, updateWord, deleteWord, putRaw }),
    [words, loading, reload, addWord, updateWord, deleteWord, putRaw],
  );

  return <WordLibraryContext.Provider value={api}>{children}</WordLibraryContext.Provider>;
}

export function useWordLibrary(): WordLibraryApi {
  const ctx = useContext(WordLibraryContext);
  if (!ctx) throw new Error('useWordLibrary must be called inside <WordLibraryProvider>');
  return ctx;
}
