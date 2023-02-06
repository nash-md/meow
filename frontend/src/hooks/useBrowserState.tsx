import { useState, useEffect } from 'react';
import { ActionType } from '../actions/Actions';
import { BrowserState } from '../interfaces/BrowserState';
import { store } from '../store/Store';

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

  useEffect(() => {
    if (state === 'unknown') {
      return;
    }

    // TODO move to component
    store.dispatch({
      type: ActionType.BROWSER_STATE,
      payload: state,
    });
  }, [state]);
};
