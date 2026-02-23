'use client';

import { useState } from 'react';
import CopyButton from '../CopyButton';
import { TextField, TagCloud } from '../ResultCard';
import type { SocialClipResult } from '@/lib/types';

const PLATFORM_COLORS: Record<string, string> = {
  instagram: '#e1306c',
  youtube: '#ff0000',
  facebook: '#1877f2',
  tiktok: '#69c9d0',
};

const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram Reels',
  youtube: 'YouTube Shorts',
  facebook: 'Facebook',
  tiktok: 'TikTok',
};

interface Props {
  data: SocialClipResult[];
}

export default function SocialResults({ data }: Props) {
  const [activeClip, setActiveClip] = useState(0);
  const [activePlatform, setActivePlatform] = useState<'instagram' | 'youtube' | 'facebook' | 'tiktok'>('instagram');

  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#5a5a72' }}>
        No clips were analyzed. Add short clip transcripts and regenerate.
      </div>
    );
  }

  const clip = data[activeClip];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Clip selector */}
      {data.length > 1 && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {data.map((c, i) => (
            <button
              key={i}
              onClick={() => setActiveClip(i)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: `1px solid ${i === activeClip ? '#6c5ce7' : '#2a2a3a'}`,
                background: i === activeClip ? 'rgba(108,92,231,0.15)' : 'transparent',
                color: i === activeClip ? '#6c5ce7' : '#9090aa',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {c.clipTitle || `Clip ${i + 1}`}
            </button>
          ))}
        </div>
      )}

      {/* Viral hook */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(108,92,231,0.1), rgba(225,48,108,0.1))',
        border: '1px solid rgba(108,92,231,0.3)',
        borderRadius: '12px',
        padding: '14px 16px',
      }}>
        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5a5a72', marginBottom: '8px' }}>
          Viral Hook — Most Shareable Moment
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
          <p style={{ fontSize: '14px', color: '#f0f0f8', lineHeight: '1.6', fontWeight: 500, fontStyle: 'italic' }}>
            &ldquo;{clip.viralHook}&rdquo;
          </p>
          <CopyButton text={clip.viralHook} />
        </div>
      </div>

      {/* Best platform recommendation */}
      <div style={{
        background: '#16161f',
        border: '1px solid #2a2a3a',
        borderRadius: '10px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{ fontSize: '16px' }}>🎯</span>
        <div>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5a5a72' }}>
            Best Platform for This Clip:
          </span>
          <p style={{ fontSize: '12px', color: '#c0c0d8', marginTop: '2px' }}>{clip.bestPlatformRecommendation}</p>
        </div>
      </div>

      {/* Platform tabs */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {(['instagram', 'youtube', 'facebook', 'tiktok'] as const).map((platform) => (
          <button
            key={platform}
            onClick={() => setActivePlatform(platform)}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              border: `1px solid ${activePlatform === platform ? PLATFORM_COLORS[platform] : '#2a2a3a'}`,
              background: activePlatform === platform ? `${PLATFORM_COLORS[platform]}18` : 'transparent',
              color: activePlatform === platform ? PLATFORM_COLORS[platform] : '#5a5a72',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
              letterSpacing: '0.04em',
            }}
          >
            {PLATFORM_LABELS[platform]}
          </button>
        ))}
      </div>

      {/* Platform content */}
      <div
        style={{
          border: `1px solid ${PLATFORM_COLORS[activePlatform]}30`,
          borderRadius: '12px',
          padding: '16px',
          background: `${PLATFORM_COLORS[activePlatform]}08`,
        }}
      >
        {activePlatform === 'instagram' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <TextField label="Caption" value={clip.instagram.caption} />
            {clip.instagram.altCaptions && clip.instagram.altCaptions.length > 0 && (
              <div>
                <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5a5a72', marginBottom: '8px' }}>
                  Alt Captions (A/B Test)
                </div>
                {clip.instagram.altCaptions.map((alt, i) => (
                  <div key={i} style={{ marginBottom: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '10px', color: '#5a5a72' }}>Version {i + 1}</span>
                      <CopyButton text={alt} />
                    </div>
                    <div style={{ background: '#1c1c28', border: '1px solid #2a2a3a', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: '#c0c0d8', lineHeight: '1.5' }}>
                      {alt}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <TagCloud label="Hashtags" tags={clip.instagram.hashtags} />
          </div>
        )}

        {activePlatform === 'youtube' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <TextField label="Shorts Title" value={clip.youtube.title} />
            <TextField label="Description" value={clip.youtube.description} />
            <TagCloud label="Hashtags" tags={clip.youtube.hashtags} />
          </div>
        )}

        {activePlatform === 'facebook' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <TextField label="Caption" value={clip.facebook.caption} />
            <div style={{
              background: '#1c1c28',
              border: '1px solid rgba(24,119,242,0.3)',
              borderRadius: '8px',
              padding: '10px 12px',
            }}>
              <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5a5a72', marginBottom: '6px' }}>
                Engagement Question (add at end)
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                <p style={{ fontSize: '13px', color: '#e0e0ee', lineHeight: '1.5' }}>{clip.facebook.engagementQuestion}</p>
                <CopyButton text={clip.facebook.engagementQuestion} />
              </div>
            </div>
          </div>
        )}

        {activePlatform === 'tiktok' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <TextField label="Caption" value={clip.tiktok.caption} />
            <div style={{ background: '#1c1c28', border: '1px solid rgba(105,201,208,0.2)', borderRadius: '8px', padding: '10px 12px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5a5a72', marginBottom: '6px' }}>
                On-Screen Text Overlay
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#f0f0f8' }}>{clip.tiktok.textOverlaySuggestion}</p>
                <CopyButton text={clip.tiktok.textOverlaySuggestion} />
              </div>
            </div>
            <TagCloud label="Hashtags" tags={clip.tiktok.hashtags} />
          </div>
        )}
      </div>
    </div>
  );
}
