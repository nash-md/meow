import { createListenerMiddleware } from '@reduxjs/toolkit';
import {
  ActionType,
  ApplicationCardUpdateAction,
  showModalError,
} from '../actions/Actions';
import { RequestError } from '../errors/RequestError';
import { RequestTimeoutError } from '../errors/RequestTimeoutError';
import { RequestHelper } from '../helpers/RequestHelper';
import { ApplicationStore } from './ApplicationStore';
import { store } from './Store';

export const cardUpdateListener = createListenerMiddleware();

cardUpdateListener.startListening({
  type: ActionType.CARD_UPDATE,
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState() as ApplicationStore;

    const client = new RequestHelper(
      process.env.REACT_APP_URL,
      state.session.token
    );

    const casted = action as ApplicationCardUpdateAction;

    try {
      const card = await client.updateCard(casted.payload);

      store.dispatch({
        type: ActionType.CARD_REFRESH,
        payload: { ...card },
      });
    } catch (error) {
      let message = '';

      // TODO refactor
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
