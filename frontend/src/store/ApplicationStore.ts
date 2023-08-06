import { Account } from '../interfaces/Account';
import { Board } from '../interfaces/Board';
import { BrowserState } from '../interfaces/BrowserState';
import { Card } from '../interfaces/Card';
import { Lane } from '../interfaces/Lane';
import { ListView } from '../interfaces/ListView';
import { Schema } from '../interfaces/Schema';
import { CurrencyCode, Integration } from '../interfaces/Team';
import { User } from '../interfaces/User';
import { FilterMode } from '../pages/HomePage';

export type InterfaceState = 'default' | 'card-detail' | 'lane-detail' | 'account-detail';

export type ListName = 'accounts' | 'users' | 'forecast';

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
      integrations: Integration[];
    };
    user: User | undefined;
  };
  browser: {
    state: BrowserState;
    isPageLoaded: boolean;
  };
  ui: {
    state: InterfaceState;
    id: undefined | Card['id'] | Lane['id'] | Account['id'];
    modal: 'success' | 'error' | undefined;
    text: string | undefined;
    filters: {
      text: string | undefined;
      mode: FilterMode[];
      userId: string;
    };
    accounts: ListView;
    users: ListView;
    forecast: ListView;
  };
}
