import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppShell from './AppShell';
import { texts } from '../config/texts';
import { ImportPage } from '../pages/ImportPage';
import { SolvePage } from '../pages/SolvePage';
import { ResultPage } from '../pages/ResultPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        path: 'import',
        element: <ImportPage />,
      },
      {
        path: 'solve',
        element: <SolvePage />,
      },
      {
        path: 'result',
        element: <ResultPage />,
      },
      {
        path: '',
        element: <div style={{ padding: 'var(--space-6)' }}>{texts.home}</div>,
      },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
