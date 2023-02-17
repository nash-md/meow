import logger from 'redux-logger';
import { configureStore } from '@reduxjs/toolkit';
import { application } from '../reducers/ApplicationReducer';
import { ApplicationStore } from './ApplicationStore';

export const store = configureStore({
  reducer: application,
  middleware: [logger],
});

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type ApplicatonDispatch = typeof store.dispatch;

export const selectIsPageLoaded = (store: RootState) =>
  store.browser.isPageLoaded;
export const selectBrowserState = (store: RootState) => store.browser.state;
export const selectToken = (store: RootState) => store.session.token;
export const selectCards = (store: RootState) => store.cards;
export const selectUsers = (store: RootState) => store.users;
export const selectUser = (store: ApplicationStore, id: string | undefined) =>
  store.users.find((user) => user.id === id);
export const selectLanes = (store: RootState) => store.lanes;
export const selectLane = (store: ApplicationStore, id: string) =>
  store.lanes.find((lane) => lane.id === id);
export const selectSchemas = (store: RootState) => store.schemas;
export const selectSchemaByType = (store: ApplicationStore, type: string) =>
  store.schemas.find((schema) => schema.type === type);
export const selectName = (store: RootState) => store.session.user.name;
export const selectCurrency = (store: RootState) =>
  store.session.account.currency;
export const selectAccountId = (store: RootState) => store.session.account.id;
export const selectInterfaceState = (store: RootState) => store.ui.state;
export const selectInterfaceStateId = (store: RootState) => store.ui.id;
export const selectModal = (store: RootState) => store.ui.modal;
export const selectModalText = (store: RootState) => store.ui.text;
export const selectCard = (store: ApplicationStore, id: string | undefined) =>
  store.cards.find((card) => card.id === id);
