import { ActionType, ApplicationAction } from '../actions/Actions';
import { BoardHelper } from '../helpers/BoardHelper';
import { isValidId } from '../helpers/Helper';
import { Account } from '../interfaces/Account';
import { Card } from '../interfaces/Card';
import { Lane } from '../interfaces/Lane';
import { ListView } from '../interfaces/ListView';
import { User } from '../interfaces/User';
import { InterfaceState } from '../store/ApplicationStore';
import { Default } from '../store/Default';

export const application = (state = Default, action: ApplicationAction) => {
  switch (action.type) {
    case ActionType.PAGE_LOAD:
      return {
        ...state,
        session: {
          ...state.session,
          token: action.payload.token,
        },
        browser: {
          ...state.browser,
          isPageLoaded: true,
        },
        ui: {
          ...state.ui,
          modal: action.payload.modal,
          text: action.payload.text,
        },
      };

    case ActionType.LOGIN:
      return {
        ...state,
        session: {
          token: action.payload.token,
          alerts: 0,
          user: {
            ...action.payload.user,
          },
          team: {
            ...action.payload.team,
          },
        },
        board: { ...action.payload.board },
      };

    case ActionType.LOGOUT:
      return {
        ...state,
        session: {
          token: undefined,
          alerts: 0,
          user: undefined,
          team: {
            id: undefined,
            currency: undefined,
          },
        },
        cards: [],
        lanes: [],
        users: [],
        board: {},
        schemas: [],
        ui: {
          state: <InterfaceState>'default',
          id: undefined,
          modal: undefined,
          text: undefined,
          filters: {
            text: '',
            userId: 'all',
            mode: [],
          },
          accounts: {
            direction: <ListView['direction']>'desc',
            column: undefined,
            text: undefined,
          },
          users: {
            direction: <ListView['direction']>'desc',
            column: undefined,
            text: undefined,
          },
          forecast: {
            direction: <ListView['direction']>'desc',
            column: undefined,
            text: undefined,
          },
        },
      };

    case ActionType.USERS:
      return {
        ...state,
        users: [...action.payload],
      };
    case ActionType.USER_ADD:
      return {
        ...state,
        users: [...state.users, action.payload],
      };

    case ActionType.USER_SETTINGS_UPDATE:
      return {
        ...state,
        session: {
          ...state.session,
          user: { ...action.payload },
        },
        users: [
          ...state.users.map((item: User) => {
            if (item.id === action.payload.id) {
              return { ...action.payload };
            } else {
              return { ...item };
            }
          }),
        ],
      };

    case ActionType.CARDS:
      // check if cards were found that are not on the board
      action.payload.map((card) => {
        if (!BoardHelper.isOnBoard(card, state.board) && isValidId(card.laneId)) {
          BoardHelper.add(card, state.board);
        }

        if (!BoardHelper.isInCorrectLane(card, state.board)) {
          const position = BoardHelper.getPosition(card, state.board);

          if (position) {
            BoardHelper.move(card, state.board[position.laneId], state.board[card.laneId]);
          }
        }
      });

      return {
        ...state,
        cards: [...action.payload],
        board: {
          ...state.board,
        },
      };

    case ActionType.CARD_ADD:
      if (state.board[action.payload.laneId]) {
        state.board[action.payload.laneId].push(action.payload.id);
      } else {
        state.board[action.payload.laneId] = [action.payload.id];
      }

      return {
        ...state,
        cards: [...state.cards, action.payload],

        ui: {
          ...state.ui,
          state: Default.ui.state,
          id: undefined,
          modal: undefined,
          text: undefined,
        },
        board: {
          ...state.board,
        },
      };

    case ActionType.CARD_MOVE:
      const updated = {
        ...state.board,
      };

      const [from, to] = BoardHelper.move(
        action.payload.card,
        updated[action.payload.from],
        updated[action.payload.to],
        action.payload.index
      );

      updated[action.payload.from] = from;
      updated[action.payload.to] = to;

      return {
        ...state,
        board: updated,
      };

    case ActionType.CARD_UPDATE:
      return {
        ...state,
        cards: [
          ...state.cards.map((item: Card) => {
            if (item.id === action.payload.id) {
              return { ...action.payload };
            } else {
              return { ...item };
            }
          }),
        ],
      };
    case ActionType.CARD_UPDATE_ON_SERVER:
      return {
        ...state,
        cards: [
          ...state.cards.map((item: Card) => {
            if (item.id === action.payload.id) {
              return { ...action.payload };
            } else {
              return { ...item };
            }
          }),
        ],
      };

    case ActionType.CARD_DELETE:
      state.board[action.payload.laneId] = BoardHelper.remove(action.payload, state.board);

      return {
        ...state,
        cards: [
          ...state.cards.filter((item: Card) => {
            if (item.id !== action.payload.id) {
              return { ...item };
            }
          }),
        ],
        board: {
          ...state.board,
        },
      };

    case ActionType.ACCOUNTS:
      return {
        ...state,
        accounts: [...action.payload],
      };

    case ActionType.ACCOUNT_UPDATE:
      return {
        ...state,
        accounts: [
          ...state.accounts.map((item: Account) => {
            if (item.id === action.payload.id) {
              return { ...action.payload };
            } else {
              return { ...item };
            }
          }),
        ],
      };

    case ActionType.ACCOUNT_ADD:
      return {
        ...state,
        accounts: [...state.accounts, action.payload],

        ui: {
          ...state.ui,
          state: Default.ui.state,
          id: undefined,
          modal: undefined,
          text: undefined,
        },
      };

    case ActionType.TEAM_UPDATE:
      return {
        ...state,
        session: {
          ...state.session,
          team: {
            ...state.session.team,
            currency: action.payload,
          },
        },
      };

    case ActionType.SCHEMAS:
      return {
        ...state,
        schemas: [...action.payload],
      };

    case ActionType.LANES:
      const lanes = action.payload.sort((a, b) => a.index - b.index);

      return {
        ...state,
        lanes: [...lanes],
      };

    case ActionType.LANE_UPDATE:
      return {
        ...state,
        lanes: [
          ...state.lanes.map((item: Lane) => {
            if (item.id === action.payload.id) {
              return { ...action.payload };
            } else {
              return { ...item };
            }
          }),
        ],
      };

    case ActionType.BROWSER_STATE:
      return {
        ...state,
        browser: { ...state.browser, state: action.payload },
      };
    case ActionType.USER_INTERFACE_STATE:
      return {
        ...state,
        ui: {
          ...state.ui,
          state: action.payload.state,
          id: action.payload.id,
          modal: state.ui.modal,
          text: undefined,
        },
      };

    case ActionType.USER_INTERFACE_MODAL:
      return {
        ...state,
        ui: {
          ...state.ui,
          modal: action.payload.modal,
          text: action.payload.text,
        },
      };

    case ActionType.FILTER_UPDATE:
      return {
        ...state,
        ui: {
          ...state.ui,
          filters: {
            mode: [...action.payload.mode],
            text: action.payload.text,
            userId: action.payload.userId,
          },
        },
      };

    case ActionType.LIST_VIEW:
      return {
        ...state,
        ui: {
          ...state.ui,
          [action.payload.name]: { ...action.payload.view },
        },
      };

    default:
      return state;
  }
};
