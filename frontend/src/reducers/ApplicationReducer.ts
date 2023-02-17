import { ActionType, ApplicationAction } from '../actions/Actions';
import { Card } from '../interfaces/Card';
import { Lane } from '../interfaces/Lane';
import { Default } from '../store/Default';

export const application = (state = Default, action: ApplicationAction) => {
  switch (action.type) {
    case ActionType.PAGE_LOAD:
      const session = state.session;

      if (action.payload) {
        session.token = action.payload.token;
        session.user = action.payload.user;
        session.account = action.payload.account;
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
          },
          account: {
            id: undefined,
            currency: undefined,
          },
        },
        cards: [],
        lanes: [],
        users: [],
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
      return {
        ...state,
        cards: [...action.payload],
      };

    case ActionType.CARD_ADD:
      return {
        ...state,
        cards: [...state.cards, action.payload],
      };
    case ActionType.CARD_UPDATE:
      if (state.cards.some((card: Card) => card.id === action.payload.id)) {
        return {
          ...state,
          cards: [
            ...state.cards.map((item: any) => {
              if (item.id === action.payload.id) {
                return { ...action.payload };
              } else {
                return { ...item };
              }
            }),
          ],
        };
      } else {
        return {
          ...state,
          cards: [...state.cards, action.payload],
          ui: {
            state: Default.ui.state,
            id: undefined,
            modal: undefined,
            text: undefined,
          },
        };
      }
    case ActionType.CARD_DELETE:
      return {
        ...state,
        cards: [
          ...state.cards.filter((item: Card) => {
            if (item.id !== action.payload) {
              return { ...item };
            }
          }),
        ],
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
            if (item.key === action.payload.key) {
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
