import React, { useEffect } from 'react';
import { AppRouter } from './app/routes';
import { store } from './state/store';
import { persistence } from './lib/persistence';

function App() {
  useEffect(() => {
    // Recover state from LocalStorage on boot
    store.setState({
      problem: persistence.loadProblem(),
      currentSchedule: persistence.loadSchedule(),
      currentReport: persistence.loadReport(),
      activeJobId: persistence.loadJobId(),
      lastOutcome: persistence.loadOutcome(),
    });
  }, []);

  return <AppRouter />;
}

export default App;
