import React from 'react';
import { env } from '../../config/env';

export const ApiStatus: React.FC = () => {
  if (env.apiMode !== 'http') return null;

  return (
    <div
      style={{
        marginTop: 'auto',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: 'var(--color-surface-sunken)',
        fontSize: 'var(--font-size-sm)',
        color: 'var(--color-text-secondary)',
        textAlign: 'center',
      }}
    >
      โหมด: {' '}
      <span style={{ color: 'var(--color-text-brand)', fontWeight: 'bold' }}>
        Real API
      </span>
    </div>
  );
};
