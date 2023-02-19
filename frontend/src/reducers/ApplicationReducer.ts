import { ActionType, ApplicationAction } from '../actions/Actions';
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
      const session = state.session;

      if (action.payload) {
        session.token = action.payload.token;
        session.user = action.payload.user;
        session.account = action.payload.account;
      }

      let board = {};

      if (action.payload && action.payload.board) {
        board = { ...action.payload.board };
      }

      return {
        ...state,
        session: {
          ...session,
        },
        browser: {
          ...state.browser,
          isPageLoaded: true,
        },
        board: { ...board },
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
          account: {
            ...action.payload.account,
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
          user: {
            id: undefined,
            name: undefined,
            animal: undefined,
          },
          account: {
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
        if (!isOnBoard(card.id, state.board) && isValidId(card.lane)) {
          if (state.board[card.lane]) {
            state.board[card.lane].push(card.id);
          } else {
            state.board[card.lane] = [card.id];
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
      state.board[action.payload.lane].push(action.payload.id);

      return {
        ...state,
        cards: [...state.cards, action.payload],

        ui: {
          state: Default.ui.state,
          id: undefined,
          modal: undefined,
          text: undefined,
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
        cards: [...state.cards, action.payload],
        board: updated,
      };

    case ActionType.CARD_UPDATE:
      return {
        ...state,
        cards: [
          ...state.cards.map((item: any) => {
            // TODO remove any
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
          ...state.cards.map((item: any) => {
            // TODO remove any
            if (item.id === action.payload.id) {
              return { ...action.payload };
            } else {
              return { ...item };
            }
          }),
        ],
      };

    case ActionType.CARD_DELETE:
      state.board[action.payload.lane] = removeCardFromBoard(
        action.payload.id,
        state.board[action.payload.lane]
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
    case ActionType.ACCOUNT_UPDATE:
      return {
        ...state,
        session: {
          ...state.session,
          account: {
            ...state.session.account,
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
    default:
      return state;
  }
};
