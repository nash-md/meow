import { BrowserState } from '../interfaces/BrowserState';
import { Card } from '../interfaces/Card';

export interface ApplicationStore {
  cards: Card[];
  session: {
    token: string | undefined;
    alerts: number;
    account: {
      id: string | undefined;
    };
    user: {
      id: string | undefined;
      name: string | undefined;
    };
  };
  browser: {
    state: BrowserState;
    isPageLoaded: boolean;
  };
  ui: {
    state: 'default' | 'card-detail';
    id: undefined | Card['id'];
  };
}
