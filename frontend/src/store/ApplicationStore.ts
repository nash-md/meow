import { CurrencyCode } from '../interfaces/Account';
import { Board } from '../interfaces/Board';
import { BrowserState } from '../interfaces/BrowserState';
import { Card } from '../interfaces/Card';
import { Lane } from '../interfaces/Lane';
import { Schema } from '../interfaces/Schema';
import { User } from '../interfaces/User';

export interface ApplicationStore {
  users: User[];
  cards: Card[];
  lanes: Lane[];
  board: Board;
  schemas: Schema[];
  session: {
    token: string | undefined;
    alerts: number;
    account: {
      id: string | undefined;
      currency: CurrencyCode | undefined;
    };
    user: {
      id: string | undefined;
      name: string | undefined;
      animal: string | undefined;
    };
  };
  browser: {
    state: BrowserState;
    isPageLoaded: boolean;
  };
  ui: {
    state: 'default' | 'card-detail' | 'lane-detail';
    id: undefined | Card['id'] | Lane['id'];
    modal: 'success' | 'error' | undefined;
    text: string | undefined;
  };
}
