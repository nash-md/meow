import { ApplicationStore } from './ApplicationStore';

export const Default: ApplicationStore = {
  users: [],
  cards: [],
  lanes: [],
  schemas: [],
  board: {},
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
      animal: undefined,
    }, // TODO migrate to User interface
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
  },
};
