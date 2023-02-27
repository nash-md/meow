import { Account } from '../interfaces/Account';
import { Board } from '../interfaces/Board';
import { BrowserState } from '../interfaces/BrowserState';
import { Card } from '../interfaces/Card';
import { Lane } from '../interfaces/Lane';
import { Schema } from '../interfaces/Schema';
import { CurrencyCode } from '../interfaces/Team';
import { User } from '../interfaces/User';

export interface ApplicationStore {
  users: User[];
  accounts: Account[];
  cards: Card[];
  lanes: Lane[];
  board: Board;
  schemas: Schema[];
  session: {
    token: string | undefined;
    alerts: number;
    team: {
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
    state: 'default' | 'card-detail' | 'lane-detail' | 'account-detail';
    id: undefined | Card['id'] | Lane['id'] | Account['id'];
    modal: 'success' | 'error' | undefined;
    text: string | undefined;
  };
}
