'use client';

import CopyButton from '../CopyButton';
import type { ThumbnailResults as ThumbnailResultsType } from '@/lib/types';

interface Props {
  data: ThumbnailResultsType;
}

export default function ThumbnailResults({ data }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* A/B recommendation */}
      <div style={{
        background: 'rgba(243,156,18,0.06)',
        border: '1px solid rgba(243,156,18,0.2)',
        borderRadius: '10px',
        padding: '12px 16px',
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: '18px', flexShrink: 0 }}>🏆</span>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#f39c12', marginBottom: '4px' }}>
            A/B Test Recommendation
          </div>
          <p style={{ fontSize: '13px', color: '#e0e0ee', lineHeight: '1.5' }}>{data.abTestRecommendation}</p>
        </div>
      </div>

      {/* Avoid list */}
      <div style={{
        background: 'rgba(255,50,50,0.04)',
        border: '1px solid rgba(255,50,50,0.15)',
        borderRadius: '10px',
        padding: '12px 16px',
      }}>
        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ff5555', marginBottom: '8px' }}>
          🚫 Do NOT Do This For This Thumbnail
        </div>
        <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {data.avoidList.map((item, i) => (
            <li key={i} style={{ fontSize: '12px', color: '#c0c0d8', lineHeight: '1.5' }}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Thumbnail concepts */}
      {data.thumbnails.map((thumb, i) => (
        <div
          key={i}
          style={{
            background: '#16161f',
            border: '1px solid #2a2a3a',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid #2a2a3a',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(243,156,18,0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                background: 'rgba(243,156,18,0.15)',
                color: '#f39c12',
                fontSize: '13px',
                fontWeight: 700,
              }}>
                {i + 1}
              </span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#f0f0f8' }}>{thumb.conceptName}</div>
                <div style={{ fontSize: '11px', color: '#5a5a72', marginTop: '1px' }}>{thumb.concept}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{
                fontSize: '11px',
                padding: '3px 8px',
                background: 'rgba(108,92,231,0.1)',
                border: '1px solid rgba(108,92,231,0.2)',
                borderRadius: '5px',
                color: '#6c5ce7',
              }}>
                {thumb.emotionTarget}
              </span>
            </div>
          </div>

          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Visual preview mock */}
            <div style={{
              aspectRatio: '16/9',
              background: thumb.background.includes('#') ? thumb.background : '#111118',
              borderRadius: '8px',
              border: '1px solid #2a2a3a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'center',
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.1))',
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  fontSize: 'clamp(20px, 4vw, 32px)',
                  fontWeight: 900,
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                  marginBottom: '4px',
                }}>
                  {thumb.textOverlay.mainText}
                </div>
                {thumb.textOverlay.subText && (
                  <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                    {thumb.textOverlay.subText}
                  </div>
                )}
              </div>
              <div style={{ position: 'absolute', bottom: '8px', right: '10px', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
                @fyourfeelingspod
              </div>
            </div>

            {/* Details grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { label: 'Background', value: thumb.background },
                { label: 'Foreground', value: thumb.foreground },
                { label: 'Text Placement', value: thumb.textOverlay.placement },
                { label: 'Text Style', value: thumb.textOverlay.style },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: '#111118', borderRadius: '8px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5a5a72', marginBottom: '4px' }}>{label}</div>
                  <div style={{ fontSize: '12px', color: '#c0c0d8', lineHeight: '1.4' }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Color palette */}
            {thumb.colorPalette && thumb.colorPalette.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', color: '#5a5a72', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Palette:</span>
                {thumb.colorPalette.map((color, ci) => (
                  <button
                    key={ci}
                    onClick={() => navigator.clipboard.writeText(color)}
                    title={color}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '5px',
                      background: color.startsWith('#') ? color : '#444',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }} />
                    <span style={{ fontSize: '11px', color: '#9090aa', fontFamily: 'monospace' }}>{color}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Mobile notes */}
            {thumb.mobileNotes && (
              <div style={{ fontSize: '11px', color: '#5a5a72', fontStyle: 'italic', padding: '6px 10px', background: '#111118', borderRadius: '6px' }}>
                📱 {thumb.mobileNotes}
              </div>
            )}

            {/* Midjourney prompt */}
            <div style={{ background: '#0a0a0f', borderRadius: '8px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5a5a72' }}>
                  Midjourney / DALL-E Prompt
                </span>
                <CopyButton text={thumb.midjourneyPrompt} label="Copy Prompt" />
              </div>
              <p style={{ fontSize: '11px', color: '#9090aa', lineHeight: '1.6', fontFamily: 'monospace' }}>
                {thumb.midjourneyPrompt}
              </p>
            </div>

            {/* Designer notes */}
            {thumb.designerNotes && (
              <div style={{ fontSize: '12px', color: '#c0c0d8', padding: '8px 12px', background: 'rgba(108,92,231,0.05)', border: '1px solid rgba(108,92,231,0.15)', borderRadius: '6px' }}>
                💡 {thumb.designerNotes}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
