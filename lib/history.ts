import type { YouTubeResults, PodcastResults, SocialClipResult, ThumbnailResults } from './types';

export interface HistoryEntry {
  id: string;
  date: string;
  episodeNumber: string;
  episodeTopic: string;
  customTitle?: string;
  platforms: string[];
  results: {
    youtube?: YouTubeResults;
    podcast?: PodcastResults;
    social?: SocialClipResult[];
    thumbnail?: ThumbnailResults;
  };
}

const STORAGE_KEY = 'fyf_history';
const MAX_ENTRIES = 20;

export function loadHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function saveToHistory(entry: Omit<HistoryEntry, 'id' | 'date'>): HistoryEntry {
  const newEntry: HistoryEntry = {
    ...entry,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  };
  const existing = loadHistory();
  const updated = [newEntry, ...existing].slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newEntry;
}

export function deleteFromHistory(id: string): HistoryEntry[] {
  const updated = loadHistory().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function renameHistoryEntry(id: string, customTitle: string): HistoryEntry[] {
  const updated = loadHistory().map((e) =>
    e.id === id ? { ...e, customTitle: customTitle.trim() || undefined } : e
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
