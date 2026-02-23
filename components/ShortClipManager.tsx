'use client';

import { useRef } from 'react';
import { generateId } from '@/lib/utils';
import type { ShortClip } from '@/lib/types';

interface ShortClipManagerProps {
  clips: ShortClip[];
  onChange: (clips: ShortClip[]) => void;
}

export default function ShortClipManager({ clips, onChange }: ShortClipManagerProps) {
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const addClip = () => {
    onChange([
      ...clips,
      { id: generateId(), label: `Clip ${clips.length + 1}`, transcript: '' },
    ]);
  };

  const removeClip = (id: string) => {
    onChange(clips.filter((c) => c.id !== id));
  };

  const updateClip = (id: string, field: keyof ShortClip, value: string) => {
    onChange(clips.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const handleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      updateClip(id, 'transcript', evt.target?.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '11px', color: '#5a5a72', marginTop: '2px' }}>
            Add the transcript for each short clip / reel you want social media content for
          </p>
        </div>
        <button onClick={addClip} style={addBtnStyle}>
          + Add Clip
        </button>
      </div>

      {clips.length === 0 && (
        <div
          onClick={addClip}
          style={{
            border: '2px dashed #2a2a3a',
            borderRadius: '10px',
            padding: '28px',
            textAlign: 'center',
            cursor: 'pointer',
            color: '#5a5a72',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>✂️</div>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>No clips added yet</div>
          <div style={{ fontSize: '12px' }}>Click to add your first short/reel clip transcript</div>
        </div>
      )}

      {clips.map((clip, index) => {
        const wordCount = clip.transcript.trim() ? clip.transcript.trim().split(/\s+/).length : 0;
        return (
          <div
            key={clip.id}
            style={{
              background: '#16161f',
              border: '1px solid #2a2a3a',
              borderRadius: '10px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {/* Clip header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  background: 'rgba(108,92,231,0.2)',
                  color: '#6c5ce7',
                  fontSize: '11px',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </span>
              <input
                type="text"
                value={clip.label}
                onChange={(e) => updateClip(clip.id, 'label', e.target.value)}
                placeholder="Clip name (e.g. Eric's Surgery Story)"
                style={{
                  flex: 1,
                  background: '#1c1c28',
                  border: '1px solid #2a2a3a',
                  borderRadius: '6px',
                  color: '#f0f0f8',
                  fontSize: '13px',
                  padding: '6px 10px',
                  outline: 'none',
                }}
              />
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {clip.transcript && (
                  <span style={{ fontSize: '10px', color: '#5a5a72', whiteSpace: 'nowrap' }}>
                    {wordCount}w
                  </span>
                )}
                <button
                  onClick={() => fileInputRefs.current[clip.id]?.click()}
                  style={{
                    fontSize: '11px',
                    padding: '4px 8px',
                    background: 'rgba(108,92,231,0.1)',
                    border: '1px solid rgba(108,92,231,0.3)',
                    borderRadius: '5px',
                    color: '#6c5ce7',
                    cursor: 'pointer',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  ↑ .txt
                </button>
                <input
                  ref={(el) => { fileInputRefs.current[clip.id] = el; }}
                  type="file"
                  accept=".txt,.md,.vtt,.srt"
                  onChange={(e) => handleFileUpload(clip.id, e)}
                  style={{ display: 'none' }}
                />
                <button
                  onClick={() => removeClip(clip.id)}
                  style={{
                    width: '26px',
                    height: '26px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255,50,50,0.08)',
                    border: '1px solid rgba(255,50,50,0.2)',
                    borderRadius: '6px',
                    color: '#ff5555',
                    cursor: 'pointer',
                    fontSize: '14px',
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Transcript */}
            <textarea
              value={clip.transcript}
              onChange={(e) => updateClip(clip.id, 'transcript', e.target.value)}
              placeholder="Paste this clip's transcript here..."
              style={{
                width: '100%',
                height: '120px',
                resize: 'vertical',
                padding: '10px 12px',
                background: '#1c1c28',
                border: '1px solid #2a2a3a',
                borderRadius: '8px',
                color: '#f0f0f8',
                fontSize: '12px',
                fontFamily: 'monospace',
                lineHeight: '1.5',
                outline: 'none',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

const addBtnStyle: React.CSSProperties = {
  padding: '6px 14px',
  background: 'rgba(108,92,231,0.15)',
  border: '1px solid rgba(108,92,231,0.4)',
  borderRadius: '8px',
  color: '#6c5ce7',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 700,
  whiteSpace: 'nowrap',
  transition: 'all 0.2s',
};
