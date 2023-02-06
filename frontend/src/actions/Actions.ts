import { CurrencyCode } from '../interfaces/Account';
import { BrowserState } from '../interfaces/BrowserState';
import { Card, CardPreview } from '../interfaces/Card';
import { ApplicationStore } from '../store/ApplicationStore';

export enum ActionType {
  PAGE_LOAD = 'PAGE_LOAD',
  LOGIN = 'LOGIN',
  CARDS = 'CARDS',
  CARD_ADD = 'CARD_ADD',
  CARD_UPDATE = 'CARD_UPDATE',
  CARD_DELETE = 'CARD_DELETE',
  ACCOUNT_UPDATE = 'ACCOUNT_UPDATE',
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
  | ApplicationCardsAction
  | ApplicationCardAddAction
  | ApplicationCardUpdateAction
  | ApplicationCardDeleteAction
  | ApplicationAccountUpdateAction
  | ApplicationBrowserStateAction
  | ApplicationUserInterfaceStateAction;
