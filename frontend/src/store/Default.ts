import { ApplicationStore } from './ApplicationStore';

export const Default: ApplicationStore = {
  cards: [],
  session: {
    token: undefined,
    alerts: 0,
    account: {
      id: undefined,
    },
    user: {
      id: undefined,
      name: undefined,
    },
  },
  browser: {
    state: 'unknown',
    isPageLoaded: false,
  },
  ui: {
    state: 'default',
    id: undefined,
  },
};
