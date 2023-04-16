import { ActionType, ApplicationAction } from '../actions/Actions';
import { Account } from '../interfaces/Account';
import { Board } from '../interfaces/Board';
import { Card } from '../interfaces/Card';
import { Lane } from '../interfaces/Lane';
import { Default } from '../store/Default';

// TODO move to helper
function isValidId(idStr: string): boolean {
  if (
    typeof idStr !== 'string' ||
    idStr.length !== 24 ||
    !/^[0-9a-fA-F]{24}$/.test(idStr)
  ) {
    return false;
  }
  return true;
}

function moveCardOnBoard(
  id: Card['id'],
  from: Card['id'][],
  to: Card['id'][] | undefined,
  index: number
): [Card['id'][], Card['id'][]] {
  const indexInFrom = from.findIndex((cardId) => cardId === id);

  if (indexInFrom === -1) {
    throw new Error(`card with id ${id} not found in from array`);
  }

  const [removedCardId] = from.splice(indexInFrom, 1);

  if (to) {
    to.splice(index, 0, removedCardId);
  } else {
    to = [id];
  }

  return [from, to];
}

function removeCardFromBoard(id: Card['id'], list: Card['id'][]) {
  const index = list.findIndex((cardId) => cardId === id);

  if (index === -1) {
    throw new Error(`card with id ${id} not found in from array`);
  }

  list.splice(index, 1);

  return list;
}

function isOnBoard(id: Card['id'], board: Board | undefined) {
  for (const laneId in board) {
    if (board[laneId].some((card) => card === id)) {
      return true;
    }
  }
  return false;
}
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
        ui: {
          ...state.ui,
          modal: undefined,
          text: undefined,
          filters: {
            mode: [],
            text: '',
          },
        },
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

    case ActionType.CARDS:
      // check if cards were found that are not on the board
      action.payload.map((card) => {
        if (!isOnBoard(card.id, state.board) && isValidId(card.laneId)) {
          if (state.board[card.laneId]) {
            state.board[card.laneId].push(card.id);
          } else {
            state.board[card.laneId] = [card.id];
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
          state: Default.ui.state,
          id: undefined,
          modal: undefined,
          text: undefined,
          filters: {
            ...state.ui.filters,
          },
        },
        board: {
          ...state.board,
        },
      };

    case ActionType.CARD_LANE:
      const updated = {
        ...state.board,
      };

      const [from, to] = moveCardOnBoard(
        action.payload.card.id,
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

    case ActionType.CARD_REFRESH:
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
      state.board[action.payload.laneId] = removeCardFromBoard(
        action.payload.id,
        state.board[action.payload.laneId]
      );

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
          state: Default.ui.state,
          id: undefined,
          modal: undefined,
          text: undefined,
          filters: {
            ...state.ui.filters,
          },
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
          state: action.payload.state,
          id: action.payload.id,
          modal: state.ui.modal,
          text: undefined,
          filters: {
            ...state.ui.filters,
          },
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
          },
        },
      };

    default:
      return state;
  }
};
