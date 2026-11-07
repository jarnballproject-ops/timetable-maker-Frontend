import { useState, useEffect } from 'react';
import { store, AppState } from './store';

export function useStore<T extends keyof AppState>(key: T) {
  const [stateValue, setStateValue] = useState(store.getState()[key]);

  useEffect(() => {
    const unsubscribe = store.subscribe((newState) => {
      setStateValue(newState[key]);
    });
    return unsubscribe;
  }, [key]);

  return stateValue;
}
