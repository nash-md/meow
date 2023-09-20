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
      _id: undefined,
      currency: undefined,
      integrations: [],
    },
    user: undefined,
  },
  browser: {
    state: 'unknown',
  },
  application: {
    state: 'uninitialized',
  },
  ui: {
    state: 'default',
    _id: undefined,
    modal: undefined,
    text: '',
    filters: {
      text: '',
      mode: [],
      userId: '',
    },
    accounts: {
      sortBy: {
        direction: 'desc',
        column: undefined,
      },
      filterBy: {},
      columns: [],
    },
    users: {
      sortBy: {
        direction: 'desc',
        column: undefined,
      },
      filterBy: {},
      columns: [],
    },
    forecast: {
      sortBy: {
        direction: 'desc',
        column: undefined,
      },
      filterBy: {},
      columns: [],
    },
  },
};
