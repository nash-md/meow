import { Account } from '../interfaces/Account';
import { Board } from '../interfaces/Board';
import { BrowserState } from '../interfaces/BrowserState';
import { Card } from '../interfaces/Card';
import { Lane } from '../interfaces/Lane';
import { Schema } from '../interfaces/Schema';
import { CurrencyCode } from '../interfaces/Team';
import { User } from '../interfaces/User';
import { ApplicationStore } from '../store/ApplicationStore';

export enum ActionType {
  PAGE_LOAD = 'PAGE_LOAD',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  USERS = 'USERS',
  USER_ADD = 'USER_ADD',
  ACCOUNTS = 'ACCOUNTS',
  ACCOUNT_ADD = 'ACCOUNT_ADD',
  ACCOUNT_UPDATE = 'ACCOUNT_UPDATE',
  TEAM_UPDATE = 'TEAM_UPDATE',
  CARDS = 'CARDS',
  CARD_ADD = 'CARD_ADD',
  CARD_UPDATE = 'CARD_UPDATE',
  CARD_REFRESH = 'CARD_REFRESH',
  CARD_LANE = 'CARD_LANE',
  CARD_DELETE = 'CARD_DELETE',
  SCHEMAS = 'SCHEMAS',
  LANES = 'LANES',
  LANE_UPDATE = 'LANE_UPDATE',
  BROWSER_STATE = 'BROWSER_STATE',
  USER_INTERFACE_STATE = 'USER_INTERFACE_STATE',
  USER_INTERFACE_MODAL = 'USER_INTERFACE_MODAL',
}

export interface Action<T extends ActionType> {
  type: T;
}

export interface ApplicationPageLoadAction
  extends Action<ActionType.PAGE_LOAD> {
  payload: { modal?: 'error'; text?: string; token?: string };
}

export interface ApplicationLoginAction extends Action<ActionType.LOGIN> {
  payload: {
    token: string;
    user: {
      id: string;
      name: string;
      animal: string | undefined;
    };
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

export interface ApplicationCardsAction extends Action<ActionType.CARDS> {
  payload: Card[];
}

export interface ApplicationCardAddAction extends Action<ActionType.CARD_ADD> {
  payload: Card;
}

export interface ApplicationCardUpdateAction
  extends Action<ActionType.CARD_UPDATE> {
  payload: Card;
}

export interface ApplicationCardRefreshAction
  extends Action<ActionType.CARD_REFRESH> {
  payload: Card;
}

export interface ApplicationCardLaneAction
  extends Action<ActionType.CARD_LANE> {
  payload: { card: Card; from: Lane['id']; to: Lane['id']; index: number };
}

export interface ApplicationCardDeleteAction
  extends Action<ActionType.CARD_DELETE> {
  payload: Card;
}

export interface ApplicationAccountAddAction
  extends Action<ActionType.ACCOUNT_ADD> {
  payload: Account;
}

export interface ApplicationAccountUpdateAction
  extends Action<ActionType.ACCOUNT_UPDATE> {
  payload: Account;
}

export interface ApplicationAccountsAction extends Action<ActionType.ACCOUNTS> {
  payload: Account[];
}

export interface ApplicationTeamUpdateAction
  extends Action<ActionType.TEAM_UPDATE> {
  payload: CurrencyCode;
}

export interface ApplicationSchemasAction extends Action<ActionType.SCHEMAS> {
  payload: Schema[];
}

export interface ApplicationLanesAction extends Action<ActionType.LANES> {
  payload: Lane[];
}

export interface ApplicationLaneUpdateAction
  extends Action<ActionType.LANE_UPDATE> {
  payload: Lane;
}

export interface ApplicationBrowserStateAction
  extends Action<ActionType.BROWSER_STATE> {
  payload: BrowserState;
}

export interface ApplicationUserInterfaceStateAction
  extends Action<ActionType.USER_INTERFACE_STATE> {
  payload: {
    state: ApplicationStore['ui']['state'];
    id: undefined | Card['id'];
  };
}

export interface ApplicationUserInterfaceModalAction
  extends Action<ActionType.USER_INTERFACE_MODAL> {
  payload: {
    modal: ApplicationStore['ui']['modal'];
    text: string | undefined;
  };
}

export type ApplicationAction =
  | ApplicationPageLoadAction
  | ApplicationLoginAction
  | ApplicationLogoutAction
  | ApplicationUsersAction
  | ApplicationUserAddAction
  | ApplicationCardsAction
  | ApplicationCardAddAction
  | ApplicationCardUpdateAction
  | ApplicationCardRefreshAction
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
  | ApplicationUserInterfaceModalAction;

export function showModalSuccess() {
  return {
    type: ActionType.USER_INTERFACE_MODAL,
    payload: { modal: 'success', text: undefined },
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

export function pageLoadWithError(text: string, token?: string) {
  return {
    type: ActionType.PAGE_LOAD,
    payload: { modal: 'error', text: text, token },
  } as ApplicationPageLoadAction;
}
