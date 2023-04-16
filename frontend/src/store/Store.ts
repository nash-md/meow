import logger from 'redux-logger';
import { configureStore } from '@reduxjs/toolkit';
import { application } from '../reducers/ApplicationReducer';
import { ApplicationStore } from './ApplicationStore';
import { cardUpdateListener } from './CardUpdateListener';
import { cardLaneListener } from './CardLaneListener';
import { cardDeleteListener } from './CardDeleteListener';
import { SchemaType } from '../interfaces/Schema';

export const store = configureStore({
  reducer: application,
  middleware: [
    logger,
    cardLaneListener.middleware,
    cardUpdateListener.middleware,
    cardDeleteListener.middleware,
  ],
});

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type ApplicatonDispatch = typeof store.dispatch;

export const selectIsPageLoaded = (store: RootState) =>
  store.browser.isPageLoaded;
export const selectBrowserState = (store: RootState) => store.browser.state;
export const selectToken = (store: RootState) => store.session.token;
export const selectCards = (store: RootState) => store.cards;
export const selectCardByLaneId = (
  store: ApplicationStore,
  id: string | undefined
) => store.cards.filter((card) => card.laneId === id);
export const selectBoard = (store: RootState) => store.board;
export const selectBoardByLaneId = (store: ApplicationStore, id: string) =>
  store.board[id];
export const selectAccounts = (store: RootState) => store.accounts;
export const selectAccount = (
  store: ApplicationStore,
  id: string | undefined
) => store.accounts.find((account) => account.id === id);
export const selectUsers = (store: ApplicationStore) => store.users;
export const selectUser = (store: ApplicationStore, id: string | undefined) =>
  store.users.find((user) => user.id === id);
export const selectLanes = (store: ApplicationStore) => store.lanes;
export const selectLane = (store: ApplicationStore, id: string) =>
  store.lanes.find((lane) => lane.id === id);
export const selectSchemas = (store: ApplicationStore) => store.schemas;
export const selectSchemaByType = (store: ApplicationStore, type: SchemaType) =>
  store.schemas.find((schema) => schema.type === type);
export const selectName = (store: ApplicationStore) => store.session.user?.name;
export const selectUserId = (store: ApplicationStore) => store.session.user?.id;
export const selectAnimal = (store: ApplicationStore) =>
  store.session.user?.animal;
export const selectCurrency = (store: ApplicationStore) =>
  store.session.team.currency;
export const selectTeamId = (store: ApplicationStore) => store.session.team.id;
export const selectInterfaceState = (store: ApplicationStore) => store.ui.state;
export const selectInterfaceStateId = (store: ApplicationStore) => store.ui.id;
export const selectModal = (store: ApplicationStore) => store.ui.modal;
export const selectModalText = (store: ApplicationStore) => store.ui.text;
export const selectCard = (store: ApplicationStore, id: string | undefined) =>
  store.cards.find((card) => card.id === id);
export const selectFilters = (store: ApplicationStore) => {
  return {
    mode: new Set(store.ui.filters.mode),
    text: store.ui.filters.text,
  };
};

export const selectFilterText = (store: ApplicationStore) =>
  store.ui.filters.text;
