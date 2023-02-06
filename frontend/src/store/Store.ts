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
export const selectName = (store: RootState) => store.session.user.name;
export const selectCurrency = (store: RootState) =>
  store.session.account.currency;
export const selectAccountId = (store: RootState) => store.session.account.id;
export const selectInterfaceState = (store: RootState) => store.ui.state;
export const selectInterfaceStateId = (store: RootState) => store.ui.id;
export const selectCard = (store: ApplicationStore, id: string) =>
  store.cards.find((card) => card.id === id);
