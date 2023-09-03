import logger from 'redux-logger';
import { configureStore } from '@reduxjs/toolkit';
import { application } from '../reducers/ApplicationReducer';
import { ApplicationStore, ListName } from './ApplicationStore';
import { cardUpdateListener } from './CardUpdateListener';
import { cardLaneListener } from './CardLaneListener';
import { cardDeleteListener } from './CardDeleteListener';
import { SchemaReferenceAttribute, SchemaType } from '../interfaces/Schema';
import { UserStatus } from '../interfaces/User';
import { SchemaHelper } from '../helpers/SchemaHelper';

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

export const selectIsPageLoaded = (store: RootState) => store.browser.isPageLoaded;
export const selectBrowserState = (store: RootState) => store.browser.state;
export const selectToken = (store: RootState) => store.session.token;
export const selectCards = (store: RootState) => store.cards;
export const selectCardsByLaneId = (store: ApplicationStore, id: string | undefined) =>
  store.cards.filter((card) => card.laneId === id);
export const selectBoard = (store: RootState) => store.board;
export const selectBoardByLaneId = (store: ApplicationStore, id: string) => store.board[id];
export const selectAccounts = (store: RootState) => store.accounts;
export const selectAccount = (store: ApplicationStore, id: string | undefined) =>
  store.accounts.find((account) => account.id === id);
export const selectUsers = (store: ApplicationStore) => store.users;
export const selectActiveUsers = (store: ApplicationStore) =>
  store.users.filter((user) => user.status === UserStatus.Enabled);
export const selectUser = (store: ApplicationStore, id: string | undefined) =>
  store.users.find((user) => user.id === id);
export const selectLanes = (store: ApplicationStore) => store.lanes;
export const selectLane = (store: ApplicationStore, id?: string) => {
  return id ? store.lanes.find((lane) => lane.id === id) : undefined;
};

export const selectSchemas = (store: ApplicationStore) => store.schemas;
export const selectSchemaByType = (store: ApplicationStore, type: SchemaType) =>
  store.schemas.find((schema) => schema.type === type);
export const selectSchemaAttributeById = (store: ApplicationStore, id: string) =>
  store.schemas.find((schema) => schema.id === id);
export const selectName = (store: ApplicationStore) => store.session.user?.name;
export const selectUserId = (store: ApplicationStore) => store.session.user?.id;
export const selectAnimal = (store: ApplicationStore) => store.session.user?.animal;
export const selectColor = (store: ApplicationStore) => store.session.user?.color;
export const selectCurrency = (store: ApplicationStore) => store.session.team.currency;
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
    userId: store.ui.filters.userId,
  };
};
export const selectAccountListView = (store: ApplicationStore) => store.ui.accounts;
export const selectUserListView = (store: ApplicationStore) => store.ui.users;
export const selectView = (store: ApplicationStore, name: ListName) => store.ui[name];
export const selectViewColumns = (store: ApplicationStore, name: ListName) =>
  store.ui[name].columns;
export const selectReferencesTo = (store: ApplicationStore, entity: string) => {
  const list: SchemaReferenceAttribute[] = [];
  store.schemas.forEach((schema) => {
    return schema.attributes?.forEach((attribute) => {
      if (SchemaHelper.isReferenceAttribute(attribute) && attribute.entity === entity) {
        list.push({ ...attribute });
      }
    });
  });

  return list;
};

export const selectIntegrationByKey = (store: ApplicationStore, key: string) =>
  store.session.team.integrations.some((integration) => integration.key === key);
