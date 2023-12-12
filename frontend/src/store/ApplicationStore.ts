import { Account } from '../interfaces/Account';
import { ApplicationState } from '../interfaces/ApplicationState';
import { Board } from '../interfaces/Board';
import { BrowserState } from '../interfaces/BrowserState';
import { Card } from '../interfaces/Card';
import { Lane } from '../interfaces/Lane';
import { ListView } from '../interfaces/ListView';
import { Schema } from '../interfaces/Schema';
import { CurrencyCode, Integration, Team } from '../interfaces/Team';
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
    team: Team | undefined;
    user: User | undefined;
  };
  browser: {
    state: BrowserState;
  };
  application: {
    state: ApplicationState;
  };
  ui: {
    state: InterfaceState;
    _id: undefined | Card['_id'] | Lane['_id'] | Account['_id'];
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
    date: {
      start: string | null;
      end: string | null;
      userId: string;
    };
  };
}
