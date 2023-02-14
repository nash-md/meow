import { CurrencyCode } from '../interfaces/Account';
import { BrowserState } from '../interfaces/BrowserState';
import { Card, CardPreview } from '../interfaces/Card';
import { Lane } from '../interfaces/Lane';
import { User } from '../interfaces/User';
import { ApplicationStore } from '../store/ApplicationStore';

export enum ActionType {
  PAGE_LOAD = 'PAGE_LOAD',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  USERS = 'USERS',
  USER_ADD = 'USER_ADD',
  CARDS = 'CARDS',
  CARD_ADD = 'CARD_ADD',
  CARD_UPDATE = 'CARD_UPDATE',
  CARD_DELETE = 'CARD_DELETE',
  ACCOUNT_UPDATE = 'ACCOUNT_UPDATE',
  LANES = 'LANES',
  LANE_UPDATE = 'LANE_UPDATE',
  BROWSER_STATE = 'BROWSER_STATE',
  USER_INTERFACE_STATE = 'USER_INTERFACE_STATE',
}

export interface Action<T extends ActionType> {
  type: T;
}

export interface ApplicationPageLoadAction
  extends Action<ActionType.PAGE_LOAD> {
  payload:
    | {
        token: string;
        user: {
          id: string;
          name: string;
        };
        account: {
          id: string;
          currency: CurrencyCode;
        };
      }
    | undefined;
}

export interface ApplicationLoginAction extends Action<ActionType.LOGIN> {
  payload: {
    token: string;
    user: {
      id: string;
      name: string;
    };
    account: {
      id: string;
      currency: CurrencyCode;
    };
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
  payload: CardPreview;
}

export interface ApplicationCardUpdateAction
  extends Action<ActionType.CARD_UPDATE> {
  payload: Card;
}

export interface ApplicationCardDeleteAction
  extends Action<ActionType.CARD_DELETE> {
  payload: string;
}

export interface ApplicationAccountUpdateAction
  extends Action<ActionType.ACCOUNT_UPDATE> {
  payload: CurrencyCode;
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
export type ApplicationAction =
  | ApplicationPageLoadAction
  | ApplicationLoginAction
  | ApplicationLogoutAction
  | ApplicationUsersAction
  | ApplicationUserAddAction
  | ApplicationCardsAction
  | ApplicationCardAddAction
  | ApplicationCardUpdateAction
  | ApplicationCardDeleteAction
  | ApplicationAccountUpdateAction
  | ApplicationLanesAction
  | ApplicationLaneUpdateAction
  | ApplicationBrowserStateAction
  | ApplicationUserInterfaceStateAction;
