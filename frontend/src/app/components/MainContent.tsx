import React from 'react';
import { Outlet } from 'react-router-dom';

export const MainContent: React.FC = () => (
  <main
    style={{
      flex: 1,
      padding: 'var(--space-6)',
      overflowY: 'auto',
    }}
  >
    <Outlet />
  </main>
);
