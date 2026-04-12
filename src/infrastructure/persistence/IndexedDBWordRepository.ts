import type { Word } from '../../core/domain/index.ts';
import type { WordRepository } from '../../core/ports/index.ts';

// IndexedDBWordRepository is the concrete persistence adapter for the
// Word aggregate. It owns database opening, schema migration, and wraps
// the raw IndexedDB request API in promises so the application layer can
// await it comfortably.
//
// Schema: database "LexicaDB" at version 1 with a single object store
// "words" keyed by id, plus indexes on status, nextReviewDate and english.
// These mirror the prototype's schema exactly so existing user data on
// older tabs remains readable.

const DB_NAME = 'LexicaDB';
const DB_VERSION = 1;
const STORE = 'words';

export class IndexedDBWordRepository implements WordRepository {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private open(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;
    this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          const store = db.createObjectStore(STORE, { keyPath: 'id' });
          store.createIndex('status', 'status');
          store.createIndex('nextReviewDate', 'nextReviewDate');
          store.createIndex('english', 'english');
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(new Error('Failed to open LexicaDB'));
    });
    return this.dbPromise;
  }

  async getAll(): Promise<readonly Word[]> {
    const db = await this.open();
    return new Promise<readonly Word[]>((resolve) => {
      const tx = db.transaction(STORE, 'readonly');
      const store = tx.objectStore(STORE);
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result as Word[]) ?? []);
      req.onerror = () => resolve([]);
    });
  }

  async get(id: string): Promise<Word | null> {
    const db = await this.open();
    return new Promise<Word | null>((resolve) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(id);
      req.onsuccess = () => resolve((req.result as Word | undefined) ?? null);
      req.onerror = () => resolve(null);
    });
  }

  async put(word: Word): Promise<void> {
    const db = await this.open();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(word);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(new Error('Failed to put word'));
    });
  }

  async delete(id: string): Promise<void> {
    const db = await this.open();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(new Error('Failed to delete word'));
    });
  }

  async clear(): Promise<void> {
    const db = await this.open();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(new Error('Failed to clear words'));
    });
  }
}
