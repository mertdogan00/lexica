import type { Word } from '../domain/index.ts';

// WordRepository is the persistence contract for the Word aggregate.
// Application code never talks to IndexedDB directly — it talks to this
// port, and the bootstrap layer binds it to the IndexedDB adapter.

export interface WordRepository {
  getAll(): Promise<readonly Word[]>;
  get(id: string): Promise<Word | null>;
  put(word: Word): Promise<void>;
  delete(id: string): Promise<void>;
  clear(): Promise<void>;
}
