import { useCallback } from 'react';
import type { Settings, Word } from '../../domain/index.ts';
import { useContainer } from '../di/index.ts';
import { useSettings } from '../settings/index.ts';
import { useWordLibrary } from '../words/index.ts';

// useDataIo owns the import / export flows. JSON format is kept
// backward compatible with the original prototype so users can load
// older exports without any conversion step.

export type ImportMode = 'overwrite' | 'merge';

export interface ExportPayload {
  version: number;
  settings: Settings;
  words: readonly Word[];
  exportDate: string;
}

export interface ImportSummary {
  imported: number;
  skipped: number;
  mode: ImportMode;
}

export interface DataIoApi {
  exportJson: () => Promise<void>;
  parseImport: (raw: string) => ExportPayload | null;
  applyImport: (payload: ExportPayload, mode: ImportMode) => Promise<ImportSummary>;
}

export function useDataIo(): DataIoApi {
  const container = useContainer();
  const { settings, update } = useSettings();
  const { reload } = useWordLibrary();

  const exportJson = useCallback(async (): Promise<void> => {
    const words = await container.wordRepository.getAll();
    const payload: ExportPayload = {
      version: 1,
      settings,
      words,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0] ?? '';
    anchor.href = url;
    anchor.download = `lexica-backup-${dateStr}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }, [container, settings]);

  const parseImport = useCallback(
    (raw: string): ExportPayload | null => {
      try {
        const parsed = JSON.parse(raw) as Partial<ExportPayload>;
        if (!parsed.words || !Array.isArray(parsed.words)) return null;
        return {
          version: typeof parsed.version === 'number' ? parsed.version : 1,
          settings: parsed.settings ?? settings,
          words: parsed.words,
          exportDate: parsed.exportDate ?? new Date().toISOString(),
        };
      } catch {
        return null;
      }
    },
    [settings],
  );

  const applyImport = useCallback(
    async (payload: ExportPayload, mode: ImportMode): Promise<ImportSummary> => {
      if (mode === 'overwrite') {
        await container.wordRepository.clear();
      }

      let imported = 0;
      let skipped = 0;

      for (const raw of payload.words) {
        if (!raw.id || !raw.english || !raw.turkish) {
          skipped += 1;
          continue;
        }

        if (mode === 'merge') {
          const existing = await container.wordRepository.get(raw.id);
          if (existing) {
            skipped += 1;
            continue;
          }
        }

        // Normalise by tolerating unknown fields from older exports
        // (e.g. easeFactor from the prototype) and falling back to
        // sensible defaults for any missing optional fields.
        const now = new Date().toISOString();
        const normalised: Word = {
          id: raw.id,
          english: raw.english,
          turkish: raw.turkish,
          exampleSentence: raw.exampleSentence ?? '',
          notes: raw.notes ?? '',
          level: typeof raw.level === 'number' ? raw.level : 0,
          intervalDays: typeof raw.intervalDays === 'number' ? raw.intervalDays : 0,
          repetitionCount: typeof raw.repetitionCount === 'number' ? raw.repetitionCount : 0,
          status: raw.status ?? 'new',
          createdAt: raw.createdAt ?? now,
          updatedAt: raw.updatedAt ?? now,
          lastReviewedAt: raw.lastReviewedAt ?? null,
          nextReviewDate: raw.nextReviewDate ?? null,
        };
        await container.wordRepository.put(normalised);
        imported += 1;
      }

      if (mode === 'overwrite' && payload.settings) {
        update(payload.settings);
      }

      await reload();
      return { imported, skipped, mode };
    },
    [container, update, reload],
  );

  return { exportJson, parseImport, applyImport };
}
