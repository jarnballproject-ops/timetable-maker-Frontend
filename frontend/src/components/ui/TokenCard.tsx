import React from 'react';

const cardStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-surface-card)',
  padding: 'var(--space-6)',
  borderRadius: 'var(--radius-card)',
  boxShadow: 'var(--shadow-card)',
  border: 'var(--border-width-1) solid var(--color-border-default)',
  maxWidth: 'var(--size-content-max)',
  margin: '0 auto',
};

const titleStyle: React.CSSProperties = {
  color: 'var(--color-text-primary)',
  fontSize: 'var(--font-size-2xl)',
  marginBottom: 'var(--space-4)',
};

const textStyle: React.CSSProperties = {
  color: 'var(--color-text-secondary)',
  fontSize: 'var(--font-size-md)',
  marginBottom: 'var(--space-4)',
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-action-primary-bg)',
  color: 'var(--color-action-primary-text)',
  padding: 'var(--space-2) var(--space-4)',
  borderRadius: 'var(--radius-control)',
  border: 'none',
  cursor: 'pointer',
};

export const TokenCard = () => (
  <div style={cardStyle}>
    <h1 style={titleStyle}>Token Test</h1>
    <p style={textStyle}>This component uses semantic design tokens.</p>
    <button style={buttonStyle}>Primary Button</button>
  </div>
);
