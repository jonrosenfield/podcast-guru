'use client';

import CopyButton from '../CopyButton';
import { ResultCard, TextField, OptionList, TagCloud } from '../ResultCard';
import type { PodcastResults as PodcastResultsType } from '@/lib/types';

interface Props {
  data: PodcastResultsType;
}

export default function PodcastResults({ data }: Props) {
  const showNotesText = data.showNotesHighlights
    .map((h) => `${h.timestamp} ${h.highlight}`)
    .join('\n');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <OptionList label="Episode Titles" items={data.episodeTitles} numbered />

      <ResultCard title="Spotify" accent="#1db954">
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5a5a72' }}>
              Preview Line
            </span>
            <CopyButton text={data.descriptions.spotifyFirstLine} />
          </div>
          <div style={{
            background: '#1c1c28',
            border: '1px solid rgba(29,185,84,0.2)',
            borderRadius: '8px',
            padding: '10px 12px',
            fontSize: '13px',
            color: '#e0e0ee',
          }}>
            {data.descriptions.spotifyFirstLine}
          </div>
        </div>
      </ResultCard>

      <ResultCard title="Apple Podcasts" accent="#fc3c44">
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5a5a72' }}>
              Preview Line
            </span>
            <CopyButton text={data.descriptions.appleFirstLine} />
          </div>
          <div style={{
            background: '#1c1c28',
            border: '1px solid rgba(252,60,68,0.2)',
            borderRadius: '8px',
            padding: '10px 12px',
            fontSize: '13px',
            color: '#e0e0ee',
          }}>
            {data.descriptions.appleFirstLine}
          </div>
        </div>
      </ResultCard>

      <ResultCard title="Episode Descriptions" accent="#9090aa">
        <TextField label="Short Description (80-100 words)" value={data.descriptions.short} />
        <TextField label="Full Description (200-250 words)" value={data.descriptions.long} />
      </ResultCard>

      <TagCloud label="Search Keywords" tags={data.keywords} />

      <ResultCard title="Categories & Details" accent="#9090aa">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '12px' }}>
          {[
            { label: 'Primary Category', value: data.categories.primary },
            { label: 'Secondary Category', value: data.categories.secondary },
            { label: 'Episode Type', value: data.episodeType },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: '#1c1c28', borderRadius: '8px', padding: '10px 12px' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5a5a72', marginBottom: '4px' }}>{label}</div>
              <div style={{ fontSize: '13px', color: '#e0e0ee' }}>{value}</div>
            </div>
          ))}
        </div>
        {data.contentWarnings && (
          <div style={{ fontSize: '12px', color: '#f39c12', padding: '8px 12px', background: 'rgba(243,156,18,0.05)', border: '1px solid rgba(243,156,18,0.15)', borderRadius: '6px' }}>
            ⚠ {data.contentWarnings}
          </div>
        )}
      </ResultCard>

      <ResultCard title="Show Notes Highlights" accent="#9090aa">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
          <CopyButton text={showNotesText} label="Copy All" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {data.showNotesHighlights.map((highlight, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '8px 10px', background: '#1c1c28', borderRadius: '6px' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#6c5ce7', flexShrink: 0, fontWeight: 700, marginTop: '1px' }}>
                {highlight.timestamp}
              </span>
              <span style={{ fontSize: '13px', color: '#e0e0ee', lineHeight: '1.5' }}>{highlight.highlight}</span>
            </div>
          ))}
        </div>
      </ResultCard>
    </div>
  );
}
