import React from 'react';
import { TokenCard } from './TokenCard';

const TokenTest = () => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface-canvas)',
        padding: 'var(--space-6)',
        minHeight: '100vh',
        fontFamily: 'var(--font-family-sans)',
      }}
    >
      <TokenCard />
    </div>
  );
};

export default TokenTest;
