import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, title, subtitle, style }) => (
  <div
    style={{
      backgroundColor: 'var(--color-surface-card)',
      borderRadius: 'var(--radius-card)',
      padding: 'var(--space-inset-card)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
      border: '1px solid var(--color-border-subtle)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      ...style,
    }}
  >
    {title && (
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <h3
          style={{
            marginTop: 0,
            marginBottom: 'var(--space-1)',
            color: 'var(--color-text-primary)',
            fontSize: 'var(--font-size-lg)',
            fontWeight: '600',
          }}
        >
          {title}
        </h3>
        {subtitle && (
          <p
            style={{
              margin: 0,
              color: 'var(--color-text-muted)',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    )}
    {children}
  </div>
);
