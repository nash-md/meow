import { useState, useEffect } from 'react';
import { ActionType } from '../actions/Actions';
import { BrowserState } from '../interfaces/BrowserState';
export const useBrowserState = () => {
  const [state, setState] = useState<BrowserState>('unknown');

  useEffect(() => {
    setState(window.navigator.onLine ? 'online' : 'offline');

    window.addEventListener('online', () => {
      setState('online');
    });

    window.addEventListener('offline', () => {
      setState('offline');
    });
  }, []);

  return state;
};
