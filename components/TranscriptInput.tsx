'use client';

import { useRef } from 'react';

interface TranscriptInputProps {
  episodeNumber: string;
  episodeTopic: string;
  transcript: string;
  onEpisodeNumberChange: (v: string) => void;
  onEpisodeTopicChange: (v: string) => void;
  onTranscriptChange: (v: string) => void;
}

export default function TranscriptInput({
  episodeNumber,
  episodeTopic,
  transcript,
  onEpisodeNumberChange,
  onEpisodeTopicChange,
  onTranscriptChange,
}: TranscriptInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      onTranscriptChange(text);
    };
    reader.readAsText(file);
  };

  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;
  const charCount = transcript.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Episode meta */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ flex: '0 0 100px' }}>
          <label style={labelStyle}>Episode #</label>
          <input
            type="text"
            value={episodeNumber}
            onChange={(e) => onEpisodeNumberChange(e.target.value)}
            placeholder="e.g. 19"
            style={inputStyle}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Episode Topic / Working Title</label>
          <input
            type="text"
            value={episodeTopic}
            onChange={(e) => onEpisodeTopicChange(e.target.value)}
            placeholder="e.g. Eric's surgery, Dolphins playoff hopes, haunted Airbnb story..."
            style={inputStyle}
          />
        </div>
      </div>

      {/* Transcript area */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label style={labelStyle}>Episode Transcript</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {transcript && (
              <span style={{ fontSize: '11px', color: '#5a5a72' }}>
                {wordCount.toLocaleString()} words · {charCount.toLocaleString()} chars
              </span>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                fontSize: '11px',
                padding: '4px 10px',
                background: 'rgba(108,92,231,0.1)',
                border: '1px solid rgba(108,92,231,0.3)',
                borderRadius: '6px',
                color: '#6c5ce7',
                cursor: 'pointer',
                fontWeight: 600,
                letterSpacing: '0.04em',
              }}
            >
              ↑ Upload .txt
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.vtt,.srt"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </div>
        </div>
        <textarea
          value={transcript}
          onChange={(e) => onTranscriptChange(e.target.value)}
          placeholder="Paste the full episode transcript here...

You can paste raw text, speaker-labeled transcripts (Anthony: ..., Daniel: ...), or upload a .txt file using the button above.

The more transcript you provide, the better the AI suggestions will be."
          style={{
            ...inputStyle,
            height: '320px',
            resize: 'vertical',
            lineHeight: '1.6',
            fontFamily: 'monospace',
            fontSize: '12px',
          }}
        />
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#5a5a72',
  marginBottom: '6px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  background: '#1c1c28',
  border: '1px solid #2a2a3a',
  borderRadius: '8px',
  color: '#f0f0f8',
  fontSize: '13px',
  outline: 'none',
  transition: 'border-color 0.2s',
};
