import { createListenerMiddleware } from '@reduxjs/toolkit';
import {
  ActionType,
  ApplicationCardLaneAction,
  showModalError,
} from '../actions/Actions';
import { RequestHelper, getBaseUrl } from '../helpers/RequestHelper';
import { ApplicationStore } from './ApplicationStore';
import { store } from './Store';
import { getErrorMessage } from '../helpers/ErrorHelper';

export const cardLaneListener = createListenerMiddleware();

cardLaneListener.startListening({
  type: ActionType.CARD_LANE,
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState() as ApplicationStore;

    const client = new RequestHelper(getBaseUrl(), state.session.token);

    const casted = action as ApplicationCardLaneAction;

    try {
      const card = await client.updateCard(casted.payload.card); // TODO update with one API call

      store.dispatch({
        type: ActionType.CARD_REFRESH,
        payload: { ...card },
      });

      await client.updateBoard(state.session.user!.id, state.board);
    } catch (error) {
      console.error(error);
      const message = await getErrorMessage(error);

      store.dispatch(showModalError(message));
    }

    listenerApi.cancelActiveListeners();
  },
});
