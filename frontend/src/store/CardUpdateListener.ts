import { createListenerMiddleware } from '@reduxjs/toolkit';
import {
  ActionType,
  ApplicationCardUpdateAction,
  showModalError,
} from '../actions/Actions';
import { RequestHelper, getBaseUrl } from '../helpers/RequestHelper';
import { ApplicationStore } from './ApplicationStore';
import { store } from './Store';
import { getErrorMessage } from '../helpers/ErrorHelper';

export const cardUpdateListener = createListenerMiddleware();

cardUpdateListener.startListening({
  type: ActionType.CARD_UPDATE,
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState() as ApplicationStore;

    const client = new RequestHelper(getBaseUrl(), state.session.token);

    const casted = action as ApplicationCardUpdateAction;

    try {
      const card = await client.updateCard(casted.payload);

      store.dispatch({
        type: ActionType.CARD_REFRESH,
        payload: { ...card },
      });
    } catch (error) {
      console.error(error);
      const message = await getErrorMessage(error);

      store.dispatch(showModalError(message));
    }

    listenerApi.cancelActiveListeners();
  },
});
