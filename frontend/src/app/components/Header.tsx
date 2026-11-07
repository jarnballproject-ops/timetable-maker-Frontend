import React from 'react';
import { NavLinks } from './NavLinks';
import { ApiStatus } from './ApiStatus';

export const Header: React.FC = () => {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-4) var(--space-8)',
        backgroundColor: 'var(--color-surface-raised)',
        borderBottom: '1px solid var(--color-border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          fontWeight: 'bold',
          fontSize: 'var(--font-size-lg)',
          color: 'var(--color-text-primary)',
        }}
      >
        Timetable Maker
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
        <NavLinks />
        <ApiStatus />
      </div>
    </header>
  );
};
