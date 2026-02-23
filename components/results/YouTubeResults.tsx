'use client';

import CopyButton from '../CopyButton';
import { ResultCard, TextField, OptionList, TagCloud } from '../ResultCard';
import type { YouTubeResults as YouTubeResultsType } from '@/lib/types';

interface Props {
  data: YouTubeResultsType;
}

export default function YouTubeResults({ data }: Props) {
  const chaptersText = data.chapters.map((c) => `${c.time} ${c.title}`).join('\n');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <OptionList label="Episode Titles (pick your favorite)" items={data.titles} numbered />

      <ResultCard title="Description" accent="#ff0000">
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5a5a72' }}>
              First Line (shown before &quot;Show more&quot;)
            </span>
            <CopyButton text={data.description.firstLine} />
          </div>
          <div style={{
            background: '#1c1c28',
            border: '1px solid rgba(255,0,0,0.2)',
            borderRadius: '8px',
            padding: '10px 12px',
            fontSize: '13px',
            color: '#e0e0ee',
            fontWeight: 500,
          }}>
            {data.description.firstLine}
          </div>
        </div>
        <TextField label="Full Description" value={data.description.full} />
      </ResultCard>

      <TagCloud label="YouTube Tags" tags={data.tags} />

      <ResultCard title="Chapters" accent="#ff0000">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
          <CopyButton text={chaptersText} label="Copy All Chapters" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {data.chapters.map((chapter, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '6px 10px', background: '#1c1c28', borderRadius: '6px' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#6c5ce7', flexShrink: 0, fontWeight: 700 }}>
                {chapter.time}
              </span>
              <span style={{ fontSize: '13px', color: '#e0e0ee' }}>{chapter.title}</span>
            </div>
          ))}
        </div>
      </ResultCard>

      <ResultCard title="Thumbnail Briefs" accent="#f39c12">
        {data.thumbnailBriefs.map((brief, i) => (
          <div key={i} style={{
            background: '#1c1c28',
            border: '1px solid #2a2a3a',
            borderRadius: '10px',
            padding: '14px',
            marginBottom: i < data.thumbnailBriefs.length - 1 ? '10px' : 0,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#f39c12',
                background: 'rgba(243,156,18,0.1)',
                padding: '3px 8px',
                borderRadius: '5px',
                border: '1px solid rgba(243,156,18,0.2)',
              }}>
                Concept {i + 1}: {brief.conceptName}
              </span>
              <CopyButton text={brief.midjourneyPrompt} label="Copy MJ Prompt" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
              {[
                { label: 'Concept', value: brief.concept },
                { label: 'Emotion Target', value: brief.emotionTarget },
                { label: 'Background', value: brief.background },
                { label: 'Foreground', value: brief.foreground },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: '#111118', borderRadius: '6px', padding: '8px 10px' }}>
                  <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5a5a72', marginBottom: '4px' }}>{label}</div>
                  <div style={{ fontSize: '12px', color: '#c0c0d8' }}>{value}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#111118', borderRadius: '6px', padding: '10px', marginBottom: '8px' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5a5a72', marginBottom: '8px' }}>Text Overlay</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '16px', fontWeight: 900, color: '#f0f0f8', letterSpacing: '-0.02em' }}>{brief.textOverlay.mainText}</span>
                {brief.textOverlay.subText && (
                  <span style={{ fontSize: '12px', color: '#9090aa', alignSelf: 'flex-end' }}>{brief.textOverlay.subText}</span>
                )}
              </div>
              <div style={{ marginTop: '6px', fontSize: '11px', color: '#5a5a72' }}>
                Placement: {brief.textOverlay.placement} · Style: {brief.textOverlay.style}
              </div>
            </div>

            {brief.colorPalette && brief.colorPalette.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', color: '#5a5a72' }}>Palette:</span>
                {brief.colorPalette.map((color, ci) => (
                  <div key={ci} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{
                      width: '16px', height: '16px', borderRadius: '4px',
                      background: color.startsWith('#') ? color : '#333',
                      border: '1px solid #2a2a3a',
                    }} />
                    <span style={{ fontSize: '11px', color: '#9090aa', fontFamily: 'monospace' }}>{color}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ background: '#0f0f17', borderRadius: '6px', padding: '8px 10px' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5a5a72', marginBottom: '4px' }}>Midjourney Prompt</div>
              <p style={{ fontSize: '11px', color: '#9090aa', lineHeight: '1.5', fontFamily: 'monospace' }}>{brief.midjourneyPrompt}</p>
            </div>

            {brief.designerNotes && (
              <div style={{ marginTop: '8px', fontSize: '11px', color: '#5a5a72', fontStyle: 'italic' }}>
                💡 {brief.designerNotes}
              </div>
            )}
          </div>
        ))}
      </ResultCard>

      <TextField label="End Screen CTA Script" value={data.endScreenCTA} />
    </div>
  );
}
