import { Account } from '../interfaces/Account';
import { Board } from '../interfaces/Board';
import { BrowserState } from '../interfaces/BrowserState';
import { Card } from '../interfaces/Card';
import { Lane } from '../interfaces/Lane';
import { ListView } from '../interfaces/ListView';
import { Schema } from '../interfaces/Schema';
import { CurrencyCode, Team } from '../interfaces/Team';
import { User } from '../interfaces/User';
import { FilterMode } from '../pages/HomePage';
import { ApplicationStore, ListName } from '../store/ApplicationStore';

export enum ActionType {
  PAGE_LOAD = 'PAGE_LOAD',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  USERS = 'USERS',
  USER_ADD = 'USER_ADD',
  USER_SETTINGS_UPDATE = 'USER_SETTINGS_UPDATE',
  ACCOUNTS = 'ACCOUNTS',
  ACCOUNT_ADD = 'ACCOUNT_ADD',
  ACCOUNT_UPDATE = 'ACCOUNT_UPDATE',
  TEAM_UPDATE = 'TEAM_UPDATE',
  CARDS = 'CARDS',
  CARD_ADD = 'CARD_ADD',
  CARD_UPDATE = 'CARD_UPDATE',
  CARD_UPDATE_ON_SERVER = 'CARD_UPDATE_ON_SERVER',
  CARD_MOVE = 'CARD_MOVE',
  CARD_DELETE = 'CARD_DELETE',
  SCHEMAS = 'SCHEMAS',
  LANES = 'LANES',
  LANE_UPDATE = 'LANE_UPDATE',
  BROWSER_STATE = 'BROWSER_STATE',
  USER_INTERFACE_STATE = 'USER_INTERFACE_STATE',
  USER_INTERFACE_MODAL = 'USER_INTERFACE_MODAL',
  FILTER_UPDATE = 'FILTER_UPDATE',
  LIST_VIEW = 'LIST_VIEW',
}

export interface Action<T extends ActionType> {
  type: T;
}

export interface ApplicationPageLoadAction extends Action<ActionType.PAGE_LOAD> {
  payload: { modal?: 'error'; text?: string; token?: string };
}

export interface ApplicationLoginAction extends Action<ActionType.LOGIN> {
  payload: {
    token: string;
    user: User;
    team: {
      id: string;
      currency: CurrencyCode;
    };
    board: Board;
  };
}

export interface ApplicationLogoutAction extends Action<ActionType.LOGOUT> {}

export interface ApplicationUsersAction extends Action<ActionType.USERS> {
  payload: User[];
}

export interface ApplicationUserAddAction extends Action<ActionType.USER_ADD> {
  payload: User;
}

export interface ApplicationUserUpdateAction extends Action<ActionType.USER_SETTINGS_UPDATE> {
  payload: User;
}

export interface ApplicationCardsAction extends Action<ActionType.CARDS> {
  payload: Card[];
}

export interface ApplicationCardAddAction extends Action<ActionType.CARD_ADD> {
  payload: Card;
}

export interface ApplicationCardUpdateAction extends Action<ActionType.CARD_UPDATE> {
  payload: Card;
}

export interface ApplicationCardUpdateOnServerAction
  extends Action<ActionType.CARD_UPDATE_ON_SERVER> {
  payload: Card;
}

export interface ApplicationCardLaneAction extends Action<ActionType.CARD_MOVE> {
  payload: { card: Card; from: Lane['id']; to: Lane['id']; index: number };
}

export interface ApplicationCardDeleteAction extends Action<ActionType.CARD_DELETE> {
  payload: Card;
}

export interface ApplicationAccountAddAction extends Action<ActionType.ACCOUNT_ADD> {
  payload: Account;
}

export interface ApplicationAccountUpdateAction extends Action<ActionType.ACCOUNT_UPDATE> {
  payload: Account;
}

export interface ApplicationAccountsAction extends Action<ActionType.ACCOUNTS> {
  payload: Account[];
}

export interface ApplicationTeamUpdateAction extends Action<ActionType.TEAM_UPDATE> {
  payload: CurrencyCode;
}

export interface ApplicationSchemasAction extends Action<ActionType.SCHEMAS> {
  payload: Schema[];
}

export interface ApplicationLanesAction extends Action<ActionType.LANES> {
  payload: Lane[];
}

export interface ApplicationLaneUpdateAction extends Action<ActionType.LANE_UPDATE> {
  payload: Lane;
}

export interface ApplicationBrowserStateAction extends Action<ActionType.BROWSER_STATE> {
  payload: BrowserState;
}

export interface ApplicationUserInterfaceStateAction
  extends Action<ActionType.USER_INTERFACE_STATE> {
  payload: {
    state: ApplicationStore['ui']['state'];
    id: undefined | Card['id'] | Account['id'] | Lane['id'];
  };
}

export interface ApplicationUserInterfaceModalAction
  extends Action<ActionType.USER_INTERFACE_MODAL> {
  payload: {
    modal: ApplicationStore['ui']['modal'];
    text: string | undefined;
  };
}

export interface ApplicationFilterAction extends Action<ActionType.FILTER_UPDATE> {
  payload: {
    mode: FilterMode[];
    text?: string;
    userId: string;
  };
}

export interface ApplicationListViewAction extends Action<ActionType.LIST_VIEW> {
  payload: {
    name: ListName;
    view: ListView;
  };
}

export type ApplicationAction =
  | ApplicationPageLoadAction
  | ApplicationLoginAction
  | ApplicationLogoutAction
  | ApplicationUsersAction
  | ApplicationUserAddAction
  | ApplicationUserUpdateAction
  | ApplicationCardsAction
  | ApplicationCardAddAction
  | ApplicationCardUpdateAction
  | ApplicationCardUpdateOnServerAction
  | ApplicationCardLaneAction
  | ApplicationCardDeleteAction
  | ApplicationAccountsAction
  | ApplicationAccountAddAction
  | ApplicationAccountUpdateAction
  | ApplicationTeamUpdateAction
  | ApplicationLanesAction
  | ApplicationSchemasAction
  | ApplicationLaneUpdateAction
  | ApplicationBrowserStateAction
  | ApplicationUserInterfaceStateAction
  | ApplicationUserInterfaceModalAction
  | ApplicationFilterAction
  | ApplicationListViewAction;

export function showModalSuccess(text?: string) {
  return {
    type: ActionType.USER_INTERFACE_MODAL,
    payload: { modal: 'success', text: text },
  } as ApplicationUserInterfaceModalAction;
}

export function showModalError(text?: string) {
  return {
    type: ActionType.USER_INTERFACE_MODAL,
    payload: { modal: 'error', text: text },
  } as ApplicationUserInterfaceModalAction;
}

export function hideModal() {
  return {
    type: ActionType.USER_INTERFACE_MODAL,
    payload: { modal: undefined, text: undefined },
  } as ApplicationUserInterfaceModalAction;
}

export function pageLoad(token?: string) {
  return {
    type: ActionType.PAGE_LOAD,
    payload: { token },
  } as ApplicationPageLoadAction;
}

export function login(token: string, user: User, team: Team, board: Board) {
  return {
    type: ActionType.LOGIN,
    payload: { token, user, team, board },
  } as ApplicationLoginAction;
}

export function pageLoadWithError(text: string, token?: string) {
  return {
    type: ActionType.PAGE_LOAD,
    payload: { modal: 'error', text: text, token },
  } as ApplicationPageLoadAction;
}

export function updateFilter(filter: Set<FilterMode>, userId: string, text?: string) {
  return {
    type: ActionType.FILTER_UPDATE,
    payload: { mode: Array.from(filter.values()), text: text, userId: userId },
  } as ApplicationFilterAction;
}

export function setListView(name: ListName, view: ListView) {
  return {
    type: ActionType.LIST_VIEW,
    payload: {
      view,
      name,
    },
  } as ApplicationListViewAction;
}

export const showAccountLayer = (id?: string): ApplicationUserInterfaceStateAction => {
  return {
    type: ActionType.USER_INTERFACE_STATE,
    payload: { state: 'account-detail', id: id },
  };
};

export const showCardLayer = (id?: string): ApplicationUserInterfaceStateAction => {
  return {
    type: ActionType.USER_INTERFACE_STATE,
    payload: { state: 'card-detail', id: id },
  };
};

export const showLaneLayer = (id?: string): ApplicationUserInterfaceStateAction => {
  return {
    type: ActionType.USER_INTERFACE_STATE,
    payload: { state: 'lane-detail', id: id },
  };
};

export const hideLayer = (): ApplicationUserInterfaceStateAction => {
  return {
    type: ActionType.USER_INTERFACE_STATE,
    payload: { state: 'default', id: undefined },
  };
};

export const addCard = (card: Card): ApplicationCardAddAction => {
  return {
    type: ActionType.CARD_ADD,
    payload: card,
  };
};

export const updateCard = (card: Card): ApplicationCardUpdateAction => {
  return {
    type: ActionType.CARD_UPDATE,
    payload: card,
  };
};

export const updateCardFromServer = (card: Card): ApplicationCardUpdateOnServerAction => {
  return {
    type: ActionType.CARD_UPDATE_ON_SERVER,
    payload: card,
  };
};

export const addAccoount = (account: Account): ApplicationAccountAddAction => {
  return {
    type: ActionType.ACCOUNT_ADD,
    payload: account,
  };
};

export const updateAccount = (account: Account): ApplicationAccountUpdateAction => {
  return {
    type: ActionType.ACCOUNT_UPDATE,
    payload: account,
  };
};
