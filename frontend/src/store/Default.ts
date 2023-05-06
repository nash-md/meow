import { ApplicationStore } from './ApplicationStore';

export const Default: ApplicationStore = {
  accounts: [],
  users: [],
  cards: [],
  lanes: [],
  schemas: [],
  board: {},
  session: {
    token: undefined,
    alerts: 0,
    team: {
      id: undefined,
      currency: undefined,
    },
    user: undefined,
  },
  browser: {
    state: 'unknown',
    isPageLoaded: false,
  },
  ui: {
    state: 'default',
    id: undefined,
    modal: undefined,
    text: undefined,
    filters: {
      text: '',
      mode: [],
    },
    accounts: {
      direction: 'desc',
      column: undefined,
      text: undefined,
    },
    users: {
      direction: 'desc',
      column: undefined,
      text: undefined,
    },
    forecast: {
      direction: 'desc',
      column: undefined,
      text: undefined,
    },
  },
};
