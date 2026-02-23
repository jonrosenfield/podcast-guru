'use client';

import { useState, useEffect } from 'react';
import TranscriptInput from '@/components/TranscriptInput';
import ShortClipManager from '@/components/ShortClipManager';
import YouTubeResults from '@/components/results/YouTubeResults';
import PodcastResults from '@/components/results/PodcastResults';
import SocialResults from '@/components/results/SocialResults';
import ThumbnailResults from '@/components/results/ThumbnailResults';
import { loadHistory, saveToHistory, deleteFromHistory, renameHistoryEntry } from '@/lib/history';
import type { HistoryEntry } from '@/lib/history';
import type { ShortClip, YouTubeResults as YouTubeResultsType, PodcastResults as PodcastResultsType, SocialClipResult, ThumbnailResults as ThumbnailResultsType } from '@/lib/types';

type Platform = 'youtube' | 'podcast' | 'social' | 'thumbnail';

type Results = {
  youtube?: YouTubeResultsType;
  podcast?: PodcastResultsType;
  social?: SocialClipResult[];
  thumbnail?: ThumbnailResultsType;
};

const PLATFORM_CONFIG: { id: Platform; label: string; icon: string; color: string; description: string }[] = [
  { id: 'youtube',   label: 'YouTube',        icon: '▶',  color: '#ff0000', description: 'Titles, description, tags, chapters, end screen' },
  { id: 'thumbnail', label: 'Thumbnails',      icon: '🖼', color: '#f39c12', description: 'Visual briefs + Midjourney prompts' },
  { id: 'podcast',   label: 'Spotify / Apple', icon: '🎧', color: '#1db954', description: 'Episode titles, descriptions, show notes' },
  { id: 'social',    label: 'Social / Clips',  icon: '📱', color: '#e1306c', description: 'Captions, hashtags, text overlays per clip' },
];

const PLATFORM_COLORS: Record<string, string> = {
  youtube: '#ff0000', thumbnail: '#f39c12', podcast: '#1db954', social: '#e1306c',
};

const PLATFORM_LABELS: Record<string, string> = {
  youtube: 'YouTube', thumbnail: 'Thumbnails', podcast: 'Spotify / Apple', social: 'Social / Clips',
};

const PLATFORM_ICONS: Record<string, string> = {
  youtube: '▶', thumbnail: '🖼', podcast: '🎧', social: '📱',
};

const INPUT_TABS = [
  { id: 'episode', label: 'Episode Transcript' },
  { id: 'clips',   label: 'Short Clips / Reels' },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Home() {
  const [episodeNumber, setEpisodeNumber]         = useState('');
  const [episodeTopic, setEpisodeTopic]           = useState('');
  const [episodeTranscript, setEpisodeTranscript] = useState('');
  const [shortClips, setShortClips]               = useState<ShortClip[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['youtube', 'podcast']);
  const [activeInputTab, setActiveInputTab]       = useState<'episode' | 'clips'>('episode');

  const [results, setResults]                   = useState<Results | null>(null);
  const [activePlatform, setActivePlatform]     = useState<Platform>('youtube');
  const [loading, setLoading]                   = useState(false);
  const [loadingPlatforms, setLoadingPlatforms] = useState<Set<Platform>>(new Set());
  const [error, setError]                       = useState<string | null>(null);

  const [history, setHistory]               = useState<HistoryEntry[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [showHistory, setShowHistory]       = useState(false);
  const [editingId, setEditingId]           = useState<string | null>(null);
  const [editingValue, setEditingValue]     = useState('');

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const togglePlatform = (p: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setResults(entry.results);
    setActiveHistoryId(entry.id);
    const firstPlatform = (Object.keys(entry.results)[0] as Platform) ?? 'youtube';
    setActivePlatform(firstPlatform);
    setError(null);
    setShowHistory(false);
  };

  const startEditing = (e: React.MouseEvent, entry: HistoryEntry) => {
    e.stopPropagation();
    setEditingId(entry.id);
    setEditingValue(entry.customTitle ?? (entry.episodeNumber
      ? `Ep. ${entry.episodeNumber}${entry.episodeTopic ? ' · ' + entry.episodeTopic : ''}`
      : entry.episodeTopic || 'Untitled Episode'));
  };

  const commitRename = (id: string) => {
    const updated = renameHistoryEntry(id, editingValue);
    setHistory(updated);
    setEditingId(null);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = deleteFromHistory(id);
    setHistory(updated);
    if (activeHistoryId === id) {
      setResults(null);
      setActiveHistoryId(null);
    }
  };

  const handleGenerate = async () => {
    if (!episodeTranscript.trim()) {
      setError('Please paste your episode transcript first.');
      return;
    }
    if (episodeTranscript.trim().split(/\s+/).length < 50) {
      setError('Transcript is too short — paste at least a few paragraphs.');
      return;
    }
    if (selectedPlatforms.length === 0) {
      setError('Select at least one platform.');
      return;
    }
    if (selectedPlatforms.includes('social') && shortClips.filter((c) => c.transcript.trim()).length === 0) {
      setError("You selected Social/Clips but haven't added any clip transcripts.");
      return;
    }

    setError(null);
    setLoading(true);
    setResults(null);
    setActiveHistoryId(null);
    setLoadingPlatforms(new Set(selectedPlatforms));
    setActivePlatform(selectedPlatforms[0]);

    const newResults: Results = {};

    await Promise.all(
      selectedPlatforms.map(async (platform) => {
        try {
          const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              platform,
              episodeNumber,
              episodeTopic,
              episodeTranscript,
              shortClips: shortClips.filter((c) => c.transcript.trim()),
            }),
          });

          const data = await res.json();
          if (!res.ok || data.error) throw new Error(data.error ?? `Failed to generate ${platform}`);
          newResults[platform] = data.result;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Unknown error';
          setError(`Error generating ${PLATFORM_LABELS[platform]}: ${msg}`);
        } finally {
          setLoadingPlatforms((prev) => {
            const next = new Set(prev);
            next.delete(platform);
            return next;
          });
        }
      })
    );

    setResults(newResults);
    setLoading(false);

    // Auto-save to history
    if (Object.keys(newResults).length > 0) {
      const entry = saveToHistory({
        episodeNumber,
        episodeTopic,
        platforms: Object.keys(newResults),
        results: newResults,
      });
      setHistory(loadHistory());
      setActiveHistoryId(entry.id);
    }
  };

  const hasResults = results && Object.keys(results).length > 0;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      {/* ── Header ── */}
      <header style={{
        borderBottom: '1px solid #1a1a26',
        padding: '0 24px',
        height: '58px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(10,10,15,0.97)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #6c5ce7, #e1306c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
          }}>🎙</div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.02em', color: '#f0f0f8' }}>
              Podcast Guru
            </div>
            <div style={{ fontSize: '10px', color: '#5a5a72', fontWeight: 500, letterSpacing: '0.04em' }}>
              F YOUR FEELINGS — MARKETING STUDIO
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setShowHistory((v) => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '11px', padding: '4px 10px',
              background: showHistory ? 'rgba(108,92,231,0.15)' : 'rgba(108,92,231,0.08)',
              border: `1px solid ${showHistory ? 'rgba(108,92,231,0.5)' : 'rgba(108,92,231,0.2)'}`,
              borderRadius: '20px', color: '#6c5ce7', fontWeight: 600, cursor: 'pointer',
            }}
          >
            🕐 History {history.length > 0 && `(${history.length})`}
          </button>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '11px', padding: '4px 10px',
            background: 'rgba(29,185,84,0.08)', border: '1px solid rgba(29,185,84,0.2)',
            borderRadius: '20px', color: '#1db954', fontWeight: 600,
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1db954', display: 'inline-block' }} />
            Powered by Claude AI
          </div>
          <div style={{
            fontSize: '11px', padding: '4px 10px',
            background: 'rgba(108,92,231,0.1)', border: '1px solid rgba(108,92,231,0.2)',
            borderRadius: '20px', color: '#6c5ce7', fontWeight: 600,
          }}>
            @fyourfeelingspod
          </div>
        </div>
      </header>

      {/* ── History Panel (slide down from header) ── */}
      {showHistory && (
        <div style={{
          position: 'fixed', top: '58px', right: 0, width: '360px',
          height: 'calc(100vh - 58px)', background: '#0e0e18',
          borderLeft: '1px solid #1a1a26', zIndex: 90,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.4)',
        }}>
          <div style={{
            padding: '16px', borderBottom: '1px solid #1a1a26',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#f0f0f8' }}>Episode History</div>
              <div style={{ fontSize: '11px', color: '#5a5a72', marginTop: '2px' }}>
                {history.length === 0 ? 'No episodes yet' : `${history.length} episode${history.length !== 1 ? 's' : ''} saved`}
              </div>
            </div>
            <button onClick={() => setShowHistory(false)} style={{
              background: 'none', border: 'none', color: '#5a5a72',
              cursor: 'pointer', fontSize: '18px', lineHeight: 1, padding: '4px',
            }}>×</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
            {history.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '40px 20px',
                color: '#3a3a4a', fontSize: '13px', lineHeight: '1.6',
              }}>
                No history yet.<br />Generate your first episode to see it here.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {history.map((entry) => {
                  const isActive = activeHistoryId === entry.id;
                  return (
                    <button
                      key={entry.id}
                      onClick={() => loadHistoryEntry(entry)}
                      style={{
                        width: '100%', textAlign: 'left', padding: '12px 14px',
                        background: isActive ? 'rgba(108,92,231,0.1)' : '#16161f',
                        border: `1px solid ${isActive ? 'rgba(108,92,231,0.4)' : '#2a2a3a'}`,
                        borderRadius: '10px', cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {editingId === entry.id ? (
                            <input
                              autoFocus
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              onBlur={() => commitRename(entry.id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') commitRename(entry.id);
                                if (e.key === 'Escape') setEditingId(null);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                width: '100%', background: '#1c1c28',
                                border: '1px solid #6c5ce7', borderRadius: '6px',
                                padding: '4px 8px', fontSize: '13px', fontWeight: 600,
                                color: '#f0f0f8', outline: 'none', marginBottom: '4px',
                              }}
                            />
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                              <div style={{ fontSize: '13px', fontWeight: 600, color: isActive ? '#a78bfa' : '#e0e0ee', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {entry.customTitle ?? (
                                  <>
                                    {entry.episodeNumber ? `Ep. ${entry.episodeNumber}` : ''}
                                    {entry.episodeNumber && entry.episodeTopic ? ' · ' : ''}
                                    {entry.episodeTopic || (!entry.episodeNumber ? 'Untitled Episode' : '')}
                                  </>
                                )}
                              </div>
                              <button
                                onClick={(e) => startEditing(e, entry)}
                                title="Rename"
                                style={{
                                  background: 'none', border: 'none', color: '#3a3a4a',
                                  cursor: 'pointer', fontSize: '11px', padding: '0 2px',
                                  flexShrink: 0, lineHeight: 1, transition: 'color 0.15s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#6c5ce7')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#3a3a4a')}
                              >
                                ✎
                              </button>
                            </div>
                          )}
                          <div style={{ fontSize: '11px', color: '#5a5a72', marginBottom: '8px' }}>
                            {formatDate(entry.date)}
                          </div>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {entry.platforms.map((p) => (
                              <span key={p} style={{
                                fontSize: '10px', padding: '2px 7px',
                                background: `${PLATFORM_COLORS[p]}15`,
                                border: `1px solid ${PLATFORM_COLORS[p]}30`,
                                borderRadius: '10px', color: PLATFORM_COLORS[p],
                                fontWeight: 600,
                              }}>
                                {PLATFORM_ICONS[p]} {PLATFORM_LABELS[p]}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleDelete(e, entry.id)}
                          title="Delete"
                          style={{
                            background: 'none', border: 'none',
                            color: '#3a3a4a', cursor: 'pointer',
                            fontSize: '14px', padding: '2px 4px',
                            flexShrink: 0, lineHeight: 1,
                            transition: 'color 0.15s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#ff6b6b')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#3a3a4a')}
                        >
                          🗑
                        </button>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Main layout ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '420px 1fr',
        height: 'calc(100vh - 58px)',
        overflow: 'hidden',
      }}>
        {/* ────── LEFT PANEL ────── */}
        <div style={{ borderRight: '1px solid #1a1a26', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Platform selector */}
          <div style={{ padding: '16px', borderBottom: '1px solid #1a1a26' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5a5a72', marginBottom: '10px' }}>
              Generate Content For
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {PLATFORM_CONFIG.map((p) => {
                const isSel = selectedPlatforms.includes(p.id);
                return (
                  <button key={p.id} onClick={() => togglePlatform(p.id)} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 12px', borderRadius: '8px',
                    border: `1px solid ${isSel ? p.color + '50' : '#2a2a3a'}`,
                    background: isSel ? `${p.color}0d` : 'transparent',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', width: '100%',
                  }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '6px',
                      background: isSel ? `${p.color}25` : '#1c1c28',
                      border: `1px solid ${isSel ? p.color + '40' : '#2a2a3a'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', flexShrink: 0,
                    }}>{p.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: isSel ? '#f0f0f8' : '#9090aa' }}>{p.label}</div>
                      <div style={{ fontSize: '10px', color: '#5a5a72', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</div>
                    </div>
                    <div style={{
                      width: '16px', height: '16px', borderRadius: '4px',
                      border: `2px solid ${isSel ? p.color : '#3a3a4a'}`,
                      background: isSel ? p.color : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'all 0.15s',
                    }}>
                      {isSel && <span style={{ color: '#fff', fontSize: '10px', lineHeight: 1 }}>✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #1a1a26' }}>
            {INPUT_TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveInputTab(tab.id as 'episode' | 'clips')} style={{
                flex: 1, padding: '10px', fontSize: '12px', fontWeight: 600,
                color: activeInputTab === tab.id ? '#f0f0f8' : '#5a5a72',
                background: 'none', border: 'none',
                borderBottom: `2px solid ${activeInputTab === tab.id ? '#6c5ce7' : 'transparent'}`,
                cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '0.03em',
              }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Scrollable input */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {activeInputTab === 'episode' ? (
              <TranscriptInput
                episodeNumber={episodeNumber}
                episodeTopic={episodeTopic}
                transcript={episodeTranscript}
                onEpisodeNumberChange={setEpisodeNumber}
                onEpisodeTopicChange={setEpisodeTopic}
                onTranscriptChange={setEpisodeTranscript}
              />
            ) : (
              <ShortClipManager clips={shortClips} onChange={setShortClips} />
            )}
          </div>

          {/* Generate button */}
          <div style={{ padding: '16px', borderTop: '1px solid #1a1a26' }}>
            {error && (
              <div style={{
                marginBottom: '10px', padding: '10px 12px',
                background: 'rgba(255,50,50,0.08)', border: '1px solid rgba(255,50,50,0.2)',
                borderRadius: '8px', fontSize: '12px', color: '#ff6b6b', lineHeight: '1.5',
              }}>⚠ {error}</div>
            )}
            <button onClick={handleGenerate} disabled={loading} style={{
              width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
              background: loading ? 'rgba(108,92,231,0.4)' : 'linear-gradient(135deg, #6c5ce7, #8b5cf6)',
              color: '#fff', fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.04em', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
              {loading ? (
                <>
                  <span style={{
                    width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff', borderRadius: '50%',
                    display: 'inline-block', animation: 'spin 0.8s linear infinite',
                  }} />
                  Generating...
                </>
              ) : '✦ Generate Content'}
            </button>
            <div style={{ marginTop: '8px', textAlign: 'center', fontSize: '11px', color: '#5a5a72' }}>
              {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''} · auto-saved to history
            </div>
          </div>
        </div>

        {/* ────── RIGHT PANEL ────── */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Empty state */}
          {!hasResults && !loading && (
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '20px', padding: '40px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '56px', lineHeight: 1 }}>🎙</div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#4a4a5a', marginBottom: '8px' }}>
                  Ready to generate
                </div>
                <div style={{ fontSize: '13px', color: '#3a3a4a', lineHeight: '1.7', maxWidth: '400px' }}>
                  Paste your transcript, choose platforms, hit <strong style={{ color: '#6c5ce7' }}>Generate Content</strong>. Results are saved automatically — browse past episodes any time via <strong style={{ color: '#6c5ce7' }}>History</strong>.
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '380px', marginTop: '8px' }}>
                {[
                  { step: '1', text: 'Paste episode transcript + any clip transcripts', color: '#6c5ce7' },
                  { step: '2', text: 'Select which platforms to generate for', color: '#8b5cf6' },
                  { step: '3', text: 'Click Generate Content', color: '#a78bfa' },
                  { step: '4', text: 'Copy fields directly — results auto-save to History', color: '#1db954' },
                ].map(({ step, text, color }) => (
                  <div key={step} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 14px', background: '#16161f',
                    border: '1px solid #2a2a3a', borderRadius: '8px',
                  }}>
                    <span style={{
                      width: '22px', height: '22px', borderRadius: '6px',
                      background: `${color}20`, border: `1px solid ${color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: 700, color, flexShrink: 0,
                    }}>{step}</span>
                    <span style={{ fontSize: '12px', color: '#707088' }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && !hasResults && (
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '40px',
            }}>
              <div style={{ fontSize: '48px', lineHeight: 1 }}>✦</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#9090aa', marginBottom: '6px' }}>
                  Claude is generating your content...
                </div>
                <div style={{ fontSize: '12px', color: '#5a5a72' }}>
                  Using your FYF notebooks to craft platform-optimised assets
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {selectedPlatforms.map((p) => {
                  const isLoading = loadingPlatforms.has(p);
                  const color = PLATFORM_COLORS[p];
                  return (
                    <div key={p} style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '6px 14px', borderRadius: '20px',
                      border: `1px solid ${isLoading ? color + '50' : '#2a2a3a'}`,
                      background: isLoading ? `${color}10` : 'transparent',
                      color: isLoading ? color : '#5a5a72',
                      fontSize: '12px', fontWeight: 600, transition: 'all 0.3s',
                    }}>
                      {isLoading ? (
                        <span style={{
                          width: '10px', height: '10px',
                          border: `1.5px solid ${color}40`, borderTopColor: color,
                          borderRadius: '50%', display: 'inline-block',
                          animation: 'spin 0.8s linear infinite',
                        }} />
                      ) : <span style={{ color: '#1db954' }}>✓</span>}
                      {PLATFORM_LABELS[p]}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Results view */}
          {hasResults && (
            <>
              <div style={{
                display: 'flex', borderBottom: '1px solid #1a1a26',
                padding: '0 20px', background: 'rgba(10,10,15,0.8)', overflowX: 'auto',
              }}>
                {Object.keys(results!).map((key) => {
                  const platform = key as Platform;
                  const color = PLATFORM_COLORS[platform] ?? '#6c5ce7';
                  const isActive = activePlatform === platform;
                  const isStillLoading = loadingPlatforms.has(platform);
                  return (
                    <button key={key} onClick={() => setActivePlatform(platform)} style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '14px 16px', fontSize: '12px', fontWeight: 600,
                      color: isActive ? color : '#5a5a72',
                      background: 'none', border: 'none',
                      borderBottom: `2px solid ${isActive ? color : 'transparent'}`,
                      cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
                    }}>
                      {isStillLoading && (
                        <span style={{
                          width: '10px', height: '10px',
                          border: `1.5px solid ${color}40`, borderTopColor: color,
                          borderRadius: '50%', display: 'inline-block',
                          animation: 'spin 0.8s linear infinite',
                        }} />
                      )}
                      {PLATFORM_LABELS[platform]}
                    </button>
                  );
                })}
                <div style={{ flex: 1 }} />
                {activeHistoryId && (
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    fontSize: '11px', color: '#6c5ce7', padding: '0 12px',
                    gap: '4px',
                  }}>
                    🕐 From history
                  </div>
                )}
                <button onClick={() => { setResults(null); setActiveHistoryId(null); setError(null); }} style={{
                  padding: '12px 14px', fontSize: '11px', color: '#5a5a72',
                  background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600,
                }}>
                  ↺ New
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                {activePlatform === 'youtube'   && results?.youtube   && <YouTubeResults   data={results.youtube} />}
                {activePlatform === 'podcast'   && results?.podcast   && <PodcastResults   data={results.podcast} />}
                {activePlatform === 'social'    && results?.social    && <SocialResults    data={results.social} />}
                {activePlatform === 'thumbnail' && results?.thumbnail && <ThumbnailResults data={results.thumbnail} />}
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        textarea:focus, input:focus {
          border-color: #6c5ce7 !important;
          box-shadow: 0 0 0 2px rgba(108,92,231,0.15);
          outline: none;
        }
        button { transition: opacity 0.15s; }
        button:hover:not(:disabled) { opacity: 0.85; }
      `}</style>
    </div>
  );
}
