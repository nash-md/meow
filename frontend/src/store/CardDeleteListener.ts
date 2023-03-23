import { createListenerMiddleware } from '@reduxjs/toolkit';
import {
  ActionType,
  ApplicationCardDeleteAction,
  showModalError,
} from '../actions/Actions';
import { RequestError } from '../errors/RequestError';
import { RequestTimeoutError } from '../errors/RequestTimeoutError';
import { RequestHelper } from '../helpers/RequestHelper';
import { CardStatus } from '../interfaces/Card';
import { ApplicationStore } from './ApplicationStore';
import { store } from './Store';

export const cardDeleteListener = createListenerMiddleware();

cardDeleteListener.startListening({
  type: ActionType.CARD_DELETE,
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState() as ApplicationStore;

    const client = new RequestHelper(
      import.meta.env.VITE_URL,
      state.session.token
    );

    const casted = action as ApplicationCardDeleteAction;

    try {
      await client.updateCard({
        ...casted.payload,
        status: CardStatus.Deleted,
      }); // TODO update with one API call

      await client.updateBoard(state.session.user!.id, state.board);
    } catch (error) {
      let message = '';

      if (error instanceof RequestError) {
        const parsed = await error.response.json();

        const text = parsed.description ? parsed.description : parsed.name;

        message = `Failed:  ${text}`;
      } else if (error instanceof RequestTimeoutError) {
        message = 'Request Timeout Error, is your backend available?';
      } else if (error instanceof TypeError) {
        message = 'Network Request Failed, is your backend available?';
      } else {
        message = 'Failed: unknown, check JS Console';
      }

      store.dispatch(showModalError(message));
    }

    listenerApi.cancelActiveListeners();
  },
});
