import React from 'react';
import { MainContent } from './components/MainContent';
import { Header } from './components/Header';

const AppShell: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--color-surface-canvas)',
        fontFamily: 'var(--font-family-sans)',
      }}
    >
      <Header />
      <MainContent />
    </div>
  );
};

export default AppShell;
