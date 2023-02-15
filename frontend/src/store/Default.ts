import { ApplicationStore } from './ApplicationStore';

export const Default: ApplicationStore = {
  users: [],
  cards: [],
  lanes: [],
  schemas: [],
  session: {
    token: undefined,
    alerts: 0,
    account: {
      id: undefined,
      currency: undefined,
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
