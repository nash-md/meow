import { DateTime } from 'luxon';
import { ApplicationStore } from './ApplicationStore';
import { FILTER_BY_NONE } from '../Constants';

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
    team: undefined,
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
    date: {
      start: DateTime.now().startOf('month').toISODate(),
      end: DateTime.now().endOf('month').toISODate(),
      userId: FILTER_BY_NONE.key,
    },
  },
};
