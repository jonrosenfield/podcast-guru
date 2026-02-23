'use client';

import CopyButton from './CopyButton';

interface ResultCardProps {
  title: string;
  children: React.ReactNode;
  accent?: string;
  collapsible?: boolean;
}

export function ResultCard({ title, children, accent = '#6c5ce7' }: ResultCardProps) {
  return (
    <div
      style={{
        background: '#16161f',
        border: '1px solid #2a2a3a',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #2a2a3a',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <div
          style={{
            width: '3px',
            height: '16px',
            borderRadius: '2px',
            background: accent,
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9090aa' }}>
          {title}
        </span>
      </div>
      <div style={{ padding: '14px 16px' }}>{children}</div>
    </div>
  );
}

interface TextFieldProps {
  label?: string;
  value: string;
  mono?: boolean;
}

export function TextField({ label, value, mono }: TextFieldProps) {
  return (
    <div style={{ marginBottom: '12px' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5a5a72' }}>
            {label}
          </span>
          <CopyButton text={value} />
        </div>
      )}
      <div
        style={{
          background: '#1c1c28',
          border: '1px solid #2a2a3a',
          borderRadius: '8px',
          padding: '10px 12px',
          fontSize: mono ? '12px' : '13px',
          fontFamily: mono ? 'monospace' : 'inherit',
          color: '#e0e0ee',
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {value}
      </div>
      {!label && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
          <CopyButton text={value} />
        </div>
      )}
    </div>
  );
}

interface OptionListProps {
  label: string;
  items: string[];
  numbered?: boolean;
}

export function OptionList({ label, items, numbered }: OptionListProps) {
  const allText = items.join('\n');
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5a5a72' }}>
          {label}
        </span>
        <CopyButton text={allText} label="Copy All" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              background: '#1c1c28',
              border: '1px solid #2a2a3a',
              borderRadius: '8px',
              padding: '10px 12px',
            }}
          >
            {numbered && (
              <span
                style={{
                  flexShrink: 0,
                  width: '20px',
                  height: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(108,92,231,0.2)',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#6c5ce7',
                }}
              >
                {i + 1}
              </span>
            )}
            <span style={{ flex: 1, fontSize: '13px', color: '#e0e0ee', lineHeight: '1.5' }}>{item}</span>
            <CopyButton text={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

interface TagCloudProps {
  label: string;
  tags: string[];
}

export function TagCloud({ label, tags }: TagCloudProps) {
  const allTags = tags.join(' ');
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5a5a72' }}>
          {label}
        </span>
        <CopyButton text={allTags} label="Copy All" />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {tags.map((tag, i) => (
          <button
            key={i}
            onClick={() => navigator.clipboard.writeText(tag)}
            title="Click to copy"
            style={{
              padding: '4px 10px',
              background: 'rgba(108,92,231,0.1)',
              border: '1px solid rgba(108,92,231,0.25)',
              borderRadius: '20px',
              color: '#9090bb',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
